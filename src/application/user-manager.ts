import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type {
  AdminUser,
  CreateUserParams,
  UpdateUserParams,
} from '../types/application/user.js';

const BASE = '/api/application/users';

export class UserManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<AdminUser>> {
    return this.http.getList<AdminUser>(BASE, options);
  }

  async get(userId: number, options?: RequestOptions): Promise<AdminUser> {
    return this.http.get<AdminUser>(`${BASE}/${userId}`, options);
  }

  async getByExternalId(externalId: string, options?: RequestOptions): Promise<AdminUser> {
    return this.http.get<AdminUser>(`${BASE}/external/${externalId}`, options);
  }

  async create(params: CreateUserParams): Promise<AdminUser> {
    return this.http.post<AdminUser>(BASE, params);
  }

  async update(userId: number, params: UpdateUserParams): Promise<AdminUser> {
    return this.http.patch<AdminUser>(`${BASE}/${userId}`, params);
  }

  async delete(userId: number): Promise<void> {
    await this.http.delete(`${BASE}/${userId}`);
  }
}
