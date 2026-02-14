export interface Node {
  id: number;
  uuid: string;
  public: boolean;
  name: string;
  description: string;
  location_id: number;
  fqdn: string;
  scheme: string;
  behind_proxy: boolean;
  maintenance_mode: boolean;
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  upload_size: number;
  daemon_listen: number;
  daemon_sftp: number;
  daemon_base: string;
  created_at: string;
  updated_at: string;
  allocated_resources: {
    memory: number;
    disk: number;
  };
}

export interface CreateNodeParams {
  name: string;
  location_id: number;
  fqdn: string;
  memory: number;
  disk: number;
  description?: string;
  scheme?: string;
  behind_proxy?: boolean;
  public?: boolean;
  daemon_base?: string;
  daemon_sftp?: number;
  daemon_listen?: number;
  memory_overallocate?: number;
  disk_overallocate?: number;
  upload_size?: number;
  maintenance_mode?: boolean;
}

export interface UpdateNodeParams {
  name?: string;
  description?: string;
  location_id?: number;
  fqdn?: string;
  scheme?: string;
  behind_proxy?: boolean;
  public?: boolean;
  daemon_base?: string;
  daemon_sftp?: number;
  daemon_listen?: number;
  memory?: number;
  memory_overallocate?: number;
  disk?: number;
  disk_overallocate?: number;
  upload_size?: number;
  maintenance_mode?: boolean;
}
