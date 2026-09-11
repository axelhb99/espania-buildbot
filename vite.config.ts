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
  nitro: {
    cloudflare: {
      // Bake the public Supabase config into the generated Worker deploy config
      // (.output/server/wrangler.json). The generated server middleware
      // (src/integrations/supabase/auth-middleware.ts, client.server.ts) reads
      // these from process.env, which is empty on the Cloudflare Workers runtime
      // unless declared here. Both values are public: the URL and the
      // sb_publishable_ key are already shipped in the client bundle and .env.
      // The secret service-role key must be set as a Worker secret in the
      // Cloudflare dashboard, never committed here.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error - forwarded verbatim to Nitro's cloudflare preset at
      // runtime; the lovable config's public type omits `wrangler`.
      wrangler: {
        vars: {
          SUPABASE_URL: "https://qsjnfqzoqaxaczrjjxwq.supabase.co",
          SUPABASE_PUBLISHABLE_KEY: "sb_publishable_vkBDpn8yY-0jAEvsTDDA5Q_kvN2Bl78",
        },
      },
    },
  },
});
