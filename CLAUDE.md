# espania-buildbot (AXHER WEB)

Sitio web de AXHER: agencia de automatización con IA para empresas de reformas y
construcción en España. Creado en Lovable.

## Stack

- TanStack Start + React 19 + Vite 8
- Tailwind CSS v4, componentes shadcn/ui en `src/components/ui`
- Supabase (`src/integrations/supabase`), migraciones en `supabase/migrations`
- Gestor de paquetes: **bun** (`bun.lock`, `bunfig.toml`). No usar npm/yarn aquí.

## Comandos

```sh
bun install       # instalar dependencias
bun run dev       # servidor de desarrollo -> http://localhost:8080
bun run build     # build de producción
bun run lint      # eslint
bun run format    # prettier --write
```

## Sincronización con Lovable

Este repo está conectado a Lovable (proyecto `bb143c14-d367-4fb4-8437-362de1f37ee2`).
Ver `AGENTS.md`: los commits que se suban a `main` se sincronizan de vuelta a Lovable,
así que hay que mantener la rama en estado funcional. No reescribir historia ya
publicada (nada de force push, rebase, amend o squash sobre commits ya subidos).

`src/routeTree.gen.ts` es generado automáticamente por el dev server; ignorar sus
cambios locales.
