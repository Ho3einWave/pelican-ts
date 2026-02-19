import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type {
  AdminDatabaseHost,
  CreateDatabaseHostParams,
  UpdateDatabaseHostParams,
} from '../types/application/database-host.js';

const BASE = '/api/application/database-hosts';

export class DatabaseHostManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<AdminDatabaseHost>> {
    return this.http.getList<AdminDatabaseHost>(BASE, options);
  }

  async get(hostId: number, options?: RequestOptions): Promise<AdminDatabaseHost> {
    return this.http.get<AdminDatabaseHost>(`${BASE}/${hostId}`, options);
  }

  async create(params: CreateDatabaseHostParams): Promise<AdminDatabaseHost> {
    return this.http.post<AdminDatabaseHost>(BASE, params);
  }

  async update(hostId: number, params: UpdateDatabaseHostParams): Promise<AdminDatabaseHost> {
    return this.http.patch<AdminDatabaseHost>(`${BASE}/${hostId}`, params);
  }

  async delete(hostId: number): Promise<void> {
    await this.http.delete(`${BASE}/${hostId}`);
  }
}
