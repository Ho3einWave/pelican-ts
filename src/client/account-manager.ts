import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult } from '../core/types.js';
import type {
  Account,
  ActivityLog,
  ApiKey,
  ApiKeyWithSecret,
  SSHKey,
} from '../types/client/account.js';

const BASE = '/api/client/account';

export class AccountManager {
  constructor(private readonly http: HttpClient) {}

  async getDetails(): Promise<Account> {
    return this.http.get<Account>(BASE);
  }

  async updateUsername(username: string): Promise<void> {
    await this.http.put<void>(`${BASE}/username`, { username });
  }

  async updateEmail(email: string): Promise<void> {
    await this.http.put<void>(`${BASE}/email`, { email });
  }

  async updatePassword(password: string, passwordConfirmation: string): Promise<void> {
    await this.http.put<void>(`${BASE}/password`, {
      password,
      password_confirmation: passwordConfirmation,
    });
  }

  async listApiKeys(): Promise<ApiKey[]> {
    const result = await this.http.getList<ApiKey>(`${BASE}/api-keys`);
    return result.data;
  }

  async createApiKey(description: string, allowedIps?: string[]): Promise<ApiKeyWithSecret> {
    const response = await this.http.raw('POST', `${BASE}/api-keys`, {
      description,
      allowed_ips: allowedIps ?? [],
    });
    const json = (await response.json()) as {
      object: string;
      attributes: ApiKey;
      meta: { secret_token: string };
    };
    return { ...json.attributes, secret_token: json.meta.secret_token };
  }

  async deleteApiKey(identifier: string): Promise<void> {
    await this.http.delete(`${BASE}/api-keys/${identifier}`);
  }

  async listSSHKeys(): Promise<SSHKey[]> {
    const result = await this.http.getList<SSHKey>(`${BASE}/ssh-keys`);
    return result.data;
  }

  async createSSHKey(name: string, publicKey: string): Promise<SSHKey> {
    return this.http.post<SSHKey>(`${BASE}/ssh-keys`, {
      name,
      public_key: publicKey,
    });
  }

  async deleteSSHKey(fingerprint: string): Promise<void> {
    await this.http.post<void>(`${BASE}/ssh-keys/remove`, { fingerprint });
  }

  async getActivity(options?: {
    page?: number;
    perPage?: number;
  }): Promise<PaginatedResult<ActivityLog>> {
    return this.http.getList<ActivityLog>(`${BASE}/activity`, options);
  }
}
