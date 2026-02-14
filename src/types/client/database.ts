export interface Database {
  id: string;
  host: DatabaseHost;
  name: string;
  username: string;
  connections_from: string;
  max_connections: number;
  relationships?: DatabaseRelationships;
}

export interface DatabaseHost {
  address: string;
  port: number;
}

export interface DatabaseRelationships {
  password?: {
    object: string;
    attributes: {
      password: string;
    };
  };
}

export interface CreateDatabaseParams {
  database: string;
  remote: string;
}
