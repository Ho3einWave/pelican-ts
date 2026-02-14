import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type { Egg } from '../types/application/egg.js';
import type { Nest } from '../types/application/nest.js';

const BASE = '/api/application/nests';

export class NestManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<Nest>> {
    return this.http.getList<Nest>(BASE, options);
  }

  async get(nestId: number, options?: RequestOptions): Promise<Nest> {
    return this.http.get<Nest>(`${BASE}/${nestId}`, options);
  }

  async listEggs(nestId: number, options?: RequestOptions): Promise<PaginatedResult<Egg>> {
    return this.http.getList<Egg>(`${BASE}/${nestId}/eggs`, options);
  }

  async getEgg(nestId: number, eggId: number, options?: RequestOptions): Promise<Egg> {
    return this.http.get<Egg>(`${BASE}/${nestId}/eggs/${eggId}`, options);
  }
}
