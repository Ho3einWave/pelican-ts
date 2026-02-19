import { HttpClient } from '../core/http-client.js';
import type { ClientOptions, RateLimitInfo } from '../core/types.js';
import { DatabaseHostManager } from './database-host-manager.js';
import { EggManager } from './egg-manager.js';
import { MountManager } from './mount-manager.js';
import { NodeManager } from './node-manager.js';
import { RoleManager } from './role-manager.js';
import { ServerManager } from './server-manager.js';
import { UserManager } from './user-manager.js';

export class PelicanApplication {
  readonly users: UserManager;
  readonly servers: ServerManager;
  readonly nodes: NodeManager;
  readonly eggs: EggManager;
  readonly databaseHosts: DatabaseHostManager;
  readonly mounts: MountManager;
  readonly roles: RoleManager;
  private readonly http: HttpClient;

  constructor(options: ClientOptions) {
    this.http = new HttpClient(options);
    this.users = new UserManager(this.http);
    this.servers = new ServerManager(this.http);
    this.nodes = new NodeManager(this.http);
    this.eggs = new EggManager(this.http);
    this.databaseHosts = new DatabaseHostManager(this.http);
    this.mounts = new MountManager(this.http);
    this.roles = new RoleManager(this.http);
  }

  /** Current rate limit info from the last API response. */
  get rateLimit(): RateLimitInfo | null {
    return this.http.rateLimit;
  }
}
