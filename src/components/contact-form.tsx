import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Send, LoaderCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof LeadForm, string>>>({});
  const [sending, setSending] = useState(false);

  const update = (field: keyof LeadForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    const { error } = await supabase.from("leads").insert(parsed.data);
    setSending(false);
    if (error) {
      toast.error("No se pudo enviar la solicitud. Inténtalo de nuevo o llámanos.");
      return;
    }
    toast.success("Solicitud enviada. Te contactamos en menos de 24 h laborables.");
    setForm(emptyForm);
    setErrors({});
  };

  return (
    <form onSubmit={onSubmit} className="surface-card mx-auto mt-10 max-w-xl space-y-5 p-6 text-left md:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre</Label>
          <Input
            id="nombre"
            value={form.nombre}
            onChange={update("nombre")}
            placeholder="Tu nombre y apellidos"
            autoComplete="name"
            maxLength={100}
          />
          {errors.nombre && <p className="text-xs text-destructive">{errors.nombre}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="empresa">Empresa</Label>
          <Input
            id="empresa"
            value={form.empresa}
            onChange={update("empresa")}
            placeholder="Reformas García S.L."
            autoComplete="organization"
            maxLength={150}
          />
          {errors.empresa && <p className="text-xs text-destructive">{errors.empresa}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="telefono">Teléfono</Label>
        <Input
          id="telefono"
          type="tel"
          value={form.telefono}
          onChange={update("telefono")}
          placeholder="600 123 456"
          autoComplete="tel"
          maxLength={20}
        />
        {errors.telefono && <p className="text-xs text-destructive">{errors.telefono}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción del proyecto</Label>
        <Textarea
          id="descripcion"
          value={form.descripcion}
          onChange={update("descripcion")}
          placeholder="Qué procesos os quitan más tiempo: presupuestos, seguimiento de obra, atención a clientes…"
          rows={4}
          maxLength={2000}
        />
        {errors.descripcion && <p className="text-xs text-destructive">{errors.descripcion}</p>}
      </div>
      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={sending}>
        {sending ? <LoaderCircle className="animate-spin" /> : <Send />}
        {sending ? "Enviando…" : "Solicitar auditoría gratuita"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Al enviar aceptas que tratemos tus datos para responder a tu solicitud.
      </p>
    </form>
  );
}
