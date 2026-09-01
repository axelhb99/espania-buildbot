-- El formulario público de la web escribe en `leads` como rol `anon`.
-- Restauramos esa política (por si una revisión posterior la eliminó o
-- endureció) con validaciones de longitud que reflejan las del propio esquema.

GRANT INSERT ON public.leads TO anon;

DROP POLICY IF EXISTS "Cualquiera puede enviar una solicitud" ON public.leads;
CREATE POLICY "Cualquiera puede enviar una solicitud"
ON public.leads FOR INSERT TO anon
WITH CHECK (
  char_length(nombre) BETWEEN 2 AND 100
  AND char_length(empresa) BETWEEN 2 AND 150
  AND char_length(telefono) BETWEEN 6 AND 20
  AND char_length(descripcion) BETWEEN 10 AND 2000
);
