import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Sparkles, Bot } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm Alex from Orbact. How can I assist with your project today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // ✅ SECURE: Call Edge Function instead of direct API
      // API key stays server-side, never exposed to client
      const { chatService } = await import('../services/chatService');
      const reply = await chatService.sendMessage(userMessage, messages);

      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Sorry, I'm having trouble connecting right now. Please try again or contact us directly."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100] p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center ${isOpen ? 'bg-bg-card border border-border-subtle text-text-muted rotate-90' : 'bg-accent-primary text-black'}`}
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 md:bottom-24 right-4 left-4 md:left-auto md:right-8 z-[100] md:w-[400px] bg-bg-card/90 backdrop-blur-xl border border-border-subtle rounded-3xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
          }`}
        style={{ maxHeight: 'min(600px, 80vh)' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border-subtle bg-bg-surface/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-main">Orbact AI</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-muted">Alex • Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                  ? 'bg-accent-primary text-black rounded-tr-sm'
                  : 'bg-bg-subtle border border-border-subtle text-text-main rounded-tl-sm'
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-bg-subtle border border-border-subtle p-3 rounded-2xl rounded-tl-sm flex items-center gap-2 text-muted text-sm">
                <Sparkles size={14} className="animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 border-t border-border-subtle bg-bg-surface/30">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              className="w-full bg-bg-page border border-border-subtle rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-accent-primary transition-colors text-text-main placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-1 top-1 p-2 rounded-full bg-accent-primary text-black hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <div className="text-center mt-2">
            <span className="text-[10px] text-muted flex items-center justify-center gap-1">
              Orbact AI <Sparkles size={8} />
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chatbot;