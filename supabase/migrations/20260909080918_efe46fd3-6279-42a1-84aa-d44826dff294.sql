-- 1. Normalizar estados
ALTER TABLE public.leads ALTER COLUMN estado SET DEFAULT 'recibida';
UPDATE public.leads SET estado = CASE
  WHEN estado IN ('atendido','contactada') THEN 'contactada'
  WHEN estado IN ('cerrado','cerrada') THEN 'cerrada'
  ELSE 'recibida' END;
ALTER TABLE public.leads ADD CONSTRAINT leads_estado_valido
  CHECK (estado IN ('recibida','contactada','cerrada'));

-- 2. Historial
CREATE TABLE public.lead_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  estado text NOT NULL,
  changed_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX lead_status_history_lead_idx ON public.lead_status_history (lead_id, created_at DESC);

GRANT SELECT ON public.lead_status_history TO authenticated;
GRANT ALL ON public.lead_status_history TO service_role;

ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Los administradores pueden ver el historial"
ON public.lead_status_history FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::app_role));

-- 3. Registro automático
CREATE OR REPLACE FUNCTION public.log_lead_estado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.lead_status_history (lead_id, estado, changed_by)
    VALUES (NEW.id, NEW.estado, auth.uid());
  ELSIF NEW.estado IS DISTINCT FROM OLD.estado THEN
    INSERT INTO public.lead_status_history (lead_id, estado, changed_by)
    VALUES (NEW.id, NEW.estado, auth.uid());
  END IF;
  RETURN NEW;
END $$;

REVOKE ALL ON FUNCTION public.log_lead_estado() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER leads_log_estado
AFTER INSERT OR UPDATE OF estado ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.log_lead_estado();

-- 4. Sembrar historial inicial para las solicitudes existentes
INSERT INTO public.lead_status_history (lead_id, estado, created_at)
SELECT id, estado, created_at FROM public.leads;
