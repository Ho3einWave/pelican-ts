import { HttpClient } from '../core/http-client.js';
import type { ClientOptions, RateLimitInfo } from '../core/types.js';
import { AccountManager } from './account-manager.js';
import { ServerContext } from './server/server-context.js';
import { ServersManager } from './servers-manager.js';

export class PteroClient {
  readonly account: AccountManager;
  readonly servers: ServersManager;
  private readonly http: HttpClient;

  constructor(options: ClientOptions) {
    this.http = new HttpClient(options);
    this.account = new AccountManager(this.http);
    this.servers = new ServersManager(this.http);
  }

  /** Create a server context scoped to a specific server identifier. */
  server(serverId: string): ServerContext {
    return new ServerContext(this.http, serverId);
  }

  /** Current rate limit info from the last API response. */
  get rateLimit(): RateLimitInfo | null {
    return this.http.rateLimit;
  }
}
