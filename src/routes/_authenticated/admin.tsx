import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoaderCircle, ShieldCheck, Download } from "lucide-react";
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
  estado: string;
  created_at: string;
};

function toCsv(rows: Lead[], formatter: Intl.DateTimeFormat): string {
  const cell = (value: string) => `"${value.replace(/"/g, '""')}"`;
  const header = ["Fecha", "Estado", "Nombre", "Empresa", "Teléfono", "Email", "Proyecto"];
  const lines = rows.map((r) =>
    [
      formatter.format(new Date(r.created_at)),
      r.estado,
      r.nombre,
      r.empresa,
      r.telefono,
      r.email ?? "",
      r.descripcion,
    ]
      .map((v) => cell(String(v)))
      .join(","),
  );
  return [header.map(cell).join(","), ...lines].join("\r\n");
}

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
        .select("id, nombre, empresa, telefono, email, descripcion, estado, created_at")
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

      const countEvent = (event: string) =>
        inRange(
          supabase
            .from("page_events")
            .select("*", { count: "exact", head: true })
            .eq("event", event),
        );

      const [visitas, gracias, whatsapp, formularios, referrers] = await Promise.all([
        countEvent("landing_view"),
        countEvent("gracias_view"),
        countEvent("whatsapp_click"),
        inRange(supabase.from("leads").select("*", { count: "exact", head: true })),
        inRange(
          supabase.from("page_events").select("referrer").eq("event", "landing_view").limit(5000),
        ),
      ]);

      const firstError =
        visitas.error ?? gracias.error ?? whatsapp.error ?? formularios.error ?? referrers.error;
      if (firstError) throw new Error(firstError.message);

      const ownHost =
        typeof window !== "undefined" ? window.location.hostname.replace(/^www\./, "") : "";
      const sources = new Map<string, number>();
      for (const row of referrers.data ?? []) {
        let key = "Directo";
        const ref = (row as { referrer: string | null }).referrer;
        if (ref) {
          try {
            const host = new URL(ref).hostname.replace(/^www\./, "");
            key = host && host !== ownHost ? host : "Directo";
          } catch {
            /* referrer no válido: se cuenta como Directo */
          }
        }
        sources.set(key, (sources.get(key) ?? 0) + 1);
      }
      const topSources = [...sources.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

      return {
        visitas: visitas.count ?? 0,
        gracias: gracias.count ?? 0,
        whatsapp: whatsapp.count ?? 0,
        formularios: formularios.count ?? 0,
        topSources,
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

  const setEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: string }) => {
      const { error } = await supabase.from("leads").update({ estado }).eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
    onError: () => toast.error("No se pudo cambiar el estado."),
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

  const exportCsv = () => {
    const rows = leadsQuery.data ?? [];
    if (rows.length === 0) {
      toast.info("No hay solicitudes que exportar.");
      return;
    }
    // BOM inicial para que Excel abra los acentos correctamente.
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), toCsv(rows, formatter)], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `solicitudes-axher-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const conversion =
    funnelQuery.data && funnelQuery.data.visitas > 0
      ? `${((funnelQuery.data.formularios / funnelQuery.data.visitas) * 100).toFixed(1)}%`
      : "—";

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
              Tu cuenta no tiene el rol de administrador, por lo que no puede ver las solicitudes.
              Si eres el propietario y aún no hay ningún administrador, puedes reclamar el acceso
              ahora.
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
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { label: "Visitas a la landing", value: funnelQuery.data?.visitas ?? 0 },
                  { label: "Formularios enviados", value: funnelQuery.data?.formularios ?? 0 },
                  { label: "Llegadas a /gracias", value: funnelQuery.data?.gracias ?? 0 },
                  { label: "Clics en WhatsApp", value: funnelQuery.data?.whatsapp ?? 0 },
                  { label: "Tasa de conversión", value: conversion },
                ].map((tile) => (
                  <div key={tile.label} className="surface-card p-5">
                    <p className="text-sm text-muted-foreground">{tile.label}</p>
                    <p className="mt-1 text-2xl font-bold text-foreground">
                      {funnelQuery.isLoading ? "…" : tile.value}
                    </p>
                  </div>
                ))}
              </div>

              {(funnelQuery.data?.topSources.length ?? 0) > 0 && (
                <div className="surface-card mt-4 p-5">
                  <p className="text-sm font-semibold text-foreground">Origen de las visitas</p>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {funnelQuery.data?.topSources.map(([host, count]) => (
                      <li key={host} className="flex items-center justify-between gap-4">
                        <span className="min-w-0 truncate text-muted-foreground">{host}</span>
                        <span className="font-medium text-foreground">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {funnelQuery.isError && (
                <p className="mt-2 text-sm text-destructive" role="alert">
                  No se pudieron cargar las métricas de conversión.
                </p>
              )}
            </section>

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                {leadsQuery.isLoading ? "Cargando solicitudes…" : `${total} solicitud(es)`}
              </p>
              <Button variant="outline" size="sm" onClick={exportCsv} disabled={total === 0}>
                <Download className="size-4" />
                Exportar CSV
              </Button>
            </div>

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
                    <TableHead>Estado</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead className="min-w-[240px]">Proyecto</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(leadsQuery.data ?? []).map((lead) => {
                    const atendido = lead.estado === "atendido";
                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="whitespace-nowrap text-muted-foreground">
                          {formatter.format(new Date(lead.created_at))}
                        </TableCell>
                        <TableCell>
                          <button
                            type="button"
                            onClick={() =>
                              setEstado.mutate({
                                id: lead.id,
                                estado: atendido ? "pendiente" : "atendido",
                              })
                            }
                            disabled={setEstado.isPending}
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                              atendido
                                ? "bg-primary/15 text-primary hover:bg-primary/25"
                                : "bg-muted text-muted-foreground hover:bg-muted/70"
                            }`}
                            title="Cambiar estado"
                          >
                            {atendido ? "Atendido" : "Pendiente"}
                          </button>
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
                    );
                  })}
                  {!leadsQuery.isLoading && total === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
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
