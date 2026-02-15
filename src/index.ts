// Client API
export { PteroClient } from './client/index.js';
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
export { PteroApplication } from './application/index.js';
export { UserManager } from './application/user-manager.js';
export { ServerManager } from './application/server-manager.js';
export { NodeManager } from './application/node-manager.js';
export { LocationManager } from './application/location-manager.js';
export { NestManager } from './application/nest-manager.js';

// Core
export { HttpClient } from './core/http-client.js';
export { PteroError, PteroValidationError, PteroRateLimitError } from './core/errors.js';
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
  TwoFactorSetup,
  RecoveryTokens,
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
export type { FileObject, SignedUrl } from './types/client/file.js';
export type {
  Database,
  DatabaseHost,
  DatabaseRelationships,
  CreateDatabaseParams,
} from './types/client/database.js';
export type { Backup, CreateBackupParams } from './types/client/backup.js';
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
} from './types/application/server.js';
export type { AdminDatabase, CreateAdminDatabaseParams } from './types/application/database.js';
export type { Node, CreateNodeParams, UpdateNodeParams } from './types/application/node.js';
export type { NodeAllocation, CreateAllocationParams } from './types/application/allocation.js';
export type {
  Location,
  CreateLocationParams,
  UpdateLocationParams,
} from './types/application/location.js';
export type { Nest } from './types/application/nest.js';
export type { Egg, EggConfig, EggScript, EggVariable } from './types/application/egg.js';

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
