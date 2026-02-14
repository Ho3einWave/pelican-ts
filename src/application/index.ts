import { HttpClient } from '../core/http-client.js';
import type { ClientOptions, RateLimitInfo } from '../core/types.js';
import { LocationManager } from './location-manager.js';
import { NestManager } from './nest-manager.js';
import { NodeManager } from './node-manager.js';
import { ServerManager } from './server-manager.js';
import { UserManager } from './user-manager.js';

export class PteroApplication {
  readonly users: UserManager;
  readonly servers: ServerManager;
  readonly nodes: NodeManager;
  readonly locations: LocationManager;
  readonly nests: NestManager;
  private readonly http: HttpClient;

  constructor(options: ClientOptions) {
    this.http = new HttpClient(options);
    this.users = new UserManager(this.http);
    this.servers = new ServerManager(this.http);
    this.nodes = new NodeManager(this.http);
    this.locations = new LocationManager(this.http);
    this.nests = new NestManager(this.http);
  }

  /** Current rate limit info from the last API response. */
  get rateLimit(): RateLimitInfo | null {
    return this.http.rateLimit;
  }
}
