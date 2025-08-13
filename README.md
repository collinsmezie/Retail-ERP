# Retail ERP - TypeScript Monorepo

A TypeScript-based Retail ERP system, structured as a monorepo using npm workspaces.

## Monorepo Structure

```
retail-erp/
├── backend/         # Backend Node.js/TypeScript API
├── client/          # (Future) Frontend client app
├── shared/          # Shared TypeScript types and utilities
│   ├── types/       # Shared interfaces and types
│   └── utils/       # Shared utility functions
├── node_modules/    # Installed dependencies (managed by root)
├── package.json     # Root config (npm workspaces)
└── README.md        # This file
```

### Folders
- **backend/**: All backend code and services.
- **client/**: (Planned) Frontend codebase.
- **shared/**: Shared TypeScript types/interfaces and utility functions for use by both backend and client.

## Setup

1. Install dependencies for all workspaces:
   ```bash
   npm install
   ```

## Running the Apps

- **Backend:**
   ```bash
  npm run dev:backend
  ```
- **Client:** (when implemented)
   ```bash
  npm run dev:client
  ```

## Scripts

- `dev:backend` - Start backend in dev mode
- `dev:client` - Start client in dev mode (future)
- `dev:shared` - (No-op for shared)
- `build:backend` - Build backend
- `build:client` - Build client (future)
- `build:shared` - (No-op for shared)

## About the shared/ Folder

The `shared/` directory contains TypeScript types, interfaces, and utility functions that are used by both the backend and (eventually) the client. This ensures type safety and avoids duplication across the stack.

## TypeScript Configuration

The project uses strict TypeScript settings with:
- ES2022 target
- CommonJS modules
- Source maps enabled
- Declaration files generated
- Strict type checking 