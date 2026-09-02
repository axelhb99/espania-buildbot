import { useEffect, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { trackEvent } from "@/lib/analytics";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PhoneCall,
  FileText,
  CalendarClock,
  MessageSquareText,
  Receipt,
  HardHat,
  ArrowRight,
  Check,
  Clock3,
  PhoneMissed,
  FileWarning,
  Copy,
  Quote,
  MessageCircle,
} from "lucide-react";
import heroObra from "@/assets/hero-obra.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AXHER | Automatización con IA para reformas y construcción" },
      {
        name: "description",
        content:
          "Agencia de automatización con IA para empresas de reformas y construcción en España: presupuestos automáticos, captación de leads y seguimiento de obra 24/7.",
      },
      { property: "og:title", content: "AXHER | Automatización con IA para reformas" },
      {
        property: "og:description",
        content:
          "Automatizamos presupuestos, llamadas y seguimiento de obra para constructoras y empresas de reformas en España.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://axher.es/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://axher.es/" }],
  }),
  component: Index,
});

const WHATSAPP_URL =
  "https://wa.me/34604126759?text=Hola%2C%20estoy%20en%20la%20web%20de%20AXHER%20y%20quiero%20informaci%C3%B3n%20sobre%20automatizaci%C3%B3n";

const servicios = [
  {
    icon: PhoneCall,
    title: "Recepcionista IA 24/7",
    text: "Atiende llamadas y WhatsApp cuando estáis en obra, cualifica al cliente y agenda la visita técnica directamente en vuestro calendario.",
  },
  {
    icon: FileText,
    title: "Presupuestos automáticos",
    text: "De las notas de la visita a un presupuesto detallado por partidas y con vuestros precios en minutos, no en cinco días.",
  },
  {
    icon: CalendarClock,
    title: "Planificación de obra",
    text: "Cruce automático de equipos, materiales y plazos. Avisos cuando una partida se retrasa y afecta al resto del calendario.",
  },
  {
    icon: MessageSquareText,
    title: "Seguimiento al cliente",
    text: "Informes semanales de avance con fotos generados solos. Menos llamadas de '¿cómo va lo mío?' y clientes más tranquilos.",
  },
  {
    icon: Receipt,
    title: "Facturas y albaranes",
    text: "Lectura automática de albaranes y facturas de proveedor, imputación al coste de cada obra y control de desviaciones.",
  },
  {
    icon: HardHat,
    title: "Documentación y PRL",
    text: "Control de CAE, altas de personal y documentación de subcontratas revisada automáticamente antes de entrar a obra.",
  },
];

const problemas = [
  {
    icon: Clock3,
    text: "Presupuestos que tardan una semana mientras el cliente ya ha firmado con otro.",
  },
  {
    icon: PhoneMissed,
    text: "Llamadas perdidas porque todo el equipo está a pie de obra.",
  },
  {
    icon: FileWarning,
    text: "Albaranes en la guantera de la furgoneta y desviaciones que aparecen al cerrar la obra.",
  },
  {
    icon: Copy,
    text: "Un administrativo dedicado a copiar datos entre Excel, el ERP y el correo.",
  },
];

const pasos = [
  {
    n: "01",
    title: "Auditoría de procesos",
    text: "Dos sesiones con vuestro equipo de oficina técnica y jefes de obra. Salimos con el mapa de horas perdidas y su coste anual.",
  },
  {
    n: "02",
    title: "Piloto en 21 días",
    text: "Implantamos la automatización de mayor impacto y la medimos con datos reales de vuestras obras.",
  },
  {
    n: "03",
    title: "Escalado y soporte",
    text: "Ampliamos al resto de procesos, formamos al equipo y mantenemos los sistemas cada mes.",
  },
];

const metricas = [
  { valor: "72%", label: "menos tiempo por presupuesto" },
  { valor: "3x", label: "más presupuestos enviados al mes" },
  { valor: "21", label: "días hasta el primer piloto" },
  { valor: "100%", label: "llamadas atendidas fuera de horario" },
];

const faqs = [
  {
    q: "¿Sirve para una empresa de 8 personas?",
    a: "Sí. La mayoría de nuestros clientes son constructoras y empresas de reformas de 5 a 60 personas, donde el cuello de botella suele ser una o dos personas en oficina técnica.",
  },
  {
    q: "¿Cuánto tardáis en implantarlo?",
    a: "El primer piloto está funcionando en 21 días desde la auditoría. La implantación completa del resto de procesos suele llevar entre 2 y 4 meses, siempre por fases y con resultados medibles en cada una.",
  },
  {
    q: "¿Qué pasa si ya usamos un ERP o ningún software?",
    a: "Si ya tenéis ERP, nos conectamos a él por API o por los ficheros que ya exportáis, sin tocar vuestros procesos internos. Si trabajáis solo con Excel y WhatsApp, montamos la base mínima necesaria y automatizamos sobre ella: no hace falta comprar un ERP para empezar.",
  },
  {
    q: "¿Tenemos que cambiar de software?",
    a: "No. Nos integramos con lo que ya usáis: Presto, Excel, Holded, A3, Gmail/Outlook, WhatsApp Business y ERPs del sector. Si algo no tiene integración, la construimos.",
  },
  {
    q: "¿Qué pasa con la protección de datos?",
    a: "Trabajamos con proveedores con servidores en la UE, contrato de encargado de tratamiento y RGPD. Vuestros datos no se usan para entrenar modelos.",
  },
];

function Index() {
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("landing_view");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
          <a href="#top" className="flex min-w-0 items-center">
            <img
              src="/axher-logo-white.png"
              alt="Logotipo de AXHER, agencia de automatización con IA"
              className="h-8 w-auto"
            />
          </a>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#servicios" className="transition-colors hover:text-foreground">
              Servicios
            </a>
            <a href="#proceso" className="transition-colors hover:text-foreground">
              Proceso
            </a>
            <a href="#resultados" className="transition-colors hover:text-foreground">
              Resultados
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
          </nav>
          <Button variant="hero" size="sm" asChild className="shrink-0">
            <a href="#contacto">Auditoría gratuita</a>
          </Button>
        </div>
      </header>

      <main id="top" className="pb-20 md:pb-0">
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <picture>
            <source srcSet="/hero-obra.webp" type="image/webp" />
            <img
              src={heroObra}
              alt="Jefe de obra revisando en una tablet el avance de una reforma en España"
              width={1600}
              height={1104}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </picture>
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-hero)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-5 py-24 md:py-40">
            <p className="eyebrow">Automatización con IA · España</p>
            <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] md:text-6xl">
              Vuestro equipo está en la obra.
              <br />
              <span className="text-hero-gradient">La oficina que la gestione sola.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Implantamos agentes de IA y automatizaciones a medida para empresas de reformas y
              construcción: presupuestos, llamadas, seguimiento de obra y control de costes sin
              contratar más administrativos.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" asChild>
                <a href="#contacto">
                  Pedir auditoría gratuita <ArrowRight />
                </a>
              </Button>
              <Button variant="outlineLight" size="xl" asChild>
                <a href="#servicios">Ver qué automatizamos</a>
              </Button>
            </div>
            <p className="mt-5 text-sm font-semibold tracking-wide text-foreground/90">
              Sin permanencia · Piloto en 21 días · Datos alojados en la UE
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Trabajamos con constructoras, reformistas integrales e instaladores en Madrid,
              Barcelona, Valencia y Bilbao.
            </p>
          </div>
          <div className="hazard-bar h-2 w-full" aria-hidden="true" />
        </section>

        {/* DOLOR */}
        <section className="section-base">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-24">
            <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
              <div>
                <p className="eyebrow">El problema</p>
                <h2 className="mt-4 text-3xl md:text-4xl">
                  No perdéis obras por precio. Las perdéis por tiempo de respuesta.
                </h2>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {problemas.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="flex min-w-0 items-start gap-4 rounded-lg border border-border/70 bg-card/50 p-5"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                      {text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="section-alt border-y border-border">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
            <p className="eyebrow">Servicios</p>
            <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
              Automatizaciones diseñadas para el día a día de una obra
            </h2>
            <div className="mt-12 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {servicios.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="surface-card card-lift flex h-full flex-col p-7 md:p-8"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-6 text-lg">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTADOS */}
        <section id="resultados" className="section-base">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {metricas.map((m) => (
                <div key={m.label} className="border-t-2 border-primary pt-5">
                  <p className="font-display text-5xl font-extrabold leading-none tracking-tight text-foreground md:text-6xl">
                    {m.valor}
                  </p>
                  <p className="mt-3 text-sm leading-snug text-muted-foreground">{m.label}</p>
                </div>
              ))}
            </div>

            <blockquote className="surface-card mt-14 p-8 md:p-10">
              <Quote className="size-8 text-primary/40" aria-hidden="true" />
              <p className="mt-4 text-xl leading-relaxed md:text-2xl">
                “Antes cerrábamos tres presupuestos grandes al mes porque no dábamos abasto. Ahora
                salen el mismo día de la visita y el cliente los firma antes de que le llegue la
                competencia.”
              </p>
              <footer className="mt-6 flex items-center gap-4">
                <span
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-primary/15 font-display text-base font-extrabold text-primary"
                  aria-hidden="true"
                >
                  JM
                </span>
                <span className="min-w-0 text-sm text-muted-foreground">
                  <span className="block font-semibold text-foreground">
                    J. M., director técnico
                  </span>
                  Reformas integrales · 24 empleados · Madrid (cliente anónimo por acuerdo de
                  confidencialidad)
                </span>
              </footer>
            </blockquote>

            <div className="mt-12 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button variant="hero" size="xl" asChild className="w-full sm:w-auto">
                <a href="#contacto">
                  Pedir auditoría gratuita <ArrowRight />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                30 minutos · sin compromiso · con estimación de ahorro
              </p>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section id="proceso" className="section-alt border-y border-border">
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
            <p className="eyebrow">Cómo trabajamos</p>
            <h2 className="mt-4 text-3xl md:text-4xl">Del caos al sistema en tres fases</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
              {pasos.map((p) => (
                <div key={p.n} className="surface-card card-lift flex h-full flex-col p-7 md:p-8">
                  <span className="font-display text-5xl font-extrabold text-primary/25">
                    {p.n}
                  </span>
                  <h3 className="mt-3 text-lg">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section-base">
          <div className="mx-auto max-w-3xl px-5 py-20 md:py-28">
            <p className="eyebrow">Preguntas frecuentes</p>
            <h2 className="mt-4 text-3xl md:text-4xl">Lo que suelen preguntarnos</h2>
            <Accordion type="single" collapsible className="mt-8">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left text-base">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section id="contacto" className="section-alt border-t border-border">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-28">
            <h2 className="text-3xl md:text-4xl">
              Auditoría gratuita de <span className="text-hero-gradient">30 minutos</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Revisamos vuestro proceso de captación, presupuestación y seguimiento de obra y os
              decimos qué se puede automatizar esta misma semana. Sin compromiso.
            </p>
            <ul className="mx-auto mt-8 flex max-w-lg flex-col gap-3 text-left text-sm text-muted-foreground">
              {[
                "Diagnóstico de las 3 tareas que más horas os cuestan",
                "Estimación de ahorro anual en euros",
                "Plan de implantación priorizado",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
            <ContactForm />
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <p className="text-sm text-muted-foreground">
                ¿Prefieres hablar?{" "}
                <a
                  href="tel:+34604126759"
                  className="font-semibold text-foreground underline-offset-4 hover:underline"
                >
                  Llámanos al +34 604 126 759
                </a>
              </p>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("whatsapp_click")}
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105"
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* CTA STICKY MÓVIL */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="hero" size="lg" asChild>
            <a href="#contacto">Auditoría gratuita</a>
          </Button>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("whatsapp_click")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] px-4 text-sm font-semibold text-white"
          >
            <MessageCircle className="size-4" />
            WhatsApp
          </a>
        </div>
      </div>

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
