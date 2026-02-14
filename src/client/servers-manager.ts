import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type { Server } from '../types/client/server.js';

const BASE = '/api/client';

export class ServersManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<Server>> {
    return this.http.getList<Server>(`${BASE}`, options);
  }
}
