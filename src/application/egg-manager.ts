import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type { Egg } from '../types/application/egg.js';

const BASE = '/api/application/eggs';

export class EggManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<Egg>> {
    return this.http.getList<Egg>(BASE, options);
  }

  async get(eggId: number, options?: RequestOptions): Promise<Egg> {
    return this.http.get<Egg>(`${BASE}/${eggId}`, options);
  }

  async delete(eggId: number): Promise<void> {
    await this.http.delete(`${BASE}/${eggId}`);
  }

  async deleteByUuid(uuid: string): Promise<void> {
    await this.http.delete(`${BASE}/${uuid}`);
  }

  async export(eggId: number): Promise<Record<string, unknown>> {
    const response = await this.http.raw('GET', `${BASE}/${eggId}/export`);
    return response.json() as Promise<Record<string, unknown>>;
  }

  async import(body: Record<string, unknown>): Promise<Egg> {
    return this.http.post<Egg>(`${BASE}/import`, body);
  }
}
