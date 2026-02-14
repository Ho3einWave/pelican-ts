import type { HttpClient } from '../../core/http-client.js';
import type {
  CreateSubuserParams,
  Subuser,
  UpdateSubuserParams,
} from '../../types/client/subuser.js';

export class SubuserManager {
  private readonly base: string;

  constructor(
    private readonly http: HttpClient,
    serverId: string,
  ) {
    this.base = `/api/client/servers/${serverId}/users`;
  }

  async list(): Promise<Subuser[]> {
    const result = await this.http.getList<Subuser>(this.base);
    return result.data;
  }

  async get(userId: string): Promise<Subuser> {
    return this.http.get<Subuser>(`${this.base}/${userId}`);
  }

  async create(params: CreateSubuserParams): Promise<Subuser> {
    return this.http.post<Subuser>(this.base, params);
  }

  async update(userId: string, params: UpdateSubuserParams): Promise<Subuser> {
    return this.http.post<Subuser>(`${this.base}/${userId}`, params);
  }

  async remove(userId: string): Promise<void> {
    await this.http.delete(`${this.base}/${userId}`);
  }
}
