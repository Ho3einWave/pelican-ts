export interface Egg {
  id: number;
  uuid: string;
  name: string;
  nest: number;
  author: string;
  description: string;
  docker_image: string;
  docker_images: Record<string, string>;
  config: EggConfig;
  startup: string;
  script: EggScript;
  created_at: string;
  updated_at: string;
}

export interface EggConfig {
  files: Record<string, unknown>;
  startup: Record<string, unknown>;
  stop: string;
  logs: unknown[];
  file_denylist: string[];
  extends: string | null;
}

export interface EggScript {
  privileged: boolean;
  install: string;
  entry: string;
  container: string;
  extends: string | null;
}

export interface EggVariable {
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  user_viewable: boolean;
  user_editable: boolean;
  rules: string;
  created_at: string;
  updated_at: string;
}
