# Problem 5 — Tasks CRUD API

A NestJS + Prisma + PostgreSQL CRUD service for a `Task` resource.

## Stack

- **NestJS 10** (Express adapter) + TypeScript 5
- **Prisma 5** as the ORM
- **PostgreSQL 16** running in Docker
- **class-validator / class-transformer** for DTO validation

## Resource model

```ts
Task {
  id          string (uuid)
  title       string  (1–200 chars)
  description string? (≤ 2000 chars)
  status      "TODO" | "IN_PROGRESS" | "DONE"   (default: TODO)
  dueDate     Date?
  createdAt   Date
  updatedAt   Date
}
```

## API

| Method | Path          | Description                                                |
| ------ | ------------- | ---------------------------------------------------------- |
| POST   | `/tasks`      | Create a task.                                             |
| GET    | `/tasks`      | List tasks with filters + pagination.                      |
| GET    | `/tasks/:id`  | Get one task by UUID.                                      |
| PATCH  | `/tasks/:id`  | Partial update.                                            |
| DELETE | `/tasks/:id`  | Delete (returns `204`).                                    |

### List filters (`GET /tasks` query params)

| Param       | Type    | Notes                                          |
| ----------- | ------- | ---------------------------------------------- |
| `status`    | enum    | `TODO`, `IN_PROGRESS`, or `DONE`.              |
| `q`         | string  | Case-insensitive substring match on `title`.   |
| `dueBefore` | ISO date | Tasks with `dueDate <= dueBefore`.            |
| `dueAfter`  | ISO date | Tasks with `dueDate >= dueAfter`.             |
| `limit`     | int     | 1–100, default 20.                             |
| `offset`    | int     | ≥ 0, default 0.                                |

Response shape: `{ data: Task[], total: number, limit: number, offset: number }`.

## Prerequisites

- **Node.js 20+**
- **Docker** (for Postgres)

## Setup

```bash
cd src/problem5

# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env

# 3. Start Postgres in Docker
npm run db:up

# 4. Apply the committed migrations (creates the `tasks` table + enum)
npm run prisma:deploy

# 5. Start the server in watch mode
npm run start:dev
```

> The initial migration lives in `prisma/migrations/` and is committed to the
> repo. New environments only need `prisma migrate deploy` — you don't need
> to run `prisma migrate dev --name init` again.

Server listens on `http://localhost:3000` by default.

### Swagger / OpenAPI

Interactive docs are available once the server is running:

- **Swagger UI:** http://localhost:3000/docs
- **OpenAPI JSON:** http://localhost:3000/docs-json

DTO schemas (types, validation rules, enum values) are auto-generated from the
TypeScript source via the `@nestjs/swagger` CLI plugin — no manual
`@ApiProperty()` decoration needed.

## Configuration

`.env` (copied from `.env.example`):

| Var            | Default                                                            |
| -------------- | ------------------------------------------------------------------ |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/tasks?schema=public` |
| `PORT`         | `3000`                                                             |

## Quick try

```bash
# Create
curl -sX POST http://localhost:3000/tasks \
  -H 'content-type: application/json' \
  -d '{"title":"Write docs","status":"TODO","dueDate":"2026-06-01T00:00:00Z"}'

# List (with filter)
curl -s "http://localhost:3000/tasks?status=TODO&limit=10"

# Get one
curl -s http://localhost:3000/tasks/<uuid>

# Update
curl -sX PATCH http://localhost:3000/tasks/<uuid> \
  -H 'content-type: application/json' \
  -d '{"status":"DONE"}'

# Delete
curl -sX DELETE http://localhost:3000/tasks/<uuid> -i
```

## Useful scripts

| Script                | What it does                                  |
| --------------------- | --------------------------------------------- |
| `npm run start:dev`   | Run with auto-reload.                         |
| `npm run build`       | Compile to `dist/`.                           |
| `npm run start:prod`  | Run compiled output.                          |
| `npm run db:up`       | Start the Postgres container.                 |
| `npm run db:down`     | Stop the Postgres container.                  |
| `npm run prisma:deploy`  | Apply committed migrations (use in dev + prod). |
| `npm run prisma:migrate` | Create a new migration when the schema changes. |
| `npm run prisma:reset`   | Drop + recreate the DB (destructive!).      |
| `npm run prisma:generate` | Regenerate the Prisma client.              |

## Project layout

```
src/problem5/
├── docker-compose.yml         # Postgres service
├── prisma/
│   └── schema.prisma          # Task model + TaskStatus enum
├── src/
│   ├── main.ts                # Bootstrap + global validation pipe
│   ├── app.module.ts          # Root module
│   ├── prisma/                # PrismaService + PrismaModule (global)
│   └── tasks/
│       ├── tasks.controller.ts
│       ├── tasks.service.ts
│       ├── tasks.module.ts
│       └── dto/
│           ├── create-task.dto.ts
│           ├── update-task.dto.ts
│           └── list-tasks.dto.ts
├── .env.example
├── nest-cli.json
├── package.json
└── tsconfig.json
```
