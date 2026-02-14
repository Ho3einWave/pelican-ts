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
  nest: number;
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
  oom_disabled: boolean;
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
  environment?: Record<string, string>;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads?: string;
    oom_disabled?: boolean;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  allocation: {
    default: number;
    additional?: number[];
  };
  deploy?: {
    locations: number[];
    dedicated_ip: boolean;
    port_range: string[];
  };
  description?: string;
  external_id?: string;
}

export interface UpdateServerDetailsParams {
  name?: string;
  user?: number;
  external_id?: string;
  description?: string;
}

export interface UpdateServerBuildParams {
  allocation: number;
  memory: number;
  swap: number;
  disk: number;
  io: number;
  cpu: number;
  threads?: string;
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  add_allocations?: number[];
  remove_allocations?: number[];
  oom_disabled?: boolean;
}

export interface UpdateServerStartupParams {
  startup: string;
  environment: Record<string, string>;
  egg: number;
  image?: string;
  skip_scripts?: boolean;
}
