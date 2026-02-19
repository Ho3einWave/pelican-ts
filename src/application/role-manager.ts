import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type { CreateRoleParams, Role, UpdateRoleParams } from '../types/application/role.js';

const BASE = '/api/application/roles';

export class RoleManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<Role>> {
    return this.http.getList<Role>(BASE, options);
  }

  async get(roleId: number, options?: RequestOptions): Promise<Role> {
    return this.http.get<Role>(`${BASE}/${roleId}`, options);
  }

  async create(params: CreateRoleParams): Promise<Role> {
    return this.http.post<Role>(BASE, params);
  }

  async update(roleId: number, params: UpdateRoleParams): Promise<Role> {
    return this.http.patch<Role>(`${BASE}/${roleId}`, params);
  }

  async delete(roleId: number): Promise<void> {
    await this.http.delete(`${BASE}/${roleId}`);
  }
}
