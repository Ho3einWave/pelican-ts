import { describe, expect, it } from 'vitest';
import { PelicanClient } from '../src/client/index.js';

describe('PelicanClient', () => {
  it('should create with valid options', () => {
    const client = new PelicanClient({
      baseUrl: 'https://panel.example.com',
      apiKey: 'ptlc_testkey',
    });
    expect(client).toBeDefined();
    expect(client.account).toBeDefined();
    expect(client.servers).toBeDefined();
  });

  it('should create a server context', () => {
    const client = new PelicanClient({
      baseUrl: 'https://panel.example.com',
      apiKey: 'ptlc_testkey',
    });
    const server = client.server('abc123');
    expect(server).toBeDefined();
    expect(server.files).toBeDefined();
    expect(server.databases).toBeDefined();
    expect(server.backups).toBeDefined();
    expect(server.schedules).toBeDefined();
    expect(server.network).toBeDefined();
    expect(server.subusers).toBeDefined();
  });

  it('should return null rateLimit initially', () => {
    const client = new PelicanClient({
      baseUrl: 'https://panel.example.com',
      apiKey: 'ptlc_testkey',
    });
    expect(client.rateLimit).toBeNull();
  });
});
