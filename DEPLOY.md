# Despliegue en Cloudflare (gratis)

El proyecto se compila con el preset `cloudflare-module` de Nitro, así que
`bun run build` genera un Worker de Cloudflare listo para desplegar en
`.output/server/` (con su `wrangler.json`).

## 1. Cuenta de Cloudflare y dominio

1. Crea una cuenta gratuita en [cloudflare.com](https://dash.cloudflare.com/sign-up).
2. **Add a site** → `axher.es` → plan **Free**.
3. Cloudflare te dará **2 nameservers** (p. ej. `xxx.ns.cloudflare.com`).
4. En **DonDominio** → `axher.es` → **Cambiar servidores DNS** → pon esos 2 de
   Cloudflare y guarda. La propagación tarda de minutos a unas horas.
5. Cuando Cloudflare marque el dominio como **Active**, sigue.

## 2. Desplegar la web (Workers Builds, se actualiza solo con cada push)

1. Cloudflare → **Workers & Pages** → **Create** → pestaña **Workers** →
   **Import a repository** → conecta GitHub → elige `axelhb99/espania-buildbot`.
2. Configuración de build:
   - **Build command:** `bun run build`
   - **Deploy command:** `npx wrangler deploy -c .output/server/wrangler.json`
   - **Version command:** (déjalo vacío)
   - Rama de producción: `main`
3. **Save and Deploy**. El primer build tarda unos minutos.
4. Al terminar, la web está en `axelhb99-espania-buildbot.<tu-sub>.workers.dev`.

## 3. Conectar el dominio a la web

Cloudflare → tu Worker → **Settings** → **Domains & Routes** → **Add** →
**Custom Domain**:

- `axher.es`
- `www.axher.es`

Cloudflare crea los registros y el certificado HTTPS automáticamente.

## 4. Correo (`@axher.es` con Resend)

1. Resend → **Domains** → **Add Domain** → `axher.es` → región **EU (Ireland)**.
2. Resend muestra unos registros DNS (SPF `TXT`, DKIM `CNAME`/`TXT`, a veces
   `MX` para `send`). Añádelos en **Cloudflare → DNS → Records**:
   - Type / Name / Content tal cual los da Resend.
   - **Proxy status: DNS only** (nube gris) para TODOS los registros de correo.
3. En Resend, pulsa **Verify** hasta que salga en verde.
4. Cambia el remitente ejecutando en el SQL Editor de Supabase el
   `create or replace function public.leads_email_aviso()` con
   `remitente text := 'AXHER <web@axher.es>'`.

## Notas

- Las variables de Supabase van en `.env` (claves públicas) y se incrustan en el
  build, así que no hace falta configurarlas en Cloudflare.
- Editar en Lovable sigue funcionando igual: cada cambio se sincroniza a GitHub
  y Cloudflare vuelve a desplegar solo.
