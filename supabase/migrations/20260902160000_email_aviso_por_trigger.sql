-- Aviso por email al equipo cuando llega una solicitud.
--
-- En lugar de una Edge Function (que hay que desplegar), usamos un trigger que
-- llama a la API de Resend con la extensión pg_net. Así todo se activa
-- ejecutando SQL, sin despliegues.
--
-- REQUISITO: guardar la API key de Resend en Vault ANTES o DESPUÉS de esta
-- migración (una sola vez):
--   select vault.create_secret('re_TU_API_KEY', 'RESEND_API_KEY');
-- Para cambiarla más adelante:
--   select vault.update_secret(
--     (select id from vault.secrets where name = 'RESEND_API_KEY'),
--     're_NUEVA_API_KEY'
--   );

create extension if not exists pg_net;

create or replace function public.leads_email_aviso()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  api_key text;
  remitente text := 'AXHER <hola@axher.es>';
  destinatario text := 'axher2204@gmail.com';
  cuerpo jsonb;
begin
  select decrypted_secret into api_key
  from vault.decrypted_secrets
  where name = 'RESEND_API_KEY'
  limit 1;

  if api_key is null then
    raise warning 'leads_email_aviso: falta el secret RESEND_API_KEY en Vault';
    return new;
  end if;

  cuerpo := jsonb_strip_nulls(jsonb_build_object(
    'from', remitente,
    'to', jsonb_build_array(destinatario),
    'reply_to', new.email,
    'subject', 'Nueva solicitud web — ' || new.empresa,
    'text', format(
      E'Nueva solicitud desde axher.es\n\nNombre: %s\nEmpresa: %s\nTeléfono: %s\nEmail: %s\n\nProyecto:\n%s',
      new.nombre, new.empresa, new.telefono, coalesce(new.email, '—'), new.descripcion
    )
  ));

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || api_key,
      'Content-Type', 'application/json'
    ),
    body := cuerpo
  );

  return new;
end;
$$;

drop trigger if exists leads_email_aviso on public.leads;
create trigger leads_email_aviso
  after insert on public.leads
  for each row execute function public.leads_email_aviso();
