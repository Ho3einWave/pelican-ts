import type { HttpClient } from '../../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../../core/types.js';
import type { Backup, CreateBackupParams } from '../../types/client/backup.js';
import type { SignedUrl } from '../../types/client/file.js';

export class BackupManager {
  private readonly base: string;

  constructor(
    private readonly http: HttpClient,
    serverId: string,
  ) {
    this.base = `/api/client/servers/${serverId}/backups`;
  }

  async list(options?: RequestOptions): Promise<PaginatedResult<Backup>> {
    return this.http.getList<Backup>(this.base, options);
  }

  async get(backupId: string): Promise<Backup> {
    return this.http.get<Backup>(`${this.base}/${backupId}`);
  }

  async create(params?: CreateBackupParams): Promise<Backup> {
    return this.http.post<Backup>(this.base, params);
  }

  async getDownloadUrl(backupId: string): Promise<string> {
    const result = await this.http.get<SignedUrl>(
      `${this.base}/${backupId}/download`,
    );
    return result.url;
  }

  async delete(backupId: string): Promise<void> {
    await this.http.delete(`${this.base}/${backupId}`);
  }

  async restore(backupId: string): Promise<void> {
    await this.http.post<void>(`${this.base}/${backupId}/restore`);
  }

  async toggleLock(backupId: string): Promise<void> {
    await this.http.post<void>(`${this.base}/${backupId}/lock`);
  }
}
