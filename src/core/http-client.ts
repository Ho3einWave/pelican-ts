import { PteroError, PteroRateLimitError, PteroValidationError } from './errors.js';
import type {
  ClientOptions,
  PaginatedResult,
  PaginationMeta,
  RateLimitInfo,
  RawApiError,
  RawList,
  RawObject,
  RequestOptions,
} from './types.js';

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private _rateLimit: RateLimitInfo | null = null;

  constructor(options: ClientOptions) {
    // Strip trailing slash
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.apiKey = options.apiKey;
  }

  /** Current rate limit info from the last response, or null if no request has been made. */
  get rateLimit(): RateLimitInfo | null {
    return this._rateLimit;
  }

  /** Make a GET request and unwrap a single object envelope. */
  async get<T>(path: string, options?: RequestOptions): Promise<T> {
    const response = await this.request('GET', path, undefined, options);
    const json = (await response.json()) as RawObject<T>;
    return json.attributes;
  }

  /** Make a GET request and unwrap a list envelope with pagination. */
  async getList<T>(path: string, options?: RequestOptions): Promise<PaginatedResult<T>> {
    const response = await this.request('GET', path, undefined, options);
    const json = (await response.json()) as RawList<T>;
    return this.unwrapList(json);
  }

  /** Make a POST request and unwrap a single object envelope. */
  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.request('POST', path, body, options);
    if (response.status === 204) {
      return undefined as T;
    }
    const json = (await response.json()) as RawObject<T>;
    return json.attributes;
  }

  /** Make a PUT request and unwrap a single object envelope. */
  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.request('PUT', path, body, options);
    if (response.status === 204) {
      return undefined as T;
    }
    const json = (await response.json()) as RawObject<T>;
    return json.attributes;
  }

  /** Make a PATCH request and unwrap a single object envelope. */
  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    const response = await this.request('PATCH', path, body, options);
    if (response.status === 204) {
      return undefined as T;
    }
    const json = (await response.json()) as RawObject<T>;
    return json.attributes;
  }

  /** Make a DELETE request. Returns void (expects 204). */
  async delete(path: string, body?: unknown, options?: RequestOptions): Promise<void> {
    await this.request('DELETE', path, body, options);
  }

  /** Make a raw request and return the Response (for non-JSON endpoints like file downloads). */
  async raw(method: string, path: string, body?: unknown, options?: RequestOptions): Promise<Response> {
    return this.request(method, path, body, options);
  }

  /** Make a request with a raw text body (Content-Type: text/plain). */
  async postText(path: string, text: string, options?: RequestOptions): Promise<void> {
    const url = this.buildUrl(path, options);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: 'Application/vnd.pterodactyl.v1+json',
        'Content-Type': 'text/plain',
      },
      body: text,
    });
    this.trackRateLimit(response);
    if (!response.ok) {
      await this.handleError(response);
    }
  }

  private async request(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<Response> {
    const url = this.buildUrl(path, options);
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: 'Application/vnd.pterodactyl.v1+json',
    };

    const init: RequestInit = { method, headers };

    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      init.body = JSON.stringify(body);
    }

    const response = await fetch(url, init);
    this.trackRateLimit(response);

    if (!response.ok) {
      await this.handleError(response);
    }

    return response;
  }

  private buildUrl(path: string, options?: RequestOptions): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (!options) return url.toString();

    if (options.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        url.searchParams.set(`filter[${key}]`, value);
      }
    }

    if (options.sort) {
      url.searchParams.set('sort', options.sort);
    }

    if (options.include?.length) {
      url.searchParams.set('include', options.include.join(','));
    }

    if (options.page !== undefined) {
      url.searchParams.set('page', String(options.page));
    }

    if (options.perPage !== undefined) {
      url.searchParams.set('per_page', String(options.perPage));
    }

    return url.toString();
  }

  private trackRateLimit(response: Response): void {
    const limit = response.headers.get('X-RateLimit-Limit');
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const reset = response.headers.get('X-RateLimit-Reset');

    if (limit && remaining && reset) {
      this._rateLimit = {
        limit: Number(limit),
        remaining: Number(remaining),
        reset: Number(reset),
      };
    }
  }

  private async handleError(response: Response): Promise<never> {
    let errors: RawApiError[];
    try {
      const json = (await response.json()) as { errors: RawApiError[] };
      errors = json.errors;
    } catch {
      errors = [
        {
          code: 'UnknownError',
          status: String(response.status),
          detail: response.statusText || `HTTP ${response.status}`,
        },
      ];
    }

    if (response.status === 422) {
      throw new PteroValidationError(errors);
    }

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After') ?? '60');
      throw new PteroRateLimitError(errors, retryAfter);
    }

    throw new PteroError(response.status, errors);
  }

  private unwrapList<T>(raw: RawList<T>): PaginatedResult<T> {
    const data = raw.data.map((item) => item.attributes);
    const pagination: PaginationMeta = raw.meta?.pagination
      ? {
          total: raw.meta.pagination.total,
          count: raw.meta.pagination.count,
          perPage: raw.meta.pagination.per_page,
          currentPage: raw.meta.pagination.current_page,
          totalPages: raw.meta.pagination.total_pages,
        }
      : {
          total: data.length,
          count: data.length,
          perPage: data.length,
          currentPage: 1,
          totalPages: 1,
        };

    return { data, pagination };
  }
}
