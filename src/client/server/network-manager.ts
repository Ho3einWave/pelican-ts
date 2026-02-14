import type { HttpClient } from '../../core/http-client.js';
import type { Allocation } from '../../types/client/network.js';

export class NetworkManager {
  private readonly base: string;

  constructor(
    private readonly http: HttpClient,
    serverId: string,
  ) {
    this.base = `/api/client/servers/${serverId}/network/allocations`;
  }

  async list(): Promise<Allocation[]> {
    const result = await this.http.getList<Allocation>(this.base);
    return result.data;
  }

  async assign(): Promise<Allocation> {
    return this.http.post<Allocation>(this.base);
  }

  async setPrimary(allocationId: number): Promise<Allocation> {
    return this.http.post<Allocation>(
      `${this.base}/${allocationId}/primary`,
    );
  }

  async updateNotes(
    allocationId: number,
    notes: string,
  ): Promise<Allocation> {
    return this.http.post<Allocation>(`${this.base}/${allocationId}`, {
      notes,
    });
  }

  async remove(allocationId: number): Promise<void> {
    await this.http.delete(`${this.base}/${allocationId}`);
  }
}
