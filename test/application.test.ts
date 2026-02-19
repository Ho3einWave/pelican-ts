import { describe, expect, it } from 'vitest';
import { PelicanApplication } from '../src/application/index.js';

describe('PelicanApplication', () => {
  it('should create with valid options', () => {
    const app = new PelicanApplication({
      baseUrl: 'https://panel.example.com',
      apiKey: 'ptla_testkey',
    });
    expect(app).toBeDefined();
    expect(app.users).toBeDefined();
    expect(app.servers).toBeDefined();
    expect(app.nodes).toBeDefined();
    expect(app.eggs).toBeDefined();
    expect(app.databaseHosts).toBeDefined();
    expect(app.mounts).toBeDefined();
    expect(app.roles).toBeDefined();
  });

  it('should return null rateLimit initially', () => {
    const app = new PelicanApplication({
      baseUrl: 'https://panel.example.com',
      apiKey: 'ptla_testkey',
    });
    expect(app.rateLimit).toBeNull();
  });
});
