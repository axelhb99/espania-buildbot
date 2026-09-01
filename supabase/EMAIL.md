# Aviso por email de nuevas solicitudes

Cuando alguien envía el formulario de la web, un **trigger** de la base de datos
(`leads_email_aviso`, ver `migrations/20260902160000_email_aviso_por_trigger.sql`)
llama a la API de [Resend](https://resend.com) y manda un correo al equipo.

No hay Edge Functions que desplegar: todo se activa ejecutando SQL en el
**SQL Editor** de Supabase.

## Puesta en marcha (una sola vez)

1. Crea una cuenta en **[resend.com](https://resend.com)**. Regístrate con
   `axher2204@gmail.com` para poder recibir las pruebas con el remitente
   `onboarding@resend.dev`.
2. En Resend → **API Keys** → crea una key (empieza por `re_…`).
3. En el **SQL Editor** de Supabase, guarda la key en Vault:

   ```sql
   select vault.create_secret('re_TU_API_KEY', 'RESEND_API_KEY');
   ```

4. Ejecuta la migración `20260902160000_email_aviso_por_trigger.sql`.

## Comprobar

Envía el formulario en la web. Debería llegar el correo a `axher2204@gmail.com`
en 1-2 minutos. Si no llega, revisa las peticiones de pg_net:

```sql
select * from net._http_response order by created desc limit 5;
```

## Cambiar cosas

- **Otro destinatario o remitente**: edita `remitente` / `destinatario` en la
  función `public.leads_email_aviso()` y vuelve a ejecutar el `create or replace`.
- **Rotar la API key**:

  ```sql
  select vault.update_secret(
    (select id from vault.secrets where name = 'RESEND_API_KEY'),
    're_NUEVA_API_KEY'
  );
  ```

- **Enviar desde `web@axher.es`** en vez de `onboarding@resend.dev`: verifica el
  dominio `axher.es` en Resend (registros DNS) y cambia `remitente`.
