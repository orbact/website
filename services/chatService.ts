import { isSupabaseConfigured, supabase } from '../lib/supabase';

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export const chatService = {
  async sendMessage(message: string, history: Message[]): Promise<string> {
    if (!isSupabaseConfigured) {
      return "I'm currently disconnected. Configure Supabase and deploy the chat Edge Function to enable Orbact AI.";
    }

    const { data, error } = await supabase.functions.invoke('chat', {
      body: { message, history },
    });

    if (error) {
      console.error('Chat function error:', error);
      throw new Error(error.message || 'Failed to connect to Orbact AI');
    }

    return data?.reply || 'Sorry, I am having trouble thinking right now.';
  },
};
