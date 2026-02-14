export interface AdminUser {
  id: number;
  external_id: string | null;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  root_admin: boolean;
  '2fa': boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserParams {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
  language?: string;
  root_admin?: boolean;
  external_id?: string;
}

export interface UpdateUserParams {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password?: string;
  language?: string;
  root_admin?: boolean;
  external_id?: string;
}
