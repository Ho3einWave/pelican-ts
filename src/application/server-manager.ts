import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type { AdminDatabase, CreateAdminDatabaseParams } from '../types/application/database.js';
import type {
  AdminServer,
  CreateServerParams,
  TransferServerParams,
  UpdateServerBuildParams,
  UpdateServerDetailsParams,
  UpdateServerStartupParams,
} from '../types/application/server.js';

const BASE = '/api/application/servers';

export class ServerManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<AdminServer>> {
    return this.http.getList<AdminServer>(BASE, options);
  }

  async get(serverId: number, options?: RequestOptions): Promise<AdminServer> {
    return this.http.get<AdminServer>(`${BASE}/${serverId}`, options);
  }

  async getByExternalId(externalId: string, options?: RequestOptions): Promise<AdminServer> {
    return this.http.get<AdminServer>(`${BASE}/external/${externalId}`, options);
  }

  async create(params: CreateServerParams): Promise<AdminServer> {
    return this.http.post<AdminServer>(BASE, params);
  }

  async updateDetails(serverId: number, params: UpdateServerDetailsParams): Promise<AdminServer> {
    return this.http.patch<AdminServer>(`${BASE}/${serverId}/details`, params);
  }

  async updateBuild(serverId: number, params: UpdateServerBuildParams): Promise<AdminServer> {
    return this.http.patch<AdminServer>(`${BASE}/${serverId}/build`, params);
  }

  async updateStartup(serverId: number, params: UpdateServerStartupParams): Promise<AdminServer> {
    return this.http.patch<AdminServer>(`${BASE}/${serverId}/startup`, params);
  }

  async suspend(serverId: number): Promise<void> {
    await this.http.post<void>(`${BASE}/${serverId}/suspend`);
  }

  async unsuspend(serverId: number): Promise<void> {
    await this.http.post<void>(`${BASE}/${serverId}/unsuspend`);
  }

  async reinstall(serverId: number): Promise<void> {
    await this.http.post<void>(`${BASE}/${serverId}/reinstall`);
  }

  async delete(serverId: number): Promise<void> {
    await this.http.delete(`${BASE}/${serverId}`);
  }

  async forceDelete(serverId: number): Promise<void> {
    await this.http.delete(`${BASE}/${serverId}/force`);
  }

  async transfer(serverId: number, params: TransferServerParams): Promise<void> {
    await this.http.post<void>(`${BASE}/${serverId}/transfer`, params);
  }

  async cancelTransfer(serverId: number): Promise<void> {
    await this.http.post<void>(`${BASE}/${serverId}/transfer/cancel`);
  }

  // Database sub-operations

  async listDatabases(
    serverId: number,
    options?: RequestOptions,
  ): Promise<PaginatedResult<AdminDatabase>> {
    return this.http.getList<AdminDatabase>(`${BASE}/${serverId}/databases`, options);
  }

  async getDatabase(
    serverId: number,
    databaseId: number,
    options?: RequestOptions,
  ): Promise<AdminDatabase> {
    return this.http.get<AdminDatabase>(`${BASE}/${serverId}/databases/${databaseId}`, options);
  }

  async createDatabase(
    serverId: number,
    params: CreateAdminDatabaseParams,
  ): Promise<AdminDatabase> {
    return this.http.post<AdminDatabase>(`${BASE}/${serverId}/databases`, params);
  }

  async resetDatabasePassword(serverId: number, databaseId: number): Promise<void> {
    await this.http.post<void>(`${BASE}/${serverId}/databases/${databaseId}/reset-password`);
  }

  async deleteDatabase(serverId: number, databaseId: number): Promise<void> {
    await this.http.delete(`${BASE}/${serverId}/databases/${databaseId}`);
  }
}
