import { createFileRoute, Link } from "@tanstack/react-router";
import logoWhite from "@/assets/axher-logo-white.png.asset.json";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Política de Cookies — AXHER" },
      {
        name: "description",
        content:
          "Información sobre el uso de cookies y tecnologías similares en el sitio web de AXHER.",
      },
      { property: "og:title", content: "Política de Cookies — AXHER" },
      {
        property: "og:description",
        content:
          "Información sobre el uso de cookies y tecnologías similares en el sitio web de AXHER.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cookies,
});

function Cookies() {
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
          <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
            <div className="flex items-center gap-3">
              <Cookie className="size-6 text-primary" aria-hidden="true" />
              <p className="eyebrow">Uso de cookies</p>
            </div>
            <h1 className="mt-4 text-4xl leading-tight md:text-5xl">Política de Cookies</h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Te explicamos qué son las cookies, cuáles utilizamos en este sitio y cómo puedes
              gestionarlas.
            </p>

            <div className="mt-12 space-y-8">
              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">¿Qué son las cookies?</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando
                  visitas una web. También existen tecnologías similares como el almacenamiento
                  local del navegador. Sirven para recordar información útil para la navegación o el
                  funcionamiento del sitio.
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Cookies que utilizamos</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  En axher.es solo utilizamos cookies y almacenamiento local estrictamente
                  necesarios para el funcionamiento del sitio:
                </p>
                <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-muted-foreground">
                  <li>
                    <strong className="text-foreground">Cookies técnicas / de sesión:</strong>{" "}
                    permiten el acceso al panel de administración y mantienen tu sesión de forma
                    segura mientras navegas. Son imprescindibles para el funcionamiento del área
                    privada.
                  </li>
                  <li>
                    <strong className="text-foreground">Almacenamiento local:</strong> guardamos de
                    forma segura el token de autenticación del panel de administración en tu propio
                    navegador. No contiene datos personales de contacto ni de leads.
                  </li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  No utilizamos cookies analíticas, de publicidad, de redes sociales ni de terceros
                  con fines de seguimiento comercial.
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Medición de tráfico</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Contamos de forma agregada cuántas visitas recibe la web, cuántos formularios se
                  envían y cuántos clics reciben los botones de WhatsApp, para saber si la página
                  funciona. Esta medición{" "}
                  <strong className="text-foreground">no usa cookies</strong> ni identificadores
                  persistentes, no rastrea entre sitios y no permite identificar a ninguna persona:
                  solo se guarda el tipo de evento, la página y, si existe, la web de procedencia.
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Cómo gestionar las cookies</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Puedes configurar tu navegador para rechazar cookies o eliminar las ya
                  almacenadas. Ten en cuenta que, si bloqueas las cookies técnicas, es posible que
                  no puedas acceder al panel de administración.
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Protección de datos</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Para conocer cómo tratamos la información personal que nos envías, consulta
                  nuestra{" "}
                  <Link
                    to="/privacidad"
                    className="text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    Política de Privacidad
                  </Link>
                  .
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Más información</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Si tienes dudas sobre el uso de cookies o sobre cómo gestionar tus datos,
                  escríbenos a{" "}
                  <a
                    href="mailto:hola@axher.es"
                    className="text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    hola@axher.es
                  </a>
                  .
                </p>
              </article>
            </div>

            <p className="mt-12 text-center text-xs text-muted-foreground">
              Última revisión: agosto de 2026
            </p>
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
