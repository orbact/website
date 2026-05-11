import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !email || !message) {
      return json({ error: "Name, email, and message are required." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Supabase service role is not configured.");

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const payload = {
      name,
      email,
      company: body.company || null,
      budget: body.budget || null,
      message,
      source: body.source || "Orbact Website",
      metadata: { submittedAt: body.submittedAt || new Date().toISOString() },
    };

    const { error } = await admin.from("contact_submissions").insert(payload);
    if (error) throw error;

    const webhookUrl = Deno.env.get("CONTACT_WEBHOOK_URL");
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((error) => console.error("Webhook delivery failed", error));
    }

    return json({ ok: true });
  } catch (error) {
    console.error("Contact function error", error);
    return json({ error: error.message || "Internal server error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
