export interface Mount {
  id: number;
  uuid: string;
  name: string;
  description: string | null;
  source: string;
  target: string;
  read_only: boolean;
  user_mountable: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateMountParams {
  name: string;
  description?: string | null;
  source: string;
  target: string;
  read_only?: boolean;
  user_mountable?: boolean;
}

export interface UpdateMountParams {
  name?: string;
  description?: string | null;
  source?: string;
  target?: string;
  read_only?: boolean;
  user_mountable?: boolean;
}
