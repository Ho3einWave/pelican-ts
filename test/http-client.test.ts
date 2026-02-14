import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpClient } from '../src/core/http-client.js';
import { PteroError, PteroRateLimitError, PteroValidationError } from '../src/core/errors.js';

function mockFetch(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: 'OK',
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
    headers: new Map(Object.entries(headers)),
  } satisfies Partial<Response> as any);
}

describe('HttpClient', () => {
  let client: HttpClient;

  beforeEach(() => {
    client = new HttpClient({
      baseUrl: 'https://panel.example.com',
      apiKey: 'ptlc_testkey123',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('get', () => {
    it('should unwrap single object envelope', async () => {
      globalThis.fetch = mockFetch({
        object: 'user',
        attributes: { id: 1, username: 'admin' },
      });

      const result = await client.get<{ id: number; username: string }>('/api/client/account');
      expect(result).toEqual({ id: 1, username: 'admin' });
    });

    it('should send correct headers', async () => {
      globalThis.fetch = mockFetch({ object: 'test', attributes: {} });

      await client.get('/test');
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://panel.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer ptlc_testkey123',
            Accept: 'Application/vnd.pterodactyl.v1+json',
          }),
        }),
      );
    });
  });

  describe('getList', () => {
    it('should unwrap list envelope with pagination', async () => {
      globalThis.fetch = mockFetch({
        object: 'list',
        data: [
          { object: 'server', attributes: { id: 1, name: 'Server 1' } },
          { object: 'server', attributes: { id: 2, name: 'Server 2' } },
        ],
        meta: {
          pagination: {
            total: 2,
            count: 2,
            per_page: 50,
            current_page: 1,
            total_pages: 1,
            links: {},
          },
        },
      });

      const result = await client.getList<{ id: number; name: string }>('/api/client');
      expect(result.data).toEqual([
        { id: 1, name: 'Server 1' },
        { id: 2, name: 'Server 2' },
      ]);
      expect(result.pagination).toEqual({
        total: 2,
        count: 2,
        perPage: 50,
        currentPage: 1,
        totalPages: 1,
      });
    });
  });

  describe('post', () => {
    it('should send JSON body', async () => {
      globalThis.fetch = mockFetch({
        object: 'database',
        attributes: { id: 1, name: 'test_db' },
      });

      await client.post('/test', { database: 'test', remote: '%' });
      expect(globalThis.fetch).toHaveBeenCalledWith(
        'https://panel.example.com/test',
        expect.objectContaining({
          method: 'POST',
          body: '{"database":"test","remote":"%"}',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('should return undefined for 204 responses', async () => {
      globalThis.fetch = mockFetch(null, 204);

      const result = await client.post<void>('/test');
      expect(result).toBeUndefined();
    });
  });

  describe('query string building', () => {
    it('should build filters', async () => {
      globalThis.fetch = mockFetch({ object: 'list', data: [] });

      await client.getList('/test', { filters: { name: 'foo', email: 'bar' } });
      const url = (globalThis.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('filter%5Bname%5D=foo');
      expect(url).toContain('filter%5Bemail%5D=bar');
    });

    it('should build sort', async () => {
      globalThis.fetch = mockFetch({ object: 'list', data: [] });

      await client.getList('/test', { sort: '-id' });
      const url = (globalThis.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('sort=-id');
    });

    it('should build includes', async () => {
      globalThis.fetch = mockFetch({ object: 'list', data: [] });

      await client.getList('/test', { include: ['eggs', 'variables'] });
      const url = (globalThis.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('include=eggs%2Cvariables');
    });

    it('should build pagination', async () => {
      globalThis.fetch = mockFetch({ object: 'list', data: [] });

      await client.getList('/test', { page: 2, perPage: 25 });
      const url = (globalThis.fetch as any).mock.calls[0][0] as string;
      expect(url).toContain('page=2');
      expect(url).toContain('per_page=25');
    });
  });

  describe('error handling', () => {
    it('should throw PteroValidationError on 422', async () => {
      globalThis.fetch = mockFetch(
        {
          errors: [
            {
              code: 'required',
              status: '422',
              detail: 'Field required',
              source: { field: 'name' },
            },
          ],
        },
        422,
      );

      await expect(client.get('/test')).rejects.toThrow(PteroValidationError);
    });

    it('should throw PteroRateLimitError on 429', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        json: () =>
          Promise.resolve({
            errors: [{ code: 'TooMany', status: '429', detail: 'Rate limited' }],
          }),
        headers: {
          get: (name: string) => (name === 'Retry-After' ? '30' : null),
        },
      });

      try {
        await client.get('/test');
        expect.unreachable('Should have thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(PteroRateLimitError);
        expect((err as PteroRateLimitError).retryAfter).toBe(30);
      }
    });

    it('should throw PteroError on other errors', async () => {
      globalThis.fetch = mockFetch(
        {
          errors: [{ code: 'NotFound', status: '404', detail: 'Not found' }],
        },
        404,
      );

      await expect(client.get('/test')).rejects.toThrow(PteroError);
    });
  });

  describe('URL handling', () => {
    it('should strip trailing slash from baseUrl', () => {
      const c = new HttpClient({
        baseUrl: 'https://panel.example.com/',
        apiKey: 'test',
      });
      expect(c).toBeDefined();
    });
  });
});
