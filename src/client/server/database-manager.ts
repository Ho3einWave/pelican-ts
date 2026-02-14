import type { HttpClient } from '../../core/http-client.js';
import type {
  CreateDatabaseParams,
  Database,
} from '../../types/client/database.js';

export class DatabaseManager {
  private readonly base: string;

  constructor(
    private readonly http: HttpClient,
    serverId: string,
  ) {
    this.base = `/api/client/servers/${serverId}/databases`;
  }

  async list(): Promise<Database[]> {
    const result = await this.http.getList<Database>(this.base);
    return result.data;
  }

  async create(params: CreateDatabaseParams): Promise<Database> {
    return this.http.post<Database>(this.base, params);
  }

  async rotatePassword(databaseId: string): Promise<Database> {
    return this.http.post<Database>(
      `${this.base}/${databaseId}/rotate-password`,
    );
  }

  async delete(databaseId: string): Promise<void> {
    await this.http.delete(`${this.base}/${databaseId}`);
  }
}
