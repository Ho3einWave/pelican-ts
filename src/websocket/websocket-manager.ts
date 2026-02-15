import type { ServerStatus, WebSocketStats } from '../types/websocket.js';

/** Map of event names to their handler argument types. */
export interface WebSocketEventMap {
  'auth success': [];
  'console output': [output: string];
  status: [status: ServerStatus];
  stats: [stats: WebSocketStats];
  'token expiring': [];
  'token expired': [];
  'daemon message': [message: string];
  'daemon error': [message: string];
  'install output': [output: string];
  'install started': [];
  'install completed': [];
  'transfer logs': [log: string];
  'transfer status': [status: string];
}

export type WebSocketEvent = keyof WebSocketEventMap;

type Handler<E extends WebSocketEvent> = (...args: WebSocketEventMap[E]) => void;

export interface WebSocketManagerOptions {
  /** Full WebSocket URL returned by the API (the `socket` field from credentials). */
  socket: string;
  /** Panel origin URL (e.g. "https://panel.example.com"). Sent as the Origin header. */
  origin: string;
  /** Function that returns a fresh JWT token. Called on connect and token refresh. */
  getToken: () => Promise<string>;
  /** Maximum reconnect delay in ms. Default: 30000. */
  maxReconnectDelay?: number;
  /** Whether to auto-reconnect on disconnect. Default: true. */
  autoReconnect?: boolean;
}

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private listeners = new Map<WebSocketEvent, Set<Handler<any>>>();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private intentionalClose = false;

  private readonly socket: string;
  private readonly origin: string;
  private readonly getToken: () => Promise<string>;
  private readonly maxReconnectDelay: number;
  private readonly autoReconnect: boolean;

  constructor(options: WebSocketManagerOptions) {
    this.socket = options.socket;
    this.origin = options.origin.replace(/\/+$/, '');
    this.getToken = options.getToken;
    this.maxReconnectDelay = options.maxReconnectDelay ?? 30_000;
    this.autoReconnect = options.autoReconnect ?? true;
  }

  /** Connect to the WebSocket server. Resolves once authenticated, rejects on error. */
  async connect(): Promise<void> {
    if (this.ws) {
      return;
    }

    this.intentionalClose = false;
    const token = await this.getToken();

    return new Promise<void>((resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        this.off('auth success', onAuth);
        this.off('daemon error', onDaemonError);
      };

      const onAuth = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve();
      };

      const onDaemonError = (message: string) => {
        if (settled) return;
        settled = true;
        cleanup();
        reject(new Error(`WebSocket authentication failed: ${message}`));
      };

      this.on('auth success', onAuth);
      this.on('daemon error', onDaemonError);

      this.ws = new WebSocket(this.socket, {
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: this.origin,
        },
      } as any);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.sendAuth(token);
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(event.data as string);
      };

      this.ws.onclose = (event) => {
        this.ws = null;
        if (!settled) {
          settled = true;
          cleanup();
          reject(
            new Error(
              `WebSocket closed before authentication completed (code: ${
                event.code
              }, reason: ${event.reason || 'none'})`,
            ),
          );
          return;
        }
        if (!this.intentionalClose && this.autoReconnect) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        // onclose will fire after onerror, rejection handled there
      };
    });
  }

  /** Disconnect from the WebSocket server. */
  disconnect(): void {
    this.intentionalClose = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close(1000);
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  /** Send a console command to the server. */
  sendCommand(command: string): void {
    this.send('send command', [command]);
  }

  /** Send a power action to the server. */
  sendPowerAction(action: 'start' | 'stop' | 'restart' | 'kill'): void {
    this.send('set state', [action]);
  }

  /** Register an event handler. */
  on<E extends WebSocketEvent>(event: E, handler: Handler<E>): this {
    let handlers = this.listeners.get(event);
    if (!handlers) {
      handlers = new Set();
      this.listeners.set(event, handlers);
    }
    handlers.add(handler);
    return this;
  }

  /** Remove an event handler. */
  off<E extends WebSocketEvent>(event: E, handler: Handler<E>): this {
    const handlers = this.listeners.get(event);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.listeners.delete(event);
      }
    }
    return this;
  }

  /** Whether the WebSocket is currently connected. */
  get connected(): boolean {
    return this.ws?.readyState === 1;
  }

  private send(event: string, args: string[]): void {
    if (!this.ws || this.ws.readyState !== 1) {
      return;
    }
    this.ws.send(JSON.stringify({ event, args }));
  }

  private sendAuth(token: string): void {
    this.send('auth', [token]);
  }

  private handleMessage(raw: string): void {
    let message: { event: string; args?: string[] };
    try {
      message = JSON.parse(raw);
    } catch {
      return;
    }

    const { event, args } = message;

    // Handle token expiring by auto-refreshing
    if (event === 'token expiring') {
      this.refreshToken();
    }

    this.emit(event, args);
  }

  private emit(event: string, args?: string[]): void {
    const handlers = this.listeners.get(event as WebSocketEvent);
    if (!handlers) return;

    switch (event) {
      case 'auth success':
      case 'token expiring':
      case 'token expired':
      case 'install started':
      case 'install completed':
        for (const handler of handlers) {
          handler();
        }
        break;

      case 'stats': {
        const statsJson = args?.[0];
        if (statsJson) {
          try {
            const stats: WebSocketStats = JSON.parse(statsJson);
            for (const handler of handlers) {
              handler(stats);
            }
          } catch {
            // Invalid stats JSON
          }
        }
        break;
      }

      case 'status': {
        const status = args?.[0];
        if (status) {
          for (const handler of handlers) {
            handler(status);
          }
        }
        break;
      }

      default: {
        // console output, daemon message, daemon error, install output,
        // transfer logs, transfer status - all pass args[0] as string
        const value = args?.[0];
        if (value !== undefined) {
          for (const handler of handlers) {
            handler(value);
          }
        }
        break;
      }
    }
  }

  private async refreshToken(): Promise<void> {
    try {
      const token = await this.getToken();
      this.sendAuth(token);
    } catch {
      // Token refresh failed, connection will eventually expire
    }
  }

  private scheduleReconnect(): void {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), this.maxReconnectDelay);
    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }
}
