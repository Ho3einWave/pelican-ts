export interface Backup {
  uuid: string;
  name: string;
  ignored_files: string[];
  sha256_hash: string | null;
  bytes: number;
  created_at: string;
  completed_at: string | null;
  is_successful: boolean | null;
  is_locked: boolean;
}

export interface CreateBackupParams {
  name?: string;
  ignored?: string;
  is_locked?: boolean;
}
