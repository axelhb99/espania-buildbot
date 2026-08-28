CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL CHECK (char_length(nombre) BETWEEN 2 AND 100),
  empresa TEXT NOT NULL CHECK (char_length(empresa) BETWEEN 2 AND 150),
  telefono TEXT NOT NULL CHECK (char_length(telefono) BETWEEN 6 AND 20),
  descripcion TEXT NOT NULL CHECK (char_length(descripcion) BETWEEN 10 AND 2000),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT INSERT ON public.leads TO anon;
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cualquiera puede enviar una solicitud" ON public.leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Solo usuarios autenticados pueden leer solicitudes" ON public.leads FOR SELECT TO authenticated USING (true);