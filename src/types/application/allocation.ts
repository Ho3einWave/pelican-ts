export interface NodeAllocation {
  id: number;
  ip: string;
  ip_alias: string | null;
  port: number;
  notes: string | null;
  assigned: boolean;
}

export interface CreateAllocationParams {
  ip: string;
  ports: string[];
  ip_alias?: string;
}
