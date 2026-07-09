import { env } from "cloudflare:workers";

/**
 * Returns the D1 database binding.
 *
 * IMPORTANT: only call this from inside a server function handler (never at
 * module top-level scope) — Cloudflare bindings are only populated once a
 * request is actually being handled.
 *
 * NOTE: `vite dev` (plain local dev without Wrangler) has no Cloudflare
 * bindings at all. To test D1-backed features locally you need
 * `wrangler dev` (or `bunx wrangler dev`), which emulates the Cloudflare
 * runtime including D1, using a local SQLite file under .wrangler/.
 */
export function getDb(): D1Database {
  const db = env.DB;
  if (!db) {
    throw new Error(
      "D1 database binding 'DB' was not found. Make sure wrangler.jsonc has a " +
        "d1_databases entry named DB, and that you're running via `wrangler dev` " +
        "or a real Cloudflare Workers deployment (plain `vite dev` has no bindings).",
    );
  }
  return db;
}
