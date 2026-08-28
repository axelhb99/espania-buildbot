import { createFileRoute } from "@tanstack/react-router";
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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

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
    q: "¿Tenemos que cambiar de software?",
    a: "No. Nos integramos con lo que ya usáis: Presto, Excel, Holded, A3, Gmail/Outlook, WhatsApp Business y ERPs del sector. Si algo no tiene integración, la construimos.",
  },
  {
    q: "¿Qué pasa con la protección de datos?",
    a: "Trabajamos con proveedores con servidores en la UE, contrato de encargado de tratamiento y RGPD. Vuestros datos no se usan para entrenar modelos.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Auditoría inicial desde 900 €, deducible si continuáis. Los proyectos de implantación parten de 2.500 € más una cuota mensual de mantenimiento según el número de automatizaciones.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="font-display text-lg font-extrabold tracking-tight">
            AXHER
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
          <Button variant="hero" size="sm" asChild>
            <a href="#contacto">Auditoría gratuita</a>
          </Button>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative isolate overflow-hidden">
          <img
            src={heroObra}
            alt="Jefe de obra revisando el avance de una reforma con una tablet"
            width={1600}
            height={1104}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: "var(--gradient-hero)" }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-5 py-28 md:py-40">
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
            <p className="mt-6 text-sm text-muted-foreground">
              Trabajamos con constructoras, reformistas integrales e instaladores en Madrid,
              Barcelona, Valencia y Bilbao.
            </p>
          </div>
          <div className="hazard-bar h-2 w-full" aria-hidden="true" />
        </section>

        {/* DOLOR */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
            <div>
              <p className="eyebrow">El problema</p>
              <h2 className="mt-4 text-3xl md:text-4xl">
                No perdéis obras por precio. Las perdéis por tiempo de respuesta.
              </h2>
            </div>
            <ul className="space-y-4">
              {[
                "Presupuestos que tardan una semana mientras el cliente ya ha firmado con otro.",
                "Llamadas perdidas porque todo el equipo está a pie de obra.",
                "Albaranes en la guantera de la furgoneta y desviaciones que aparecen al cerrar la obra.",
                "Un administrativo dedicado a copiar datos entre Excel, el ERP y el correo.",
              ].map((t) => (
                <li key={t} className="flex gap-3 border-l-2 border-primary/70 pl-4 text-muted-foreground">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="border-y border-border bg-card/40 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <p className="eyebrow">Servicios</p>
            <h2 className="mt-4 max-w-2xl text-3xl md:text-4xl">
              Automatizaciones diseñadas para el día a día de una obra
            </h2>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {servicios.map(({ icon: Icon, title, text }) => (
                <article key={title} className="surface-card group p-6 transition-colors hover:border-primary/60">
                  <div className="flex size-11 items-center justify-center rounded-md bg-primary/12 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-lg">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* RESULTADOS */}
        <section id="resultados" className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {metricas.map((m) => (
              <div key={m.label} className="border-t-2 border-primary pt-5">
                <p className="font-display text-4xl font-extrabold text-foreground">{m.valor}</p>
                <p className="mt-2 text-sm text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
          <blockquote className="surface-card mt-14 p-8 md:p-10">
            <p className="text-xl leading-relaxed md:text-2xl">
              “Antes cerrábamos tres presupuestos grandes al mes porque no dábamos abasto. Ahora
              salen el mismo día de la visita y el cliente los firma antes de que le llegue la
              competencia.”
            </p>
            <footer className="mt-6 text-sm text-muted-foreground">
              Dirección técnica · Reformas integrales, 24 empleados, Madrid
            </footer>
          </blockquote>
        </section>

        {/* PROCESO */}
        <section id="proceso" className="border-y border-border bg-card/40 py-20">
          <div className="mx-auto max-w-6xl px-5">
            <p className="eyebrow">Cómo trabajamos</p>
            <h2 className="mt-4 text-3xl md:text-4xl">Del caos al sistema en tres fases</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {pasos.map((p) => (
                <div key={p.n} className="surface-card p-7">
                  <span className="font-display text-5xl font-extrabold text-primary/25">{p.n}</span>
                  <h3 className="mt-3 text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-5 py-20">
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
        </section>

        {/* CTA */}
        <section id="contacto" className="border-t border-border bg-card/60 py-20">
          <div className="mx-auto max-w-3xl px-5 text-center">
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
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Button variant="hero" size="xl" asChild>
                <a href="mailto:hola@axher.es?subject=Auditor%C3%ADa%20gratuita">
                  Reservar auditoría <ArrowRight />
                </a>
              </Button>
              <Button variant="outlineLight" size="xl" asChild>
                <a href="tel:+34910000000">Llamar al 910 000 000</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground md:flex-row">
          <span className="font-display font-extrabold text-foreground">AXHER</span>
          <span>Automatización con IA para reformas y construcción · España</span>
          <span>© {new Date().getFullYear()} AXHER</span>
        </div>
      </footer>
    </div>
  );
}
