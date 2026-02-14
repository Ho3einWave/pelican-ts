# pterodactyl-ts

[![CI](https://github.com/Ho3einWave/pterodactyl-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/Ho3einWave/pterodactyl-ts/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@ho3einwave/pterodactyl-ts)](https://www.npmjs.com/package/@ho3einwave/pterodactyl-ts)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Type-safe TypeScript library for the [Pterodactyl Panel](https://pterodactyl.io/) API. Zero dependencies.

- **Client API** (`PteroClient`) - Account, servers, files, databases, backups, schedules, network, subusers
- **Application API** (`PteroApplication`) - Users, servers, nodes, locations, nests/eggs (admin)
- **WebSocket API** (`WebSocketManager`) - Real-time console, stats, status with auto-reconnect

## Install

```bash
npm install @ho3einwave/pterodactyl-ts
```

## Client API

```ts
import { PteroClient } from '@ho3einwave/pterodactyl-ts';

const client = new PteroClient({
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
```

## Application API

```ts
import { PteroApplication } from '@ho3einwave/pterodactyl-ts';

const app = new PteroApplication({
  baseUrl: 'https://panel.example.com',
  apiKey: 'ptla_...',
});

// Users
const { data: users } = await app.users.list();
const user = await app.users.create({
  email: 'user@example.com',
  username: 'newuser',
  first_name: 'New',
  last_name: 'User',
});

// Servers
const { data: servers } = await app.servers.list();
await app.servers.suspend(1);
await app.servers.unsuspend(1);

// Nodes
const { data: nodes } = await app.nodes.list();

// Locations
const { data: locations } = await app.locations.list();

// Nests & Eggs
const { data: nests } = await app.nests.list();
const { data: eggs } = await app.nests.listEggs(1);
```

## WebSocket

```ts
import { PteroClient, WebSocketManager } from '@ho3einwave/pterodactyl-ts';

const client = new PteroClient({
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
import { PteroError, PteroValidationError, PteroRateLimitError } from '@ho3einwave/pterodactyl-ts';

try {
  await app.users.create({ /* ... */ });
} catch (err) {
  if (err instanceof PteroValidationError) {
    console.log(err.fieldErrors); // { email: ['Must be valid email.'] }
  } else if (err instanceof PteroRateLimitError) {
    console.log(`Retry after ${err.retryAfter}s`);
  } else if (err instanceof PteroError) {
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

## License

MIT
