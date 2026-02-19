export interface Server {
  server_owner: boolean;
  identifier: string;
  internal_id: number;
  uuid: string;
  name: string;
  node: string;
  is_node_under_maintenance: boolean;
  sftp_details: SftpDetails;
  description: string;
  limits: ServerLimits;
  invocation: string;
  docker_image: string;
  egg_features: string[];
  feature_limits: FeatureLimits;
  status: string | null;
  is_suspended: boolean;
  is_installing: boolean;
  is_transferring: boolean;
  relationships?: ServerRelationships;
}

export interface SftpDetails {
  ip: string;
  port: number;
}

export interface ServerLimits {
  memory: number;
  swap: number;
  disk: number;
  io: number;
  cpu: number;
  threads: string | null;
  oom_killer?: boolean;
}

export interface FeatureLimits {
  databases: number;
  allocations: number;
  backups: number;
}

export interface ServerRelationships {
  allocations?: {
    object: 'list';
    data: Array<{ object: string; attributes: import('./network.js').Allocation }>;
  };
  variables?: {
    object: 'list';
    data: Array<{ object: string; attributes: StartupVariable }>;
  };
}

export interface ServerResources {
  current_state: string;
  is_suspended: boolean;
  resources: ResourceUsage;
}

export interface ResourceUsage {
  memory_bytes: number;
  memory_limit_bytes: number;
  cpu_absolute: number;
  disk_bytes: number;
  network_rx_bytes: number;
  network_tx_bytes: number;
  uptime: number;
}

export interface StartupVariable {
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  server_value: string;
  is_editable: boolean;
  rules: string;
}

export type PowerAction = 'start' | 'stop' | 'restart' | 'kill';

export interface WebSocketCredentials {
  token: string;
  socket: string;
}
