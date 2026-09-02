import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export const Route = createFileRoute("/privacidad")({
  head: () => ({
    meta: [
      { title: "Política de Privacidad — AXHER" },
      {
        name: "description",
        content:
          "Información sobre cómo AXHER recoge, usa y protege los datos personales enviados a través del formulario de contacto.",
      },
      { property: "og:title", content: "Política de Privacidad — AXHER" },
      {
        property: "og:description",
        content:
          "Información sobre cómo AXHER recoge, usa y protege los datos personales enviados a través del formulario de contacto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacidad,
});

function Privacidad() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <Link to="/" className="flex min-w-0 items-center">
            <img
              src="/axher-logo-white.png"
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
              <Shield className="size-6 text-primary" aria-hidden="true" />
              <p className="eyebrow">Protección de datos</p>
            </div>
            <h1 className="mt-4 text-4xl leading-tight md:text-5xl">Política de Privacidad</h1>
            <p className="mt-5 text-lg text-muted-foreground">
              En AXHER tratamos tus datos con responsabilidad. Esta página explica qué información
              recogemos a través del formulario de contacto, con qué finalidad y cuáles son tus
              derechos.
            </p>

            <div className="mt-12 space-y-8">
              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Responsable del tratamiento</h2>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Identidad:</strong> AXHER
                  </p>
                  <p>
                    <strong className="text-foreground">Email de contacto:</strong>{" "}
                    <a
                      href="mailto:hola@axher.es"
                      className="text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      hola@axher.es
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">Teléfono:</strong>{" "}
                    <a
                      href="tel:+34604126759"
                      className="text-foreground underline underline-offset-4 hover:text-primary"
                    >
                      +34 604 126 759
                    </a>
                  </p>
                </div>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Datos que recogemos</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  A través del formulario de contacto recogemos únicamente la información necesaria
                  para atender tu solicitud:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Nombre y apellidos</li>
                  <li>Empresa</li>
                  <li>Teléfono</li>
                  <li>
                    Email <em>(opcional)</em>
                  </li>
                  <li>Descripción del proyecto o necesidad</li>
                </ul>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Finalidad y base legal</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Tratamos tus datos para:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Gestionar tu solicitud de auditoría gratuita.</li>
                  <li>Contactarte y resolver tus dudas.</li>
                  <li>Preparar una estimación personalizada de ahorro.</li>
                  <li>Enviarte una confirmación por email si nos lo has indicado.</li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  La base legal del tratamiento es tu consentimiento, que nos das al enviar el
                  formulario. Puedes retirarlo en cualquier momento escribiendo a{" "}
                  <a
                    href="mailto:hola@axher.es"
                    className="text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    hola@axher.es
                  </a>
                  .
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Conservación de los datos</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Conservamos tus datos mientras dure la relación comercial o hasta que nos pidas su
                  supresión. En cualquier caso, no mantenemos la información más tiempo del
                  necesario para cumplir con nuestras obligaciones legales.
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">
                  Destinatarios y transferencias internacionales
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  No vendemos ni cedemos tus datos personales a terceros con fines comerciales. Para
                  prestar el servicio recurrimos a los siguientes encargados del tratamiento:
                </p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>
                    <strong className="text-foreground">
                      Proveedor de alojamiento y base de datos
                    </strong>
                    , donde se guardan de forma segura las solicitudes recibidas.
                  </li>
                  <li>
                    <strong className="text-foreground">Resend</strong> (Resend, Inc., EE. UU.), que
                    usamos únicamente para enviarnos el aviso interno de una nueva solicitud y, si
                    nos lo has indicado, tu confirmación por email.
                  </li>
                </ul>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  El envío de correo a través de Resend supone una transferencia internacional de
                  datos a Estados Unidos, amparada en las cláusulas contractuales tipo aprobadas por
                  la Comisión Europea. Todos los encargados tratan los datos siguiendo nuestras
                  instrucciones y con las garantías que exige el RGPD.
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Tus derechos</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición,
                  limitación del tratamiento y portabilidad escribiendo a{" "}
                  <a
                    href="mailto:hola@axher.es"
                    className="text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    hola@axher.es
                  </a>
                  . También tienes derecho a presentar una reclamación ante la Agencia Española de
                  Protección de Datos (AEPD).
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Seguridad</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Aplicamos medidas técnicas y organizativas para proteger tus datos contra accesos
                  no autorizados, pérdida o alteración. El acceso a la información de contacto está
                  restringido y se gestiona mediante autenticación y control de roles.
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Cookies y tecnologías similares</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Consulta nuestra{" "}
                  <Link
                    to="/cookies"
                    className="text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    Política de Cookies
                  </Link>{" "}
                  para saber cómo usamos cookies y almacenamiento local en este sitio.
                </p>
              </article>

              <article className="surface-card p-6 md:p-8">
                <h2 className="text-xl md:text-2xl">Cambios en esta política</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Podemos actualizar esta política para reflejar cambios normativos o en nuestros
                  servicios. La fecha de la última revisión aparece al final de esta página.
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
              src="/axher-logo-white.png"
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
