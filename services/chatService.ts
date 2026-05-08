import { GoogleGenAI } from '@google/genai';

export interface Message {
    role: 'user' | 'model';
    text: string;
}

export const chatService = {
    /**
     * Send a message to the AI chatbot using Gemini via @google/genai
     */
    async sendMessage(message: string, history: Message[]): Promise<string> {
        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            
            if (!apiKey) {
                console.warn('VITE_GEMINI_API_KEY is not configured in .env.local');
                return "I'm sorry, I am currently disconnected. Please add `VITE_GEMINI_API_KEY` to your `.env.local` file to power me with Gemini!";
            }

            const ai = new GoogleGenAI({ apiKey });

            // Format history for the GenAI SDK
            const formattedHistory = history.map(msg => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }]
            }));

            // Append the new message
            const finalContents = [
                ...formattedHistory,
                { role: 'user', parts: [{ text: message }] }
            ];

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: finalContents,
                config: {
                    systemInstruction: `You are Alex, a Senior Solutions Architect at Orbact. Act like a helpful human team member.
                    
**Core Directives:**
1. **Be Concise:** Responses must be short (1-2 sentences).
2. **Be Helpful:** Guide users to specific pages (Solutions, Works, Pricing, Contact).`
                }
            });

            if (response.text) {
                return response.text;
            } else {
                return 'Sorry, I am having trouble thinking right now.';
            }

        } catch (error: any) {
            console.error('Chat service error:', error);
            throw new Error(error?.message || 'Failed to connect to Gemini');
        }
    },
};
