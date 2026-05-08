// Supabase Edge Function using official Google GenAI SDK
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.11.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { message, history } = await req.json()
        const apiKey = Deno.env.get('GEMINI_API_KEY')

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY not configured in Supabase')
        }

        // Initialize the official SDK
        const genAI = new GoogleGenerativeAI(apiKey);

        // Use the 1.5 Flash model (stable, fast, cheap)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // 1. Safe History Formatting
        // Filter out invalid messages and ensure text is never empty
        const chatHistory = (history || [])
            .filter((msg: any) => msg && msg.text) // Remove empty/null messages
            .map((msg: any) => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text || " " }] // Fallback for safety
            }));

        // 2. Construct Prompt with Context
        // We catch errors per-request to prevent crashing the whole function
        const prompt = `You are Alex, a Senior Solutions Architect at Orbact. Act like a helpful human team member.

**Core Directives:**
1. **Be Concise:** Responses must be short (1-2 sentences).
2. **Be Helpful:** Guide users to specific pages (Solutions, Works, Pricing, Contact).

**User Context:** The user is currently browsing the Orbact website.
    
Chat History:
${chatHistory.map((m: any) => `${m.role}: ${m.parts[0].text}`).join('\n')}

User: ${message}
Model:`;

        // 3. Generate Content with Try/Catch
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        if (!text) throw new Error('Empty response from AI');

        return new Response(
            JSON.stringify({ reply: text }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Edge Function Error:', error)
        return new Response(
            JSON.stringify({
                error: error.message || 'Internal server error',
                details: error.toString()
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
