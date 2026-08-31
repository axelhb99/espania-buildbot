import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import logoWhite from "@/assets/axher-logo-white.png.asset.json";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, Phone, Mail, ArrowLeft } from "lucide-react";

const graciasSearch = z.object({
  nombre: z.string().optional(),
  empresa: z.string().optional(),
});

export const Route = createFileRoute("/gracias")({
  validateSearch: graciasSearch,
  head: () => ({
    meta: [
      { title: "Gracias por tu solicitud — AXHER" },
      {
        name: "description",
        content:
          "Hemos recibido tu solicitud de auditoría gratuita. Te contactaremos en menos de 24 horas laborables.",
      },
      { property: "og:title", content: "Gracias por tu solicitud — AXHER" },
      {
        property: "og:description",
        content:
          "Hemos recibido tu solicitud de auditoría gratuita. Te contactaremos en menos de 24 horas laborables.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Gracias,
});

const WHATSAPP_URL =
  "https://wa.me/34604126759?text=Hola%2C%20he%20enviado%20mi%20solicitud%20desde%20la%20web%20de%20AXHER%20y%20me%20gustar%C3%ADa%20seguir%20en%20contacto.";

function Gracias() {
  const { nombre, empresa } = Route.useSearch();

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
          <div className="mx-auto max-w-2xl px-5 py-16 text-center md:py-24">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-primary/12 text-primary">
              <CheckCircle2 className="size-9" aria-hidden="true" />
            </span>
            <p className="eyebrow mt-8">Solicitud recibida</p>
            <h1 className="mt-4 text-4xl leading-tight md:text-5xl">
              ¡Gracias{nombre ? `, ${nombre}` : ""}!
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
              Hemos recibido tu solicitud{empresa ? ` de ${empresa}` : ""} y ya está en
              manos de nuestro equipo.
            </p>

            <div className="mx-auto mt-10 max-w-md space-y-3 text-left">
              {[
                "Revisamos tu caso junto a la información que nos has enviado",
                "Te contactamos en menos de 24 h laborables",
                "Preparamos una estimación de ahorro para tu empresa",
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-start gap-3 rounded-lg border border-border/70 bg-card/50 p-4 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  {t}
                </div>
              ))}
            </div>

            <div className="surface-card mx-auto mt-12 p-8 text-left md:p-10">
              <h2 className="text-xl md:text-2xl">¿Prefieres adelantar algo o hablar ya?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Escríbenos por WhatsApp, llámanos o mándanos un correo: te respondemos rápido.
              </p>
              <div className="mt-6 grid gap-3">
                <Button variant="hero" size="lg" asChild className="w-full">
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" aria-hidden="true" />
                    Seguir en contacto por WhatsApp
                  </a>
                </Button>
                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href="tel:+34604126759"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    <Phone className="size-4" aria-hidden="true" />
                    +34 604 126 759
                  </a>
                  <a
                    href="mailto:hola@axher.es"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
                  >
                    <Mail className="size-4" aria-hidden="true" />
                    hola@axher.es
                  </a>
                </div>
              </div>
            </div>

            <Link
              to="/"
              className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver a la página principal
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground md:flex-row">
          <img
            src={logoWhite.url}
            alt="Logotipo de AXHER en blanco sobre fondo oscuro"
            className="h-7 w-auto"
          />
          <span>Automatización con IA para reformas y construcción · España</span>
          <span>© {new Date().getFullYear()} AXHER</span>
        </div>
      </footer>
    </div>
  );
}