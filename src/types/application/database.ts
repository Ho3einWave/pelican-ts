export interface AdminDatabase {
  id: number;
  server: number;
  host: number;
  database: string;
  username: string;
  remote: string;
  max_connections: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAdminDatabaseParams {
  database: string;
  remote: string;
  host: number;
}
