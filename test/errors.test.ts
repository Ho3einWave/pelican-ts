import { describe, expect, it } from 'vitest';
import {
  PteroError,
  PteroRateLimitError,
  PteroValidationError,
} from '../src/core/errors.js';

describe('PteroError', () => {
  it('should set status, code, and message from first error', () => {
    const err = new PteroError(404, [
      { code: 'NotFound', status: '404', detail: 'Resource not found' },
    ]);
    expect(err.status).toBe(404);
    expect(err.code).toBe('NotFound');
    expect(err.message).toBe('Resource not found');
    expect(err.name).toBe('PteroError');
    expect(err.errors).toHaveLength(1);
  });

  it('should handle empty errors array', () => {
    const err = new PteroError(500, []);
    expect(err.status).toBe(500);
    expect(err.code).toBe('UnknownError');
    expect(err.message).toBe('API error 500');
  });

  it('should be an instance of Error', () => {
    const err = new PteroError(400, [
      { code: 'Bad', status: '400', detail: 'bad request' },
    ]);
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(PteroError);
  });
});

describe('PteroValidationError', () => {
  it('should extract field errors from source', () => {
    const err = new PteroValidationError([
      {
        code: 'required',
        status: '422',
        detail: 'The name field is required.',
        source: { field: 'name' },
      },
      {
        code: 'email',
        status: '422',
        detail: 'Must be a valid email.',
        source: { field: 'email' },
      },
      {
        code: 'required',
        status: '422',
        detail: 'The email field is required.',
        source: { field: 'email' },
      },
    ]);
    expect(err.status).toBe(422);
    expect(err.name).toBe('PteroValidationError');
    expect(err.fieldErrors).toEqual({
      name: ['The name field is required.'],
      email: ['Must be a valid email.', 'The email field is required.'],
    });
  });

  it('should handle errors without source field', () => {
    const err = new PteroValidationError([
      { code: 'ValidationException', status: '422', detail: 'Validation failed' },
    ]);
    expect(err.fieldErrors).toEqual({});
  });

  it('should be an instance of PteroError', () => {
    const err = new PteroValidationError([]);
    expect(err).toBeInstanceOf(PteroError);
  });
});

describe('PteroRateLimitError', () => {
  it('should store retryAfter value', () => {
    const err = new PteroRateLimitError(
      [{ code: 'TooManyRequests', status: '429', detail: 'Rate limited' }],
      30,
    );
    expect(err.status).toBe(429);
    expect(err.retryAfter).toBe(30);
    expect(err.name).toBe('PteroRateLimitError');
  });

  it('should be an instance of PteroError', () => {
    const err = new PteroRateLimitError([], 60);
    expect(err).toBeInstanceOf(PteroError);
  });
});
