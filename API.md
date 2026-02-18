# pterodactyl-ts API Reference

TypeScript SDK for the Pterodactyl panel. Two entry points: `PteroClient` (user API, `ptlc_` key) and `PteroApplication` (admin API, `ptla_` key). Plus `WebSocketManager` for real-time console/stats.

## Quick Start

```ts
import { PteroClient, PteroApplication, WebSocketManager } from "pterodactyl-ts";

// Client API
const client = new PteroClient({ baseUrl: "https://panel.example.com", apiKey: "ptlc_..." });
const servers = await client.servers.list();
const ctx = client.server("abc123");
await ctx.sendCommand("say hello");

// Application API
const app = new PteroApplication({ baseUrl: "https://panel.example.com", apiKey: "ptla_..." });
const users = await app.users.list();

// WebSocket
const creds = await ctx.getWebSocketCredentials();
const ws = new WebSocketManager({
  socket: creds.socket,
  origin: "https://panel.example.com",
  getToken: async () => (await ctx.getWebSocketCredentials()).token,
});
await ws.connect();
ws.on("console output", (line) => console.log(line));
```

---

## Common Types

```ts
interface ClientOptions { baseUrl: string; apiKey: string }

interface RequestOptions {
  filters?: Record<string, string>;  // ?filter[key]=value
  sort?: string;                     // prefix with - for desc
  include?: string[];                // relations to include
  page?: number;
  perPage?: number;
}

interface PaginatedResult<T> { data: T[]; pagination: PaginationMeta }
interface PaginationMeta { total: number; count: number; perPage: number; currentPage: number; totalPages: number }
interface RateLimitInfo { limit: number; remaining: number; reset: number }
```

## Errors

All extend `PteroError` which extends `Error`.

| Class | Extra Fields | When |
|---|---|---|
| `PteroError` | `status`, `code`, `errors: RawApiError[]` | Any API error |
| `PteroValidationError` | `fieldErrors: Record<string, string[]>` | 422 validation |
| `PteroRateLimitError` | `retryAfter: number` | 429 rate limit |

---

## PteroClient

`new PteroClient(options: ClientOptions)`

**Properties:** `account: AccountManager`, `servers: ServersManager`, `rateLimit: RateLimitInfo | null`
**Methods:** `server(serverId: string): ServerContext`

### AccountManager — `client.account`

| Method | Returns |
|---|---|
| `getDetails()` | `Account` |
| `get2FASetup()` | `TwoFactorSetup` |
| `enable2FA(code: string)` | `RecoveryTokens` |
| `disable2FA(password: string)` | `void` |
| `updateEmail(email, password)` | `void` |
| `updatePassword(current, new, confirm)` | `void` |
| `listApiKeys()` | `ApiKey[]` |
| `createApiKey(description, allowedIps?)` | `ApiKeyWithSecret` |
| `deleteApiKey(identifier)` | `void` |
| `listSSHKeys()` | `SSHKey[]` |
| `createSSHKey(name, publicKey)` | `SSHKey` |
| `deleteSSHKey(fingerprint)` | `void` |
| `getActivity(opts?: {page?, perPage?})` | `PaginatedResult<ActivityLog>` |

### ServersManager — `client.servers`

| Method | Returns |
|---|---|
| `list(options?: RequestOptions)` | `PaginatedResult<Server>` |

### ServerContext — `client.server(id)`

| Method | Returns |
|---|---|
| `getDetails(options?: RequestOptions)` | `Server` |
| `getResources()` | `ServerResources` |
| `sendCommand(command)` | `void` |
| `setPowerState(signal: PowerAction)` | `void` |
| `getWebSocketCredentials()` | `WebSocketCredentials` |
| `listStartupVariables()` | `StartupVariable[]` |
| `updateStartupVariable(key, value)` | `StartupVariable` |
| `rename(name)` | `void` |
| `reinstall()` | `void` |

`PowerAction = 'start' | 'stop' | 'restart' | 'kill'`

**Sub-managers:** `files`, `databases`, `backups`, `schedules`, `network`, `subusers`

### FileManager — `ctx.files`

| Method | Returns |
|---|---|
| `list(directory?)` | `FileObject[]` |
| `getContent(file)` | `string` |
| `writeFile(file, content)` | `void` |
| `getUploadUrl(directory?)` | `string` |
| `getDownloadUrl(file)` | `string` |
| `createFolder(root, name)` | `void` |
| `copy(location)` | `void` |
| `rename(root, files: {from,to}[])` | `void` |
| `delete(root, files: string[])` | `void` |
| `compress(root, files: string[])` | `FileObject` |
| `decompress(root, file)` | `void` |
| `chmod(root, files: {file,mode}[])` | `void` |
| `pull(url, directory, filename?)` | `void` |

### DatabaseManager — `ctx.databases`

| Method | Returns |
|---|---|
| `list()` | `Database[]` |
| `create({database, remote})` | `Database` |
| `rotatePassword(databaseId)` | `Database` |
| `delete(databaseId)` | `void` |

### BackupManager — `ctx.backups`

| Method | Returns |
|---|---|
| `list(options?: RequestOptions)` | `PaginatedResult<Backup>` |
| `get(backupId)` | `Backup` |
| `create({name?, ignored?, is_locked?}?)` | `Backup` |
| `getDownloadUrl(backupId)` | `string` |
| `delete(backupId)` | `void` |
| `restore(backupId)` | `void` |
| `toggleLock(backupId)` | `void` |

### ScheduleManager — `ctx.schedules`

| Method | Returns |
|---|---|
| `list()` | `Schedule[]` |
| `get(scheduleId: number)` | `Schedule` |
| `create(params: CreateScheduleParams)` | `Schedule` |
| `update(scheduleId, params: UpdateScheduleParams)` | `void` |
| `delete(scheduleId)` | `void` |
| `execute(scheduleId)` | `void` |
| `createTask(scheduleId, params: CreateScheduleTaskParams)` | `ScheduleTask` |
| `updateTask(scheduleId, taskId, params)` | `ScheduleTask` |
| `deleteTask(scheduleId, taskId)` | `void` |

```ts
interface CreateScheduleParams { name: string; minute: string; hour: string; day_of_month: string; month: string; day_of_week: string; is_active?: boolean; only_when_online?: boolean }
interface CreateScheduleTaskParams { action: 'command'|'power'|'backup'; payload: string; time_offset: number; continue_on_failure?: boolean }
```

### NetworkManager — `ctx.network`

| Method | Returns |
|---|---|
| `list()` | `Allocation[]` |
| `assign()` | `Allocation` |
| `setPrimary(allocationId: number)` | `Allocation` |
| `updateNotes(allocationId, notes)` | `Allocation` |
| `remove(allocationId)` | `void` |

### SubuserManager — `ctx.subusers`

| Method | Returns |
|---|---|
| `list()` | `Subuser[]` |
| `get(userId)` | `Subuser` |
| `create({email, permissions: string[]})` | `Subuser` |
| `update(userId, {permissions})` | `Subuser` |
| `remove(userId)` | `void` |

---

## PteroApplication

`new PteroApplication(options: ClientOptions)`

**Properties:** `users`, `servers`, `nodes`, `locations`, `nests`, `rateLimit`

### UserManager — `app.users`

| Method | Returns |
|---|---|
| `list(options?)` | `PaginatedResult<AdminUser>` |
| `get(userId: number, options?)` | `AdminUser` |
| `getByExternalId(externalId, options?)` | `AdminUser` |
| `create(params: CreateUserParams)` | `AdminUser` |
| `update(userId, params: UpdateUserParams)` | `AdminUser` |
| `delete(userId)` | `void` |

```ts
interface CreateUserParams { email: string; username: string; first_name: string; last_name: string; password?: string; language?: string; root_admin?: boolean; external_id?: string }
interface UpdateUserParams { email: string; username: string; first_name: string; last_name: string; password?: string; language?: string; root_admin?: boolean; external_id?: string }
```

### ServerManager — `app.servers`

| Method | Returns |
|---|---|
| `list(options?)` | `PaginatedResult<AdminServer>` |
| `get(serverId: number, options?)` | `AdminServer` |
| `getByExternalId(externalId, options?)` | `AdminServer` |
| `create(params: CreateServerParams)` | `AdminServer` |
| `updateDetails(serverId, params)` | `AdminServer` |
| `updateBuild(serverId, params)` | `AdminServer` |
| `updateStartup(serverId, params)` | `AdminServer` |
| `suspend(serverId)` | `void` |
| `unsuspend(serverId)` | `void` |
| `reinstall(serverId)` | `void` |
| `delete(serverId)` | `void` |
| `forceDelete(serverId)` | `void` |
| `listDatabases(serverId, options?)` | `PaginatedResult<AdminDatabase>` |
| `getDatabase(serverId, dbId, options?)` | `AdminDatabase` |
| `createDatabase(serverId, params)` | `AdminDatabase` |
| `resetDatabasePassword(serverId, dbId)` | `void` |
| `deleteDatabase(serverId, dbId)` | `void` |

```ts
interface CreateServerParams {
  name: string; user: number; egg: number; docker_image?: string; startup?: string;
  environment?: Record<string, string>;
  limits: { memory: number; swap: number; disk: number; io: number; cpu: number; threads?: string; oom_disabled?: boolean };
  feature_limits: { databases: number; allocations: number; backups: number };
  allocation: { default: number; additional?: number[] };
  deploy?: { locations: number[]; dedicated_ip: boolean; port_range: string[] };
  description?: string; external_id?: string;
}
interface UpdateServerDetailsParams { name?: string; user?: number; external_id?: string; description?: string }
interface UpdateServerBuildParams {
  allocation: number; memory: number; swap: number; disk: number; io: number; cpu: number; threads?: string;
  feature_limits: { databases: number; allocations: number; backups: number };
  add_allocations?: number[]; remove_allocations?: number[]; oom_disabled?: boolean;
}
interface UpdateServerStartupParams { startup: string; environment: Record<string, string>; egg: number; image?: string; skip_scripts?: boolean }
interface CreateAdminDatabaseParams { database: string; remote: string; host: number }
```

### NodeManager — `app.nodes`

| Method | Returns |
|---|---|
| `list(options?)` | `PaginatedResult<Node>` |
| `get(nodeId, options?)` | `Node` |
| `getDeployable(options?)` | `PaginatedResult<Node>` |
| `create(params: CreateNodeParams)` | `Node` |
| `update(nodeId, params: UpdateNodeParams)` | `Node` |
| `delete(nodeId)` | `void` |
| `getConfig(nodeId)` | `Record<string, unknown>` |
| `listAllocations(nodeId, options?)` | `PaginatedResult<NodeAllocation>` |
| `createAllocations(nodeId, {ip, ports, ip_alias?})` | `void` |
| `deleteAllocation(nodeId, allocationId)` | `void` |

```ts
interface CreateNodeParams { name: string; location_id: number; fqdn: string; memory: number; disk: number; description?: string; scheme?: string; behind_proxy?: boolean; public?: boolean; daemon_base?: string; daemon_sftp?: number; daemon_listen?: number; memory_overallocate?: number; disk_overallocate?: number; upload_size?: number; maintenance_mode?: boolean }
```

### LocationManager — `app.locations`

| Method | Returns |
|---|---|
| `list(options?)` | `PaginatedResult<Location>` |
| `get(locationId, options?)` | `Location` |
| `create({short, long?})` | `Location` |
| `update(locationId, {short?, long?})` | `Location` |
| `delete(locationId)` | `void` |

### NestManager — `app.nests`

| Method | Returns |
|---|---|
| `list(options?)` | `PaginatedResult<Nest>` |
| `get(nestId, options?)` | `Nest` |
| `listEggs(nestId, options?)` | `PaginatedResult<Egg>` |
| `getEgg(nestId, eggId, options?)` | `Egg` |

---

## WebSocketManager

```ts
const ws = new WebSocketManager({
  socket: string,                        // wss:// URL from getWebSocketCredentials()
  origin: string,                        // panel base URL
  getToken: () => Promise<string>,       // returns fresh JWT
  maxReconnectDelay?: number,            // default 30000
  autoReconnect?: boolean,               // default true
});
```

| Method | Description |
|---|---|
| `connect()` | `Promise<void>` — opens connection and authenticates |
| `disconnect()` | closes connection |
| `sendCommand(cmd)` | sends console command |
| `sendPowerAction(action)` | `'start'\|'stop'\|'restart'\|'kill'` |
| `on(event, handler)` | subscribe to event |
| `off(event, handler)` | unsubscribe |
| `connected` (getter) | `boolean` |

### Events

| Event | Payload | Description |
|---|---|---|
| `'auth success'` | — | authenticated |
| `'console output'` | `string` | console line |
| `'status'` | `ServerStatus` | `'running'\|'starting'\|'stopping'\|'offline'` |
| `'stats'` | `WebSocketStats` | resource usage snapshot |
| `'token expiring'` | — | token will expire soon |
| `'token expired'` | — | token expired |
| `'daemon message'` | `string` | daemon info |
| `'daemon error'` | `string` | daemon error |
| `'install output'` | `string` | install log line |
| `'install started'` | — | install began |
| `'install completed'` | — | install finished |
| `'transfer logs'` | `string` | transfer log line |
| `'transfer status'` | `string` | transfer status update |

```ts
interface WebSocketStats {
  memory_bytes: number; memory_limit_bytes: number; cpu_absolute: number;
  network: { rx_bytes: number; tx_bytes: number };
  uptime: number; state: string; disk_bytes: number;
}

enum WebSocketCloseCode { Normal=1000, GoingAway=1001, AbnormalClosure=1006, AuthenticationFailed=4001, TokenExpired=4004 }
```

---

## Key Data Types

```ts
// Client
interface Server { server_owner: boolean; identifier: string; internal_id: number; uuid: string; name: string; node: string; is_node_under_maintenance: boolean; sftp_details: {ip:string;port:number}; description: string; limits: ServerLimits; invocation: string; docker_image: string; egg_features: string[]; feature_limits: FeatureLimits; status: string|null; is_suspended: boolean; is_installing: boolean; is_transferring: boolean }
interface ServerLimits { memory: number; swap: number; disk: number; io: number; cpu: number; threads: string|null; oom_disabled?: boolean }
interface FeatureLimits { databases: number; allocations: number; backups: number }
interface ServerResources { current_state: string; is_suspended: boolean; resources: { memory_bytes: number; memory_limit_bytes: number; cpu_absolute: number; disk_bytes: number; network_rx_bytes: number; network_tx_bytes: number; uptime: number } }
interface WebSocketCredentials { token: string; socket: string }
interface StartupVariable { name: string; description: string; env_variable: string; default_value: string; server_value: string; is_editable: boolean; rules: string }

interface Account { id: number; admin: boolean; username: string; email: string; first_name: string; last_name: string; language: string }
interface ApiKey { identifier: string; description: string; allowed_ips: string[]; last_used_at: string|null; created_at: string }
interface ApiKeyWithSecret extends ApiKey { secret_token: string }
interface SSHKey { name: string; fingerprint: string; public_key: string; created_at: string }
interface ActivityLog { id: string; batch: string|null; event: string; is_api: boolean; ip: string; description: string; properties: Record<string,unknown>; has_additional_metadata: boolean; timestamp: string }

interface FileObject { name: string; mode: string; mode_bits: string; size: number; is_file: boolean; is_symlink: boolean; mimetype: string; created_at: string; modified_at: string }
interface Database { id: string; host: {address:string;port:number}; name: string; username: string; connections_from: string; max_connections: number }
interface Backup { uuid: string; name: string; ignored_files: string[]; sha256_hash: string|null; bytes: number; created_at: string; completed_at: string|null; is_successful: boolean|null; is_locked: boolean }
interface Schedule { id: number; name: string; cron: {minute:string;hour:string;day_of_month:string;month:string;day_of_week:string}; is_active: boolean; is_processing: boolean; only_when_online: boolean; last_run_at: string|null; next_run_at: string; created_at: string; updated_at: string }
interface ScheduleTask { id: number; sequence_id: number; action: 'command'|'power'|'backup'; payload: string; time_offset: number; continue_on_failure: boolean }
interface Allocation { id: number; ip: string; ip_alias: string|null; port: number; notes: string|null; is_default: boolean }
interface Subuser { uuid: string; username: string; email: string; image: string; '2fa_enabled': boolean; created_at: string; permissions: string[] }

// Application
interface AdminUser { id: number; external_id: string|null; uuid: string; username: string; email: string; first_name: string; last_name: string; language: string; root_admin: boolean; '2fa': boolean; created_at: string; updated_at: string }
interface AdminServer { id: number; external_id: string|null; uuid: string; identifier: string; name: string; description: string; status: string|null; suspended: boolean; limits: AdminServerLimits; feature_limits: AdminFeatureLimits; user: number; node: number; allocation: number; nest: number; egg: number; container: {startup_command:string;image:string;installed:boolean;environment:Record<string,string>}; created_at: string; updated_at: string }
interface Node { id: number; uuid: string; public: boolean; name: string; description: string; location_id: number; fqdn: string; scheme: string; behind_proxy: boolean; maintenance_mode: boolean; memory: number; memory_overallocate: number; disk: number; disk_overallocate: number; upload_size: number; daemon_listen: number; daemon_sftp: number; daemon_base: string; created_at: string; updated_at: string; allocated_resources: {memory:number;disk:number} }
interface NodeAllocation { id: number; ip: string; ip_alias: string|null; port: number; notes: string|null; assigned: boolean }
interface Location { id: number; short: string; long: string; created_at: string; updated_at: string }
interface Nest { id: number; uuid: string; author: string; name: string; description: string; created_at: string; updated_at: string }
interface Egg { id: number; uuid: string; name: string; nest: number; author: string; description: string; docker_image: string; docker_images: Record<string,string>; startup: string; created_at: string; updated_at: string }
interface AdminDatabase { id: number; server: number; host: number; database: string; username: string; remote: string; max_connections: number; created_at: string; updated_at: string }
```
