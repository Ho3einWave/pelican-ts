import type { HttpClient } from '../../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../../core/types.js';
import type { ActivityLog } from '../../types/client/account.js';
import type {
  PowerAction,
  Server,
  ServerResources,
  StartupVariable,
  WebSocketCredentials,
} from '../../types/client/server.js';
import { BackupManager } from './backup-manager.js';
import { DatabaseManager } from './database-manager.js';
import { FileManager } from './file-manager.js';
import { NetworkManager } from './network-manager.js';
import { ScheduleManager } from './schedule-manager.js';
import { SubuserManager } from './subuser-manager.js';

export class ServerContext {
  readonly files: FileManager;
  readonly databases: DatabaseManager;
  readonly backups: BackupManager;
  readonly schedules: ScheduleManager;
  readonly network: NetworkManager;
  readonly subusers: SubuserManager;

  private readonly base: string;

  constructor(
    private readonly http: HttpClient,
    serverId: string,
  ) {
    this.base = `/api/client/servers/${serverId}`;
    this.files = new FileManager(http, serverId);
    this.databases = new DatabaseManager(http, serverId);
    this.backups = new BackupManager(http, serverId);
    this.schedules = new ScheduleManager(http, serverId);
    this.network = new NetworkManager(http, serverId);
    this.subusers = new SubuserManager(http, serverId);
  }

  async getDetails(options?: RequestOptions): Promise<Server> {
    return this.http.get<Server>(this.base, options);
  }

  async getResources(): Promise<ServerResources> {
    return this.http.get<ServerResources>(`${this.base}/resources`);
  }

  async getActivity(options?: {
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<ActivityLog>> {
    return this.http.getList<ActivityLog>(`${this.base}/activity`, options);
  }

  async sendCommand(command: string): Promise<void> {
    await this.http.post<void>(`${this.base}/command`, { command });
  }

  async setPowerState(signal: PowerAction): Promise<void> {
    await this.http.post<void>(`${this.base}/power`, { signal });
  }

  async getWebSocketCredentials(): Promise<WebSocketCredentials> {
    const response = await this.http.raw('GET', `${this.base}/websocket`);
    const json = (await response.json()) as { data: WebSocketCredentials };
    return json.data;
  }

  async listStartupVariables(): Promise<StartupVariable[]> {
    const result = await this.http.getList<StartupVariable>(`${this.base}/startup`);
    return result.data;
  }

  async updateStartupVariable(key: string, value: string): Promise<StartupVariable> {
    return this.http.put<StartupVariable>(`${this.base}/startup/variable`, {
      key,
      value,
    });
  }

  async rename(name: string): Promise<void> {
    await this.http.post<void>(`${this.base}/settings/rename`, { name });
  }

  async updateDescription(description: string): Promise<void> {
    await this.http.post<void>(`${this.base}/settings/description`, { description });
  }

  async setDockerImage(dockerImage: string): Promise<void> {
    await this.http.put<void>(`${this.base}/settings/docker-image`, {
      docker_image: dockerImage,
    });
  }

  async reinstall(): Promise<void> {
    await this.http.post<void>(`${this.base}/settings/reinstall`);
  }
}
