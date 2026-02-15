import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type { CreateAllocationParams, NodeAllocation } from '../types/application/allocation.js';
import type { CreateNodeParams, Node, UpdateNodeParams } from '../types/application/node.js';

const BASE = '/api/application/nodes';

export class NodeManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<Node>> {
    return this.http.getList<Node>(BASE, options);
  }

  async get(nodeId: number, options?: RequestOptions): Promise<Node> {
    return this.http.get<Node>(`${BASE}/${nodeId}`, options);
  }

  async getDeployable(options?: RequestOptions): Promise<PaginatedResult<Node>> {
    return this.http.getList<Node>(`${BASE}/deployable`, options);
  }

  async create(params: CreateNodeParams): Promise<Node> {
    return this.http.post<Node>(BASE, params);
  }

  async update(nodeId: number, params: UpdateNodeParams): Promise<Node> {
    return this.http.patch<Node>(`${BASE}/${nodeId}`, params);
  }

  async delete(nodeId: number): Promise<void> {
    await this.http.delete(`${BASE}/${nodeId}`);
  }

  async getConfig(nodeId: number): Promise<Record<string, unknown>> {
    const response = await this.http.raw('GET', `${BASE}/${nodeId}/configuration`);
    return response.json() as Promise<Record<string, unknown>>;
  }

  // Allocation sub-operations

  async listAllocations(
    nodeId: number,
    options?: RequestOptions,
  ): Promise<PaginatedResult<NodeAllocation>> {
    return this.http.getList<NodeAllocation>(`${BASE}/${nodeId}/allocations`, options);
  }

  async createAllocations(nodeId: number, params: CreateAllocationParams): Promise<void> {
    await this.http.post<void>(`${BASE}/${nodeId}/allocations`, params);
  }

  async deleteAllocation(nodeId: number, allocationId: number): Promise<void> {
    await this.http.delete(`${BASE}/${nodeId}/allocations/${allocationId}`);
  }
}
