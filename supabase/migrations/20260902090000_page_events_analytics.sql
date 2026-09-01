-- Registro de eventos de navegación para medir el embudo de conversión de la
-- landing (visitas -> formularios -> página de gracias). Sin cookies ni datos
-- personales: solo el tipo de evento, la ruta y el referente.

CREATE TABLE public.page_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event TEXT NOT NULL CHECK (event IN ('landing_view', 'gracias_view', 'form_submit')),
  path TEXT CHECK (char_length(path) <= 200),
  referrer TEXT CHECK (char_length(referrer) <= 400),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX page_events_event_created_at_idx
  ON public.page_events (event, created_at DESC);

GRANT INSERT ON public.page_events TO anon;
GRANT SELECT ON public.page_events TO authenticated;
GRANT ALL ON public.page_events TO service_role;

ALTER TABLE public.page_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cualquiera puede registrar un evento"
ON public.page_events FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Los administradores pueden ver los eventos"
ON public.page_events FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role
));
