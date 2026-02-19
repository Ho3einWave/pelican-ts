import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type { CreateMountParams, Mount, UpdateMountParams } from '../types/application/mount.js';

const BASE = '/api/application/mounts';

export class MountManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<Mount>> {
    return this.http.getList<Mount>(BASE, options);
  }

  async get(mountId: number, options?: RequestOptions): Promise<Mount> {
    return this.http.get<Mount>(`${BASE}/${mountId}`, options);
  }

  async create(params: CreateMountParams): Promise<Mount> {
    return this.http.post<Mount>(BASE, params);
  }

  async update(mountId: number, params: UpdateMountParams): Promise<Mount> {
    return this.http.patch<Mount>(`${BASE}/${mountId}`, params);
  }

  async delete(mountId: number): Promise<void> {
    await this.http.delete(`${BASE}/${mountId}`);
  }

  // Egg relationships

  async listEggs(mountId: number, options?: RequestOptions): Promise<PaginatedResult<unknown>> {
    return this.http.getList<unknown>(`${BASE}/${mountId}/eggs`, options);
  }

  async assignEggs(mountId: number, eggs: number[]): Promise<void> {
    await this.http.post<void>(`${BASE}/${mountId}/eggs`, { eggs });
  }

  async unassignEgg(mountId: number, eggId: number): Promise<void> {
    await this.http.delete(`${BASE}/${mountId}/eggs/${eggId}`);
  }

  // Node relationships

  async listNodes(mountId: number, options?: RequestOptions): Promise<PaginatedResult<unknown>> {
    return this.http.getList<unknown>(`${BASE}/${mountId}/nodes`, options);
  }

  async assignNodes(mountId: number, nodes: number[]): Promise<void> {
    await this.http.post<void>(`${BASE}/${mountId}/nodes`, { nodes });
  }

  async unassignNode(mountId: number, nodeId: number): Promise<void> {
    await this.http.delete(`${BASE}/${mountId}/nodes/${nodeId}`);
  }

  // Server relationships

  async listServers(mountId: number, options?: RequestOptions): Promise<PaginatedResult<unknown>> {
    return this.http.getList<unknown>(`${BASE}/${mountId}/servers`, options);
  }

  async assignServers(mountId: number, servers: number[]): Promise<void> {
    await this.http.post<void>(`${BASE}/${mountId}/servers`, { servers });
  }

  async unassignServer(mountId: number, serverId: number): Promise<void> {
    await this.http.delete(`${BASE}/${mountId}/servers/${serverId}`);
  }
}
