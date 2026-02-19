export interface Role {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateRoleParams {
  name: string;
}

export interface UpdateRoleParams {
  name: string;
}
