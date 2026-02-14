/** Options for creating a PteroClient or PteroApplication instance. */
export interface ClientOptions {
  /** Base URL of the Pterodactyl panel (e.g. "https://panel.example.com"). */
  baseUrl: string;
  /** API key (ptlc_ for client, ptla_ for application). */
  apiKey: string;
}

/** Options passed to individual HTTP requests. */
export interface RequestOptions {
  /** Query filters in the format filter[key]=value. */
  filters?: Record<string, string>;
  /** Sort field. Prefix with - for descending (e.g. "-id"). */
  sort?: string;
  /** Relations to include (e.g. ["eggs", "variables"]). */
  include?: string[];
  /** Page number for paginated results. */
  page?: number;
  /** Number of items per page. */
  perPage?: number;
}

/** Raw API envelope for a single object. */
export interface RawObject<T = Record<string, unknown>> {
  object: string;
  attributes: T;
}

/** Raw API envelope for a list of objects. */
export interface RawList<T = Record<string, unknown>> {
  object: 'list';
  data: RawObject<T>[];
  meta?: {
    pagination: RawPagination;
  };
}

/** Raw pagination metadata from the API. */
export interface RawPagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: {
    next?: string;
    previous?: string;
  };
}

/** Pagination metadata returned to consumers. */
export interface PaginationMeta {
  total: number;
  count: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
}

/** Paginated result returned by list methods. */
export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

/** Raw error object from the API. */
export interface RawApiError {
  code: string;
  status: string;
  detail: string;
  source?: {
    field: string;
  };
}

/** Rate limit info tracked from response headers. */
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}
