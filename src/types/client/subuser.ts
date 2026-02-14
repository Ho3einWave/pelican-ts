export interface Subuser {
  uuid: string;
  username: string;
  email: string;
  image: string;
  '2fa_enabled': boolean;
  created_at: string;
  permissions: string[];
}

export interface CreateSubuserParams {
  email: string;
  permissions: string[];
}

export interface UpdateSubuserParams {
  permissions: string[];
}
