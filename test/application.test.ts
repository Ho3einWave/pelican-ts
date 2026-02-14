import { describe, expect, it } from 'vitest';
import { PteroApplication } from '../src/application/index.js';

describe('PteroApplication', () => {
  it('should create with valid options', () => {
    const app = new PteroApplication({
      baseUrl: 'https://panel.example.com',
      apiKey: 'ptla_testkey',
    });
    expect(app).toBeDefined();
    expect(app.users).toBeDefined();
    expect(app.servers).toBeDefined();
    expect(app.nodes).toBeDefined();
    expect(app.locations).toBeDefined();
    expect(app.nests).toBeDefined();
  });

  it('should return null rateLimit initially', () => {
    const app = new PteroApplication({
      baseUrl: 'https://panel.example.com',
      apiKey: 'ptla_testkey',
    });
    expect(app.rateLimit).toBeNull();
  });
});
