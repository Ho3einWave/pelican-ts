export interface Account {
  id: number;
  admin: boolean;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
}

export interface TwoFactorSetup {
  image_url_data: string;
  secret: string;
}

export interface RecoveryTokens {
  tokens: string[];
}

export interface ApiKey {
  identifier: string;
  description: string;
  allowed_ips: string[];
  last_used_at: string | null;
  created_at: string;
}

export interface ApiKeyWithSecret extends ApiKey {
  /** Only available at creation time via meta.secret_token. */
  secret_token: string;
}

export interface SSHKey {
  name: string;
  fingerprint: string;
  public_key: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  batch: string | null;
  event: string;
  is_api: boolean;
  ip: string;
  description: string;
  properties: Record<string, unknown>;
  has_additional_metadata: boolean;
  timestamp: string;
}
