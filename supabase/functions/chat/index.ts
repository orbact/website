import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("ALLOWED_ORIGIN") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const { message, history = [] } = await req.json();
    if (!message || typeof message !== "string") return json({ error: "Message is required." }, 400);

    const messages = [
      {
        role: "system",
        content: `You are Alex, a senior solutions architect at Orbact. Orbact builds AI engineering, automation, ML, web/app development, UI/UX, digital marketing, SEO, and content systems. Keep replies concise, helpful, and professional. When useful, guide visitors to /solutions, /works, /pricing, or /contact.`,
      },
      ...history.slice(-8).map((item: { role: string; text: string }) => ({
        role: item.role === "model" ? "assistant" : "user",
        content: String(item.text || ""),
      })),
      { role: "user", content: message },
    ];

    const groqKey = Deno.env.get("GROQ_API_KEY");
    if (groqKey) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: Deno.env.get("GROQ_MODEL") || "llama-3.1-8b-instant",
          messages,
          temperature: 0.5,
          max_tokens: 180,
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return json({ reply: data.choices?.[0]?.message?.content || "I can help with that. Tell me a little more about your project." });
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (geminiKey) {
      const prompt = messages.map((item) => `${item.role}: ${item.content}`).join("\n");
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      return json({ reply: data.candidates?.[0]?.content?.parts?.[0]?.text || "I can help with that. Tell me a little more about your project." });
    }

    return json({ reply: "Orbact AI is not connected yet. Please configure GROQ_API_KEY or GEMINI_API_KEY in Supabase secrets." });
  } catch (error) {
    console.error("Chat function error", error);
    return json({ error: error.message || "Internal server error" }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
