import { describe, expect, it } from 'vitest';
import { WebSocketManager } from '../src/websocket/websocket-manager.js';

describe('WebSocketManager', () => {
  it('should create with valid options', () => {
    const ws = new WebSocketManager({
      origin: 'https://node1.example.com',
      serverUuid: 'abc-123-def',
      getToken: async () => 'test-token',
    });
    expect(ws).toBeDefined();
    expect(ws.connected).toBe(false);
  });

  it('should support on/off event handlers', () => {
    const ws = new WebSocketManager({
      origin: 'https://node1.example.com',
      serverUuid: 'abc-123-def',
      getToken: async () => 'test-token',
    });

    const handler = () => {};
    ws.on('console output', handler);
    ws.off('console output', handler);
  });

  it('should be chainable with on()', () => {
    const ws = new WebSocketManager({
      origin: 'https://node1.example.com',
      serverUuid: 'abc-123-def',
      getToken: async () => 'test-token',
    });

    const result = ws
      .on('status', () => {})
      .on('console output', () => {})
      .on('stats', () => {});

    expect(result).toBe(ws);
  });

  it('should not throw when sending commands while disconnected', () => {
    const ws = new WebSocketManager({
      origin: 'https://node1.example.com',
      serverUuid: 'abc-123-def',
      getToken: async () => 'test-token',
    });

    expect(() => ws.sendCommand('say hello')).not.toThrow();
    expect(() => ws.sendPowerAction('start')).not.toThrow();
  });
});
