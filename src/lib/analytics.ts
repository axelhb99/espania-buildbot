import { supabase } from "@/integrations/supabase/client";

/**
 * Eventos del embudo de conversión de la landing. Se guardan en la tabla
 * `page_events` (sin cookies ni datos personales) y se consultan desde el
 * panel de administración.
 */
export type FunnelEvent = "landing_view" | "gracias_view" | "form_submit";

/**
 * Registra un evento de navegación. No bloquea la interfaz y nunca lanza:
 * si la petición falla, simplemente no se cuenta ese evento.
 */
export function trackEvent(event: FunnelEvent): void {
  if (typeof window === "undefined") return;

  const path = window.location.pathname.slice(0, 200);
  const referrer = document.referrer ? document.referrer.slice(0, 400) : null;

  void supabase
    .from("page_events")
    .insert({ event, path, referrer })
    .then(
      ({ error }) => {
        if (error) console.debug("[analytics] evento no registrado:", error.message);
      },
      (err) => console.debug("[analytics] evento no registrado:", err),
    );
}
