// Client API
export { PelicanClient } from './client/index.js';
export { AccountManager } from './client/account-manager.js';
export { ServersManager } from './client/servers-manager.js';
export { ServerContext } from './client/server/server-context.js';
export { FileManager } from './client/server/file-manager.js';
export { DatabaseManager } from './client/server/database-manager.js';
export { BackupManager } from './client/server/backup-manager.js';
export { ScheduleManager } from './client/server/schedule-manager.js';
export { NetworkManager } from './client/server/network-manager.js';
export { SubuserManager } from './client/server/subuser-manager.js';

// Application API
export { PelicanApplication } from './application/index.js';
export { UserManager } from './application/user-manager.js';
export { ServerManager } from './application/server-manager.js';
export { NodeManager } from './application/node-manager.js';
export { EggManager } from './application/egg-manager.js';
export { DatabaseHostManager } from './application/database-host-manager.js';
export { MountManager } from './application/mount-manager.js';
export { RoleManager } from './application/role-manager.js';

// Core
export { HttpClient } from './core/http-client.js';
export { PelicanError, PelicanValidationError, PelicanRateLimitError } from './core/errors.js';
export type {
  ClientOptions,
  RequestOptions,
  PaginatedResult,
  PaginationMeta,
  RateLimitInfo,
  RawApiError,
  RawObject,
  RawList,
  RawPagination,
} from './core/types.js';

// Client types
export type {
  Account,
  ApiKey,
  ApiKeyWithSecret,
  SSHKey,
  ActivityLog,
} from './types/client/account.js';
export type {
  Server,
  SftpDetails,
  ServerLimits,
  FeatureLimits,
  ServerResources,
  ResourceUsage,
  StartupVariable,
  PowerAction,
  WebSocketCredentials,
} from './types/client/server.js';
export type { FileObject, SignedUrl, CompressionExtension } from './types/client/file.js';
export type {
  Database,
  DatabaseHost,
  DatabaseRelationships,
  CreateDatabaseParams,
} from './types/client/database.js';
export type { Backup, CreateBackupParams, RestoreBackupParams } from './types/client/backup.js';
export type {
  Schedule,
  CronExpression,
  ScheduleTask,
  ScheduleTaskAction,
  CreateScheduleParams,
  UpdateScheduleParams,
  CreateScheduleTaskParams,
  UpdateScheduleTaskParams,
} from './types/client/schedule.js';
export type { Allocation } from './types/client/network.js';
export type { Subuser, CreateSubuserParams, UpdateSubuserParams } from './types/client/subuser.js';

// Application types
export type { AdminUser, CreateUserParams, UpdateUserParams } from './types/application/user.js';
export type {
  AdminServer,
  AdminServerLimits,
  AdminFeatureLimits,
  AdminServerContainer,
  CreateServerParams,
  UpdateServerDetailsParams,
  UpdateServerBuildParams,
  UpdateServerStartupParams,
  TransferServerParams,
} from './types/application/server.js';
export type { AdminDatabase, CreateAdminDatabaseParams } from './types/application/database.js';
export type { Node, CreateNodeParams, UpdateNodeParams } from './types/application/node.js';
export type { NodeAllocation, CreateAllocationParams } from './types/application/allocation.js';
export type { Egg, EggConfig, EggScript, EggVariable } from './types/application/egg.js';
export type {
  AdminDatabaseHost,
  CreateDatabaseHostParams,
  UpdateDatabaseHostParams,
} from './types/application/database-host.js';
export type {
  Mount,
  CreateMountParams,
  UpdateMountParams,
} from './types/application/mount.js';
export type {
  Role,
  CreateRoleParams,
  UpdateRoleParams,
} from './types/application/role.js';

// WebSocket
export { WebSocketManager } from './websocket/websocket-manager.js';
export type {
  WebSocketEventMap,
  WebSocketEvent,
  WebSocketManagerOptions,
} from './websocket/websocket-manager.js';

// WebSocket types
export type {
  WebSocketMessage,
  ClientEvent,
  ServerEvent,
  ServerStatus,
  WebSocketStats,
} from './types/websocket.js';
export { WebSocketCloseCode } from './types/websocket.js';
