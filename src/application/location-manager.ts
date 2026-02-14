import type { HttpClient } from '../core/http-client.js';
import type { PaginatedResult, RequestOptions } from '../core/types.js';
import type {
  CreateLocationParams,
  Location,
  UpdateLocationParams,
} from '../types/application/location.js';

const BASE = '/api/application/locations';

export class LocationManager {
  constructor(private readonly http: HttpClient) {}

  async list(options?: RequestOptions): Promise<PaginatedResult<Location>> {
    return this.http.getList<Location>(BASE, options);
  }

  async get(locationId: number, options?: RequestOptions): Promise<Location> {
    return this.http.get<Location>(`${BASE}/${locationId}`, options);
  }

  async create(params: CreateLocationParams): Promise<Location> {
    return this.http.post<Location>(BASE, params);
  }

  async update(locationId: number, params: UpdateLocationParams): Promise<Location> {
    return this.http.patch<Location>(`${BASE}/${locationId}`, params);
  }

  async delete(locationId: number): Promise<void> {
    await this.http.delete(`${BASE}/${locationId}`);
  }
}
