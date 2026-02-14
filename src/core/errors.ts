import type { RawApiError } from './types.js';

/** Base error for all Pterodactyl API errors. */
export class PteroError extends Error {
  /** HTTP status code. */
  readonly status: number;
  /** Machine-readable error code from the API. */
  readonly code: string;
  /** Raw error objects from the API response. */
  readonly errors: RawApiError[];

  constructor(status: number, errors: RawApiError[]) {
    const first = errors[0];
    super(first?.detail ?? `API error ${status}`);
    this.name = 'PteroError';
    this.status = status;
    this.code = first?.code ?? 'UnknownError';
    this.errors = errors;
  }
}

/** Thrown on 422 validation errors. Includes per-field error details. */
export class PteroValidationError extends PteroError {
  /** Map of field name to error messages. */
  readonly fieldErrors: Record<string, string[]>;

  constructor(errors: RawApiError[]) {
    super(422, errors);
    this.name = 'PteroValidationError';
    this.fieldErrors = {};
    for (const err of errors) {
      if (err.source?.field) {
        const field = err.source.field;
        if (!this.fieldErrors[field]) {
          this.fieldErrors[field] = [];
        }
        this.fieldErrors[field].push(err.detail);
      }
    }
  }
}

/** Thrown on 429 rate limit errors. Includes retry timing info. */
export class PteroRateLimitError extends PteroError {
  /** Seconds to wait before retrying (from Retry-After header). */
  readonly retryAfter: number;

  constructor(errors: RawApiError[], retryAfter: number) {
    super(429, errors);
    this.name = 'PteroRateLimitError';
    this.retryAfter = retryAfter;
  }
}
