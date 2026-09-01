import { useRef, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Send, LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const leadSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  empresa: z
    .string()
    .trim()
    .min(2, "La empresa debe tener al menos 2 caracteres")
    .max(150, "El nombre de la empresa es demasiado largo"),
  telefono: z
    .string()
    .trim()
    .min(6, "Introduce un teléfono válido")
    .max(20, "Introduce un teléfono válido")
    .regex(/^[+0-9 ().-]+$/, "Introduce un teléfono válido"),
  email: z
    .string()
    .trim()
    .max(255, "El email es demasiado largo")
    .email("Introduce un email válido (ejemplo: nombre@empresa.es)")
    .optional()
    .or(z.literal("")),
  descripcion: z
    .string()
    .trim()
    .min(10, "Cuéntanos un poco más sobre el proyecto (mínimo 10 caracteres)")
    .max(2000, "La descripción es demasiado larga"),
});

type LeadForm = z.infer<typeof leadSchema>;

const emptyForm: LeadForm = { nombre: "", empresa: "", telefono: "", email: "", descripcion: "" };

export function ContactForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});
  const [sending, setSending] = useState(false);

  // Anti-spam: campo trampa invisible y momento en que se montó el formulario.
  const [honeypot, setHoneypot] = useState("");
  const mountedAt = useRef(Date.now());

  const update =
    (field: keyof LeadForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((err) => ({ ...err, [field]: undefined }));
    };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Bots: rellenan el campo trampa o envían el formulario casi al instante.
    // Simulamos éxito sin guardar nada para no darles pistas.
    const looksLikeBot = honeypot.trim() !== "" || Date.now() - mountedAt.current < 1500;
    if (looksLikeBot) {
      navigate({ to: "/gracias", search: { nombre: form.nombre, empresa: form.empresa } });
      return;
    }

    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof LeadForm, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0] as keyof LeadForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setSending(true);
    const { email, ...rest } = parsed.data;
    const { error } = await supabase.from("leads").insert({ ...rest, email: email ? email : null });

    setSending(false);
    if (error) {
      toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo o llámanos.");
      return;
    }

    trackEvent("form_submit");
    // El aviso por email al equipo lo dispara un trigger en la base de datos
    // (ver supabase/migrations/…_email_por_trigger.sql).

    setForm(emptyForm);
    setErrors({});
    navigate({
      to: "/gracias",
      search: { nombre: parsed.data.nombre, empresa: parsed.data.empresa },
    });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="surface-card mx-auto mt-10 max-w-xl space-y-5 p-6 text-left md:p-8"
    >
      {/* Campo trampa anti-spam: invisible y fuera del tabulador para personas. */}
      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="empresa_web">No rellenar</label>
        <input
          id="empresa_web"
          name="empresa_web"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={form.nombre}
            onChange={update("nombre")}
            aria-invalid={!!errors.nombre}
            aria-describedby={errors.nombre ? "nombre-error" : undefined}
            placeholder="Tu nombre y apellidos"
            autoComplete="name"
            maxLength={100}
          />
          {errors.nombre && (
            <p id="nombre-error" role="alert" className="text-xs text-destructive">
              {errors.nombre}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            value={form.empresa}
            onChange={update("empresa")}
            aria-invalid={!!errors.empresa}
            aria-describedby={errors.empresa ? "empresa-error" : undefined}
            placeholder="Reformas García S.L."
            autoComplete="organization"
            maxLength={150}
          />
          {errors.empresa && (
            <p id="empresa-error" role="alert" className="text-xs text-destructive">
              {errors.empresa}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          type="tel"
          value={form.telefono}
          onChange={update("telefono")}
          aria-invalid={!!errors.telefono}
          aria-describedby={errors.telefono ? "telefono-error" : undefined}
          placeholder="600 123 456"
          autoComplete="tel"
          maxLength={20}
        />
        {errors.telefono && (
          <p id="telefono-error" role="alert" className="text-xs text-destructive">
            {errors.telefono}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          inputMode="email"
          value={form.email ?? ""}
          onChange={update("email")}
          placeholder="nombre@empresa.es"
          autoComplete="email"
          maxLength={255}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-xs text-destructive">
            {errors.email}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Si nos dejas tu email, te enviamos confirmación de la solicitud.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción del proyecto</Label>
        <Textarea
          id="descripcion"
          value={form.descripcion}
          onChange={update("descripcion")}
          aria-invalid={!!errors.descripcion}
          aria-describedby={errors.descripcion ? "descripcion-error" : undefined}
          placeholder="Qué procesos os quitan más tiempo: presupuestos, seguimiento de obra, atención a clientes…"
          rows={4}
          maxLength={2000}
        />
        {errors.descripcion && (
          <p id="descripcion-error" role="alert" className="text-xs text-destructive">
            {errors.descripcion}
          </p>
        )}
      </div>
      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={sending}>
        {sending ? <LoaderCircle className="animate-spin" /> : <Send />}
        {sending ? "Enviando…" : "Solicitar auditoría gratuita"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Al enviar aceptas nuestra{" "}
        <Link to="/privacidad" className="underline underline-offset-2 hover:text-foreground">
          política de privacidad
        </Link>
        .
      </p>
    </form>
  );
}
