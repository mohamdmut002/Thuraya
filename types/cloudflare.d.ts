// Minimal ambient types so the project compiles without pulling in
// @cloudflare/workers-types as an extra dependency. These cover only what
// this project actually uses (D1). If you later need KV, R2, etc., either
// extend this file or install @cloudflare/workers-types and run
// `wrangler types` to generate the real ones.

interface D1Result<T = unknown> {
  results: T[];
  success: boolean;
  meta: unknown;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
  exec(query: string): Promise<{ count: number; duration: number }>;
}

interface CloudflareEnv {
  DB: D1Database;
  SESSION_SECRET?: string;
  ADMIN_SETUP_TOKEN?: string;
}

// Cloudflare Workers' native "cloudflare:workers" module, available at
// request-time inside Workers (workerd runtime). Must only be accessed
// inside server function handlers, never at module top-level scope.
declare module "cloudflare:workers" {
  export const env: CloudflareEnv;
}
