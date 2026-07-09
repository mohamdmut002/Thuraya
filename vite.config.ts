// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      rolldownOptions: {
        // "cloudflare:workers" is a runtime-provided module inside the Cloudflare
        // Workers environment (used in src/lib/db.server.ts to read bindings like
        // D1). It doesn't exist as a package on disk, so it must be left external
        // instead of bundled — Vite/Rolldown would otherwise fail to resolve it.
        external: ["cloudflare:workers"],
      },
    },
  },
});
