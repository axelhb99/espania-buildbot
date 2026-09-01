-- El formulario público escribe en `leads` como rol `anon` (sin leer de vuelta).
-- Dejamos una única política de INSERT permisiva y limpia para anon; las
-- validaciones de longitud ya las impone el CHECK de las columnas.
--
-- (Se dejan sin tocar las políticas de SELECT/UPDATE/DELETE de administradores.)

DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'leads' AND cmd = 'INSERT'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.leads', p.policyname);
  END LOOP;
END $$;

GRANT INSERT ON public.leads TO anon;

CREATE POLICY leads_insert_anon
ON public.leads AS PERMISSIVE FOR INSERT TO anon
WITH CHECK (true);
