export interface AdminUser {
  id: number;
  external_id: string | null;
  uuid: string;
  username: string;
  email: string;
  language: string;
  timezone: string;
  '2fa': boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserParams {
  email: string;
  username: string;
  password?: string;
  language?: string;
  external_id?: string;
  is_managed_externally?: boolean;
  timezone?: string;
}

export interface UpdateUserParams {
  email?: string;
  username?: string;
  password?: string;
  language?: string;
  external_id?: string;
  is_managed_externally?: boolean;
  timezone?: string;
}
