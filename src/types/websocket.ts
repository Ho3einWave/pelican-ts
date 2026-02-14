/** WebSocket message format sent/received over the connection. */
export interface WebSocketMessage {
  event: string;
  args?: string[];
}

/** Events the client sends to the server. */
export type ClientEvent = 'auth' | 'send command' | 'set state';

/** Events the server sends to the client. */
export type ServerEvent =
  | 'auth success'
  | 'console output'
  | 'status'
  | 'stats'
  | 'token expiring'
  | 'token expired'
  | 'daemon message'
  | 'daemon error'
  | 'install output'
  | 'install started'
  | 'install completed'
  | 'transfer logs'
  | 'transfer status';

/** Server power status values received in 'status' events. */
export type ServerStatus = 'running' | 'starting' | 'stopping' | 'offline';

/** Resource statistics parsed from the 'stats' event args[0] JSON. */
export interface WebSocketStats {
  memory_bytes: number;
  memory_limit_bytes: number;
  cpu_absolute: number;
  network: {
    rx_bytes: number;
    tx_bytes: number;
  };
  uptime: number;
  state: string;
  disk_bytes: number;
}

/** WebSocket close codes used by the Pterodactyl daemon. */
export enum WebSocketCloseCode {
  Normal = 1000,
  GoingAway = 1001,
  AbnormalClosure = 1006,
  AuthenticationFailed = 4001,
  TokenExpired = 4004,
}
