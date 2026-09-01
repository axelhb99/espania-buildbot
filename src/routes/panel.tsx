import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Inbox, BarChart3, ShieldCheck } from "lucide-react";
import logoWhite from "@/assets/axher-logo-white.png.asset.json";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/panel")({
  head: () => ({
    meta: [
      { title: "Panel de AXHER" },
      {
        name: "description",
        content:
          "Acceso al área privada de AXHER: gestión de solicitudes recibidas y métricas de conversión de la web.",
      },
      { property: "og:title", content: "Panel de AXHER" },
      {
        property: "og:description",
        content:
          "Acceso al área privada de AXHER: gestión de solicitudes recibidas y métricas de conversión de la web.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Panel,
});

const areas = [
  {
    icon: Inbox,
    title: "Solicitudes",
    text: "Todos los leads enviados desde el formulario, con filtros por empresa y fecha y aviso por email al recibirlos.",
  },
  {
    icon: BarChart3,
    title: "Conversión de la landing",
    text: "Visitas a la landing, formularios enviados, llegadas a /gracias y tasa de conversión en el rango de fechas que elijas.",
  },
];

function Panel() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/" className="flex min-w-0 items-center">
            <img
              src={logoWhite.url}
              alt="Logotipo de AXHER, agencia de automatización con IA"
              className="h-8 w-auto"
            />
          </Link>
          <Button variant="outlineLight" size="sm" asChild className="shrink-0">
            <Link to="/">Volver a la web</Link>
          </Button>
        </div>
      </header>

      <main>
        <section className="section-base">
          <div className="mx-auto max-w-4xl px-5 py-20 md:py-28">
            <p className="eyebrow">Área privada</p>
            <h1 className="mt-4 text-4xl leading-tight md:text-5xl">Panel de AXHER</h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Desde aquí se gestionan las solicitudes que llegan por la web y se consulta cómo
              está convirtiendo la landing.
            </p>

            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/admin">
                  Entrar al panel <ArrowRight />
                </Link>
              </Button>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
                Acceso solo para administradores. Si no has iniciado sesión, se te pedirá el acceso.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
              {areas.map(({ icon: Icon, title, text }) => (
                <article key={title} className="surface-card card-lift flex h-full flex-col p-7 md:p-8">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h2 className="mt-6 text-lg">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 md:flex-row">
          <Link to="/">
            <img
              src={logoWhite.url}
              alt="Logotipo de AXHER en blanco sobre fondo oscuro"
              className="h-7 w-auto"
            />
          </Link>
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-sm text-muted-foreground">
              Automatización con IA para reformas y construcción · España
            </span>
            <nav className="flex items-center gap-3 text-sm text-muted-foreground">
              <Link to="/privacidad" className="transition-colors hover:text-foreground">
                Privacidad
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/cookies" className="transition-colors hover:text-foreground">
                Cookies
              </Link>
              <span aria-hidden="true">·</span>
              <Link to="/panel" className="transition-colors hover:text-foreground">
                Panel
              </Link>
            </nav>
          </div>
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} AXHER</span>
        </div>
      </footer>
    </div>
  );
}
