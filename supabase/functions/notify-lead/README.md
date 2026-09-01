# notify-lead

Envía un email de aviso al equipo cada vez que alguien envía el formulario de
contacto de la web. La invoca `src/components/contact-form.tsx` después de
guardar el lead en la tabla `leads`.

El envío **no bloquea** el formulario: si el email falla, el lead ya está
guardado y aparece igualmente en el panel de administración.

## Puesta en marcha (una sola vez)

1. **Crear una cuenta en [Resend](https://resend.com)** (plan gratuito: 3.000
   emails/mes).
2. **Verificar el dominio `axher.es`** en Resend → _Domains_ → _Add Domain_, y
   añadir los registros DNS que indica. Mientras tanto se puede probar con el
   remitente de pruebas `onboarding@resend.dev` (solo entrega al email con el
   que te registraste en Resend).
3. **Crear una API key** en Resend → _API Keys_.
4. **Configurar los _secrets_** en Lovable (_Cloud_ → _Settings_ → _Secrets_) o
   en el panel de Supabase (_Edge Functions_ → _Manage secrets_):

   | Secret | Valor | Obligatorio |
   | --- | --- | --- |
   | `RESEND_API_KEY` | la API key de Resend | Sí |
   | `LEAD_NOTIFICATION_TO` | email que recibe los avisos | No (por defecto `hola@axher.es`) |
   | `LEAD_NOTIFICATION_FROM` | remitente verificado, p. ej. `AXHER <web@axher.es>` | No (por defecto `AXHER <onboarding@resend.dev>`) |

5. **Desplegar la función.** Lovable la despliega automáticamente al sincronizar
   este repositorio. En local con la CLI de Supabase:
   `supabase functions deploy notify-lead`

## Prueba

Envía el formulario en la web (o en local) y comprueba que llega el email.
Los errores quedan registrados en los logs de la función
(_Edge Functions_ → `notify-lead` → _Logs_).
