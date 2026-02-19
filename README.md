# pelican-ts

[![CI](https://github.com/Ho3einWave/pelican-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/Ho3einWave/pelican-ts/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@ho3einwave/pelican-ts)](https://www.npmjs.com/package/@ho3einwave/pelican-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Type-safe TypeScript library for the [Pelican Panel](https://pelican.dev/) API. Zero dependencies.

- **Client API** (`PelicanClient`) - Account, servers, files, databases, backups, schedules, network, subusers
- **Application API** (`PelicanApplication`) - Users, servers, nodes, eggs, database hosts, mounts, roles (admin)
- **WebSocket API** (`WebSocketManager`) - Real-time console, stats, status with auto-reconnect

## Install

```bash
npm install @ho3einwave/pelican-ts
```

## Quick Start

### Client API

The Client API uses a **client API key** (prefix `ptlc_`) and gives access to the user-facing endpoints: account management, server operations, files, databases, backups, schedules, etc.

```ts
import { PelicanClient } from '@ho3einwave/pelican-ts';

const client = new PelicanClient({
  baseUrl: 'https://panel.example.com',
  apiKey: 'ptlc_...',
});

// Account
const account = await client.account.getDetails();

// List servers
const { data: servers } = await client.servers.list();

// Server-scoped operations
const srv = client.server('abc123');

await srv.sendCommand('say Hello!');
await srv.setPowerState('restart');

const resources = await srv.getResources();
console.log(`Memory: ${resources.resources.memory_bytes}`);

// Files
const files = await srv.files.list('/');
const content = await srv.files.getContent('/server.properties');
await srv.files.writeFile('/motd.txt', 'Welcome!');

// Backups
const { data: backups } = await srv.backups.list();
const backup = await srv.backups.create({ name: 'before-update' });

// Databases
const dbs = await srv.databases.list();
const newDb = await srv.databases.create({ database: 'mydb', remote: '%' });

// Schedules
const schedules = await srv.schedules.list();

// Permissions
const permissions = await client.getPermissions();
```

### Application API

The Application API uses an **application API key** (prefix `ptla_`) and provides admin-level access: managing users, servers, nodes, eggs, database hosts, mounts, and roles.

```ts
import { PelicanApplication } from '@ho3einwave/pelican-ts';

const app = new PelicanApplication({
  baseUrl: 'https://panel.example.com',
  apiKey: 'ptla_...',
});

// Users
const { data: users } = await app.users.list();
const user = await app.users.create({
  email: 'user@example.com',
  username: 'newuser',
});

// Servers
const { data: servers } = await app.servers.list();
await app.servers.suspend(1);
await app.servers.unsuspend(1);

// Nodes
const { data: nodes } = await app.nodes.list();

// Eggs (top-level in Pelican)
const { data: eggs } = await app.eggs.list();

// Database Hosts
const { data: dbHosts } = await app.databaseHosts.list();

// Mounts
const { data: mounts } = await app.mounts.list();

// Roles
const { data: roles } = await app.roles.list();
```

### WebSocket

```ts
import { PelicanClient, WebSocketManager } from '@ho3einwave/pelican-ts';

const client = new PelicanClient({
  baseUrl: 'https://panel.example.com',
  apiKey: 'ptlc_...',
});

const srv = client.server('abc123');
const creds = await srv.getWebSocketCredentials();

const ws = new WebSocketManager({
  origin: creds.socket,
  serverUuid: 'full-server-uuid',
  getToken: async () => {
    const c = await srv.getWebSocketCredentials();
    return c.token;
  },
});

ws.on('console output', (line) => console.log(line));
ws.on('status', (status) => console.log('Status:', status));
ws.on('stats', (stats) => console.log('CPU:', stats.cpu_absolute));

await ws.connect();

ws.sendCommand('say Hello from API!');
ws.sendPowerAction('restart');

// Later
ws.disconnect();
```

## Error Handling

```ts
import { PelicanError, PelicanValidationError, PelicanRateLimitError } from '@ho3einwave/pelican-ts';

try {
  await app.users.create({
    /* ... */
  });
} catch (err) {
  if (err instanceof PelicanValidationError) {
    console.log(err.fieldErrors); // { email: ['Must be valid email.'] }
  } else if (err instanceof PelicanRateLimitError) {
    console.log(`Retry after ${err.retryAfter}s`);
  } else if (err instanceof PelicanError) {
    console.log(err.status, err.code, err.message);
  }
}
```

## Pagination & Filtering

```ts
const { data, pagination } = await app.servers.list({
  page: 2,
  perPage: 25,
  sort: '-id',
  filters: { name: 'minecraft' },
  include: ['allocations', 'user'],
});

console.log(`Page ${pagination.currentPage} of ${pagination.totalPages}`);
```

## API Reference

See [API.md](API.md) for the full API reference with all managers, methods, types, and parameters.

## License

MIT
