export interface Location {
  id: number;
  short: string;
  long: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationParams {
  short: string;
  long?: string;
}

export interface UpdateLocationParams {
  short?: string;
  long?: string;
}
