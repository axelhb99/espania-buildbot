// Edge Function: notify-lead
//
// Envía un email de aviso cada vez que se recibe una solicitud desde el
// formulario de contacto de la web. La invoca contact-form.tsx justo después
// de guardar el lead en la base de datos.
//
// Anti-abuso: descarta las peticiones con el campo trampa relleno y solo
// envía el email si hay una solicitud real reciente con ese teléfono.
//
// Variables de entorno (secrets) que necesita:
//   RESEND_API_KEY          -> clave de API de Resend (https://resend.com)
//   LEAD_NOTIFICATION_TO    -> email que recibe los avisos (por defecto axher2204@gmail.com)
//   LEAD_NOTIFICATION_FROM  -> remitente verificado en Resend
//                              (por defecto "AXHER <onboarding@resend.dev>")

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const esc = (value: unknown) =>
  String(value ?? "").replace(
    /[<>&]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] as string,
  );

type LeadPayload = {
  nombre?: string;
  empresa?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;
  honeypot?: string;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "método no permitido" }, 405);

  let payload: LeadPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "cuerpo JSON no válido" }, 400);
  }

  // Bot: ha rellenado el campo trampa. Fingimos éxito sin hacer nada.
  if (typeof payload.honeypot === "string" && payload.honeypot.trim() !== "") {
    return json({ ok: true });
  }

  const nombre = String(payload.nombre ?? "")
    .trim()
    .slice(0, 100);
  const empresa = String(payload.empresa ?? "")
    .trim()
    .slice(0, 150);
  const telefono = String(payload.telefono ?? "")
    .trim()
    .slice(0, 20);
  const email = String(payload.email ?? "")
    .trim()
    .slice(0, 255);
  const descripcion = String(payload.descripcion ?? "")
    .trim()
    .slice(0, 2000);

  if (!nombre || !empresa || !telefono || !descripcion) {
    return json({ error: "faltan campos obligatorios" }, 400);
  }

  // Este endpoint es público (lo llama el navegador). Para que no pueda usarse
  // como pasarela de correo, solo enviamos si existe una solicitud real con
  // este teléfono guardada en los últimos minutos.
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (SUPABASE_URL && SERVICE_KEY) {
    const since = new Date(Date.now() - 5 * 60_000).toISOString();
    const lookup = await fetch(
      `${SUPABASE_URL}/rest/v1/leads?select=id&telefono=eq.${encodeURIComponent(telefono)}` +
        `&created_at=gte.${encodeURIComponent(since)}&limit=1`,
      { headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` } },
    );
    const rows = await lookup.json().catch(() => null);
    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("notify-lead: sin solicitud asociada, se ignora");
      return json({ error: "sin solicitud asociada" }, 403);
    }
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("LEAD_NOTIFICATION_TO") ?? "axher2204@gmail.com";
  const from = Deno.env.get("LEAD_NOTIFICATION_FROM") ?? "AXHER <onboarding@resend.dev>";

  if (!RESEND_API_KEY) {
    console.error("notify-lead: falta el secret RESEND_API_KEY");
    return json({ error: "servicio de email sin configurar" }, 500);
  }

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1b2333;max-width:560px">
      <h2 style="margin:0 0 4px">Nueva solicitud desde la web</h2>
      <p style="margin:0 0 20px;color:#667085">Formulario de auditoría gratuita &mdash; axher.es</p>
      <table style="border-collapse:collapse;width:100%">
        <tbody>
          <tr><td style="padding:8px 0;color:#667085;width:120px">Nombre</td><td style="padding:8px 0"><strong>${esc(nombre)}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#667085">Empresa</td><td style="padding:8px 0">${esc(empresa)}</td></tr>
          <tr><td style="padding:8px 0;color:#667085">Teléfono</td><td style="padding:8px 0"><a href="tel:${esc(telefono)}">${esc(telefono)}</a></td></tr>
          <tr><td style="padding:8px 0;color:#667085">Email</td><td style="padding:8px 0">${email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : "&mdash;"}</td></tr>
        </tbody>
      </table>
      <p style="margin:20px 0 6px;color:#667085">Descripción del proyecto</p>
      <p style="margin:0;white-space:pre-wrap;background:#f5f7fa;border-radius:8px;padding:14px">${esc(descripcion)}</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      ...(email ? { reply_to: email } : {}),
      subject: `Nueva solicitud web — ${empresa}`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("notify-lead: Resend respondió", res.status, detail);
    return json({ error: "no se pudo enviar el email", status: res.status }, 502);
  }

  return json({ ok: true });
});
