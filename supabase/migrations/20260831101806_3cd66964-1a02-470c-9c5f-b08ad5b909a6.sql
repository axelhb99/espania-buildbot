DROP POLICY IF EXISTS "Los administradores gestionan los roles" ON public.user_roles;

DROP POLICY IF EXISTS "Los administradores pueden ver las solicitudes" ON public.leads;
DROP POLICY IF EXISTS "Los administradores pueden actualizar las solicitudes" ON public.leads;
DROP POLICY IF EXISTS "Los administradores pueden borrar las solicitudes" ON public.leads;

CREATE POLICY "Los administradores pueden ver las solicitudes"
ON public.leads FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

CREATE POLICY "Los administradores pueden actualizar las solicitudes"
ON public.leads FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role))
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));

CREATE POLICY "Los administradores pueden borrar las solicitudes"
ON public.leads FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'::public.app_role));