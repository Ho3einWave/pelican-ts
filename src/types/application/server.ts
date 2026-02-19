export interface AdminServer {
  id: number;
  external_id: string | null;
  uuid: string;
  identifier: string;
  name: string;
  description: string;
  status: string | null;
  suspended: boolean;
  limits: AdminServerLimits;
  feature_limits: AdminFeatureLimits;
  user: number;
  node: number;
  allocation: number;
  egg: number;
  container: AdminServerContainer;
  created_at: string;
  updated_at: string;
}

export interface AdminServerLimits {
  memory: number;
  swap: number;
  disk: number;
  io: number;
  cpu: number;
  threads: string | null;
  oom_killer: boolean;
}

export interface AdminFeatureLimits {
  databases: number;
  allocations: number;
  backups: number;
}

export interface AdminServerContainer {
  startup_command: string;
  image: string;
  installed: boolean;
  environment: Record<string, string>;
}

export interface CreateServerParams {
  name: string;
  user: number;
  egg: number;
  docker_image?: string;
  startup?: string;
  environment: Record<string, string>;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads?: string;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  allocation: {
    default: string;
    additional?: string[];
  };
  deploy?: {
    dedicated_ip: boolean;
    port_range: string[];
    tags?: string[];
  };
  description?: string;
  external_id?: string;
  skip_scripts?: boolean;
  oom_killer?: boolean;
  start_on_completion?: boolean;
}

export interface UpdateServerDetailsParams {
  name: string;
  user: number;
  external_id?: string;
  description?: string;
}

export interface UpdateServerBuildParams {
  allocation?: number | null;
  limits?: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads?: string;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  add_allocations?: number[];
  remove_allocations?: number[];
  oom_killer?: boolean;
}

export interface UpdateServerStartupParams {
  startup: string;
  environment: Record<string, string>;
  egg: number;
  image?: string;
  skip_scripts: boolean;
}

export interface TransferServerParams {
  node_id: number;
  allocation_id: number;
  allocation_additional?: number[];
}
