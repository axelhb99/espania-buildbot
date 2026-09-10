import { useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyRoles } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/_authenticated/admin_/kpis")({
  head: () => ({
    meta: [{ title: "KPIs | Panel AXHER" }, { name: "robots", content: "noindex" }],
  }),
  component: KpisPage,
});

const ESTADOS = ["recibida", "contactada", "cerrada"] as const;
type Estado = (typeof ESTADOS)[number];
const WEEKS = 12;

/** Lunes de la semana a la que pertenece la fecha (00:00 hora local). */
function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const offset = (d.getDay() + 6) % 7; // lunes = 0
  d.setDate(d.getDate() - offset);
  return d;
}

type WeekRow = { key: string; label: string } & Record<Estado, number>;

function KpisPage() {
  const rolesQuery = useQuery({ queryKey: ["my-roles"], queryFn: () => getMyRoles() });
  const isAdmin = rolesQuery.data?.roles.includes("admin") ?? false;

  const weekFmt = useMemo(
    () =>
      new Intl.DateTimeFormat("es-ES", {
        day: "2-digit",
        month: "short",
        timeZone: "Europe/Madrid",
      }),
    [],
  );

  const historyQuery = useQuery({
    queryKey: ["kpis-history"],
    enabled: isAdmin,
    queryFn: async () => {
      const since = mondayOf(new Date());
      since.setDate(since.getDate() - 7 * (WEEKS - 1));
      const { data, error } = await supabase
        .from("lead_status_history")
        .select("estado, created_at")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });

  const rows: WeekRow[] = useMemo(() => {
    const thisMonday = mondayOf(new Date());
    const map = new Map<string, WeekRow>();
    for (let i = 0; i < WEEKS; i++) {
      const start = new Date(thisMonday);
      start.setDate(start.getDate() - 7 * i);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      map.set(start.toISOString().slice(0, 10), {
        key: start.toISOString().slice(0, 10),
        label: `${weekFmt.format(start)} – ${weekFmt.format(end)}`,
        recibida: 0,
        contactada: 0,
        cerrada: 0,
      });
    }
    for (const h of historyQuery.data ?? []) {
      const key = mondayOf(new Date(h.created_at)).toISOString().slice(0, 10);
      const row = map.get(key);
      if (row && (ESTADOS as readonly string[]).includes(h.estado)) {
        row[h.estado as Estado] += 1;
      }
    }
    return [...map.values()];
  }, [historyQuery.data, weekFmt]);

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, r) => ({
          recibida: acc.recibida + r.recibida,
          contactada: acc.contactada + r.contactada,
          cerrada: acc.cerrada + r.cerrada,
        }),
        { recibida: 0, contactada: 0, cerrada: 0 },
      ),
    [rows],
  );

  const tasaCierre =
    totals.recibida > 0 ? `${((totals.cerrada / totals.recibida) * 100).toFixed(1)}%` : "—";

  const exportCsv = () => {
    const cell = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const header = ["Semana", "Recibidos", "Contactados", "Cerrados"];
    const lines = rows.map((r) =>
      [r.label, String(r.recibida), String(r.contactada), String(r.cerrada)].map(cell).join(","),
    );
    const csv = [header.map(cell).join(","), ...lines].join("\r\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kpis-axher-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              to="/admin"
              className="mb-2 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver a solicitudes
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              KPIs — solicitudes por semana
            </h1>
            <p className="text-sm text-muted-foreground">
              Últimas {WEEKS} semanas. Cada columna cuenta el momento en que la solicitud pasó a ese
              estado.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={exportCsv} className="shrink-0">
            <Download className="size-4" />
            Exportar CSV
          </Button>
        </header>

        {rolesQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Comprobando permisos…</p>
        ) : !isAdmin ? (
          <p className="text-sm text-destructive">No tienes permisos de administrador.</p>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Recibidos", value: totals.recibida },
                { label: "Contactados", value: totals.contactada },
                { label: "Cerrados", value: totals.cerrada },
                { label: "Tasa de cierre", value: tasaCierre },
              ].map((tile) => (
                <div key={tile.label} className="surface-card p-5">
                  <p className="text-sm text-muted-foreground">{tile.label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {historyQuery.isLoading ? "…" : tile.value}
                  </p>
                </div>
              ))}
            </section>

            {historyQuery.isError && (
              <p className="text-sm text-destructive" role="alert">
                No se pudieron cargar los datos.
              </p>
            )}

            <div className="surface-card overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Semana</TableHead>
                    <TableHead className="text-right">Recibidos</TableHead>
                    <TableHead className="text-right">Contactados</TableHead>
                    <TableHead className="text-right">Cerrados</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.key}>
                      <TableCell className="whitespace-nowrap">{r.label}</TableCell>
                      <TableCell className="text-right font-medium">{r.recibida}</TableCell>
                      <TableCell className="text-right">{r.contactada}</TableCell>
                      <TableCell className="text-right">{r.cerrada}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
