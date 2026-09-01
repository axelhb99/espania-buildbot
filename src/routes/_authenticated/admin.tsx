import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoaderCircle, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin, getMyRoles } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Solicitudes | Panel AXHER" },
      {
        name: "description",
        content: "Panel privado de AXHER para consultar y filtrar las solicitudes recibidas.",
      },
      { property: "og:title", content: "Solicitudes | Panel AXHER" },
      {
        property: "og:description",
        content: "Panel privado de AXHER para consultar y filtrar las solicitudes recibidas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Lead = {
  id: string;
  nombre: string;
  empresa: string;
  telefono: string;
  email: string | null;
  descripcion: string;
  created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [empresa, setEmpresa] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const rolesQuery = useQuery({
    queryKey: ["my-roles"],
    queryFn: () => getMyRoles(),
  });
  const isAdmin = rolesQuery.data?.roles.includes("admin") ?? false;

  const leadsQuery = useQuery({
    queryKey: ["leads", empresa, desde, hasta],
    enabled: isAdmin,
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("id, nombre, empresa, telefono, email, descripcion, created_at")
        .order("created_at", { ascending: false });

      if (empresa.trim()) query = query.ilike("empresa", `%${empresa.trim()}%`);
      if (desde) query = query.gte("created_at", new Date(`${desde}T00:00:00`).toISOString());
      if (hasta) query = query.lte("created_at", new Date(`${hasta}T23:59:59`).toISOString());

      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data ?? []) as Lead[];
    },
  });

  const funnelQuery = useQuery({
    queryKey: ["funnel", desde, hasta],
    enabled: isAdmin,
    queryFn: async () => {
      const desdeIso = desde ? new Date(`${desde}T00:00:00`).toISOString() : null;
      const hastaIso = hasta ? new Date(`${hasta}T23:59:59`).toISOString() : null;

      const inRange = <
        B extends {
          gte(col: string, val: string): B;
          lte(col: string, val: string): B;
        },
      >(
        q: B,
      ): B => {
        let out = q;
        if (desdeIso) out = out.gte("created_at", desdeIso);
        if (hastaIso) out = out.lte("created_at", hastaIso);
        return out;
      };

      const [visitas, gracias, formularios] = await Promise.all([
        inRange(
          supabase
            .from("page_events")
            .select("*", { count: "exact", head: true })
            .eq("event", "landing_view"),
        ),
        inRange(
          supabase
            .from("page_events")
            .select("*", { count: "exact", head: true })
            .eq("event", "gracias_view"),
        ),
        inRange(supabase.from("leads").select("*", { count: "exact", head: true })),
      ]);

      const firstError = visitas.error ?? gracias.error ?? formularios.error;
      if (firstError) throw new Error(firstError.message);

      return {
        visitas: visitas.count ?? 0,
        gracias: gracias.count ?? 0,
        formularios: formularios.count ?? 0,
      };
    },
  });

  const claim = useMutation({
    mutationFn: () => claimFirstAdmin(),
    onSuccess: (res) => {
      if (res.granted) {
        toast.success("Ya eres administrador.");
        queryClient.invalidateQueries({ queryKey: ["my-roles"] });
      } else {
        toast.error("Ya existe un administrador. Pide acceso al propietario.");
      }
    },
    onError: () => toast.error("No se pudo asignar el rol de administrador."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Solicitud eliminada.");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["funnel"] });
    },
    onError: () => toast.error("No se pudo eliminar la solicitud."),
  });

  const total = leadsQuery.data?.length ?? 0;
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("es-ES", {
        dateStyle: "short",
        timeStyle: "short",
        timeZone: "Europe/Madrid",
      }),
    [],
  );

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Solicitudes recibidas
            </h1>
            <p className="text-sm text-muted-foreground">
              Gestiona los leads enviados desde el formulario de la web.
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            Cerrar sesión
          </Button>
        </header>

        {rolesQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Comprobando permisos…</p>
        ) : !isAdmin ? (
          <div className="surface-card space-y-4 p-6">
            <div className="flex items-center gap-2 text-foreground">
              <ShieldCheck className="size-5" />
              <h2 className="text-lg font-semibold">Sin permisos de administrador</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu cuenta no tiene el rol de administrador, por lo que no puede ver las
              solicitudes. Si eres el propietario y aún no hay ningún administrador, puedes
              reclamar el acceso ahora.
            </p>
            <Button onClick={() => claim.mutate()} disabled={claim.isPending}>
              {claim.isPending && <LoaderCircle className="animate-spin" />}
              Reclamar acceso de administrador
            </Button>
          </div>
        ) : (
          <>
            <section className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="f-empresa">Empresa</Label>
                <Input
                  id="f-empresa"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Buscar por empresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-desde">Desde</Label>
                <Input
                  id="f-desde"
                  type="date"
                  value={desde}
                  onChange={(e) => setDesde(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="f-hasta">Hasta</Label>
                <Input
                  id="f-hasta"
                  type="date"
                  value={hasta}
                  onChange={(e) => setHasta(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmpresa("");
                    setDesde("");
                    setHasta("");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-semibold text-foreground">Conversión de la landing</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Medición anónima y sin cookies. Se aplica el rango de fechas de los filtros.
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Visitas a la landing", value: funnelQuery.data?.visitas ?? 0 },
                  { label: "Formularios enviados", value: funnelQuery.data?.formularios ?? 0 },
                  { label: "Llegadas a /gracias", value: funnelQuery.data?.gracias ?? 0 },
                  {
                    label: "Tasa de conversión",
                    value:
                      funnelQuery.data && funnelQuery.data.visitas > 0
                        ? `${((funnelQuery.data.formularios / funnelQuery.data.visitas) * 100).toFixed(1)}%`
                        : "—",
                  },
                ].map((tile) => (
                  <div key={tile.label} className="surface-card p-5">
                    <p className="text-sm text-muted-foreground">{tile.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {funnelQuery.isLoading ? "…" : tile.value}
                    </p>
                  </div>
                ))}
              </div>
              {funnelQuery.isError && (
                <p className="mt-2 text-sm text-destructive" role="alert">
                  No se pudieron cargar las métricas de conversión.
                </p>
              )}
            </section>

            <p className="text-sm text-muted-foreground">
              {leadsQuery.isLoading ? "Cargando solicitudes…" : `${total} solicitud(es)`}
            </p>

            {leadsQuery.isError && (
              <p className="text-sm text-destructive" role="alert">
                No se pudieron cargar las solicitudes.
              </p>
            )}

            <div className="surface-card overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="min-w-[240px]">Proyecto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(leadsQuery.data ?? []).map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatter.format(new Date(lead.created_at))}
                      </TableCell>
                      <TableCell className="font-medium">{lead.nombre}</TableCell>
                      <TableCell>{lead.empresa}</TableCell>
                      <TableCell className="space-y-1">
                        <a className="block hover:underline" href={`tel:${lead.telefono}`}>
                          {lead.telefono}
                        </a>
                        {lead.email && (
                          <a
                            className="block text-muted-foreground hover:underline"
                            href={`mailto:${lead.email}`}
                          >
                            {lead.email}
                          </a>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md whitespace-pre-wrap text-muted-foreground">
                        {lead.descripcion}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove.mutate(lead.id)}
                          disabled={remove.isPending}
                        >
                          Eliminar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!leadsQuery.isLoading && total === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        No hay solicitudes con estos filtros.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
