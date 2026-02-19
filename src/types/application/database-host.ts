export interface AdminDatabaseHost {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  node_ids: number[] | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDatabaseHostParams {
  name: string;
  host: string;
  port: number;
  username: string;
  password?: string;
  node_ids?: number[];
}

export interface UpdateDatabaseHostParams {
  name?: string;
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  node_ids?: number[];
}
