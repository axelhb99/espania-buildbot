-- Mejoras del panel de administración y de la analítica.

-- 1. Estado de cada solicitud para poder marcarla como atendida desde el panel.
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'pendiente'
  CHECK (estado IN ('pendiente', 'atendido'));

-- 2. Nuevo evento de analítica: clic en los botones de WhatsApp.
ALTER TABLE public.page_events DROP CONSTRAINT IF EXISTS page_events_event_check;
ALTER TABLE public.page_events
  ADD CONSTRAINT page_events_event_check
  CHECK (event IN ('landing_view', 'gracias_view', 'form_submit', 'whatsapp_click'));

-- 3. Permitir a los administradores borrar eventos (limpieza de datos de prueba).
GRANT DELETE ON public.page_events TO authenticated;

DROP POLICY IF EXISTS "Los administradores pueden borrar los eventos" ON public.page_events;
CREATE POLICY "Los administradores pueden borrar los eventos"
ON public.page_events FOR DELETE TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
));
