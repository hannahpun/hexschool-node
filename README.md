# express-practice

A practice Express.js (v5) Todo API written in TypeScript, with Zod request validation and ESLint + Prettier tooling.

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **Language:** TypeScript (executed via `tsx`)
- **Validation:** Zod
- **Lint / Format:** ESLint, Prettier

## Project Structure

```
src/
├── app.ts                  # App entry point
├── routes/
│   └── todoRoutes.ts       # /todos route definitions
├── controllers/
│   └── todoController.ts
├── middlewares/
│   └── validate.ts         # Zod-based body validator
└── schemas/
    └── todoSchema.ts       # Zod request schemas
```

## Getting Started

### Prerequisites

- Node.js (a recent LTS that supports the `tsx` loader)
- npm

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

The server starts on `http://localhost:3000`.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server with `tsx watch` (auto-reload on file changes) |
| `npm run lint` | Run ESLint over the project |
| `npm run lint:fix` | Run ESLint with `--fix` |
| `npm run format` | Format the codebase with Prettier |
| `npm run format:check` | Check formatting without writing |

## API

Base path: `/todos`

| Method | Path | Description | Body |
| --- | --- | --- | --- |
| `GET` | `/todos` | List all todos | — |
| `POST` | `/todos` | Create a todo | `{ "title": string }` |
| `PATCH` | `/todos/:id` | Update a todo's title | `{ "title": string }` |
| `DELETE` | `/todos/:id` | Delete a todo | — |

### Response format

Success:

```json
{ "status": "success", "data": [ ... ] }
```

Validation error (`400`):

```json
{
  "status": "error",
  "errors": [{ "path": ["title"], "message": "標題不可為空" }]
}
```

Unknown route (`404`):

```json
{ "status": "error", "message": "無此路由資訊" }
```

Server error (`500`):

```json
{ "status": "error", "message": "server error" }
```

### Example

```bash
# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries"}'

# List todos
curl http://localhost:3000/todos
```

> Note: todos are currently held in memory and reset whenever the server restarts.
