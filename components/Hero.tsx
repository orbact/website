import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { Code2, Cpu, Zap, Terminal, Activity } from 'lucide-react';
import { contentService, PageSection } from '../services/contentService';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [typedText, setTypedText] = useState('');
  const [content, setContent] = useState<PageSection | null>(null);
  const fullText = "> Initializing neural networks...\n> Loading agent modules...\n> System ready.";

  // Typewriter effect for terminal
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    contentService.getSection('home', 'hero').then(setContent);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const { width, height, left, top } = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    // Calculate rotation based on mouse position
    // Max rotation: 15 degrees
    const rotateY = ((mouseX / width) - 0.5) * 30;
    const rotateX = ((mouseY / height) - 0.5) * -30;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <section
      className="relative min-h-[60vh] flex pt-36 md:pt-48 pb-12 overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Soft Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--bg-page)_100%)] z-0 pointer-events-none" />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--grid-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none z-0 animate-grid-flow" />

      {/* Ambient Glows - Softer opacity */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent-secondary/5 rounded-full blur-[120px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[100px] animate-pulse-slow pointer-events-none" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* Text Content */}
          <div className="animate-fade-in-up max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-bold uppercase tracking-widest text-accent-primary mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
              </span>
              <span>{content?.eyebrow || 'AI-First Engineering'}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] text-text-main mb-6">
              {content?.headline || 'We Build'} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-main via-accent-primary to-accent-secondary animate-shine bg-[length:200%_auto]">{content?.subheadline || 'AI That Ships.'}</span>
            </h1>

            <p className="text-lg md:text-xl text-muted max-w-lg leading-relaxed border-l-2 border-border-subtle pl-6 mb-8">
              Custom AI agents, Automations, and full-stack products — designed, built, and deployed by a team that actually understands your business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 mb-8">
              <Button onClick={() => navigate(content?.cta_href || '/contact')} icon className="shadow-lg shadow-accent-primary/20 w-full sm:w-auto">{content?.cta_label || 'Start Building'}</Button>
              <Button variant="outline" onClick={() => navigate(content?.secondary_cta_href || '/solutions')} className="w-full sm:w-auto">{content?.secondary_cta_label || 'Our Services'}</Button>
            </div>

            <div className="flex flex-wrap items-center gap-8 md:gap-12 border-t border-border-subtle/50 pt-8">
              <div className="group cursor-default">
                <p className="text-2xl md:text-3xl font-bold text-text-main group-hover:text-accent-primary transition-colors">50+</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Projects Shipped</p>
              </div>
              <div className="group cursor-default">
                <p className="text-2xl md:text-3xl font-bold text-text-main group-hover:text-accent-secondary transition-colors">3x</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Faster to Market</p>
              </div>
              <div className="group cursor-default">
                <p className="text-2xl md:text-3xl font-bold text-text-main group-hover:text-accent-primary transition-colors">24/7</p>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Support</p>
              </div>
            </div>
          </div>

          {/* 3D Visual Dashboard */}
          <div className="relative hidden lg:flex items-center justify-center perspective-[1200px] h-[600px]">
            <div
              className="relative w-[500px] h-[540px] transition-transform duration-100 ease-out preserve-3d"
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Back Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-[40px] blur-3xl opacity-40 translate-z-[-50px]" />

              {/* Main Glass Card - Force Dark Theme for Terminal Look */}
              <div className="absolute inset-0 bg-[#0f172a]/95 rounded-[32px] border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-white"
                style={{ transform: 'translateZ(0px)' }}>

                {/* Header */}
                <div className="h-14 border-b border-white/10 flex items-center justify-center px-6 bg-white/5 relative">
                  <div className="absolute left-6 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="text-xs font-mono text-gray-400 flex items-center gap-2">
                    <Terminal size={12} /> orbact_cli — agent_v2
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 p-8 font-mono text-sm relative">
                  <div className="text-accent-primary mb-4 whitespace-pre-wrap leading-relaxed opacity-80">
                    {typedText}<span className="animate-pulse">_</span>
                  </div>

                  {/* Progress Bars */}
                  <div className="space-y-4 mt-8">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Agent Pipeline</span>
                        <span>92%</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-secondary w-[92%] animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Deployment</span>
                        <span className="text-green-400">Live</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-full" />
                      </div>
                    </div>
                  </div>

                  {/* Code Snippet */}
                  <div className="mt-8 p-4 rounded-lg bg-black/40 border border-white/10 text-xs text-gray-400">
                    <p><span className="text-purple-400">const</span> agent = <span className="text-blue-400">new</span> Agent({'{'}</p>
                    <p className="pl-4">model: <span className="text-green-400">'gemini-2.5-pro'</span>,</p>
                    <p className="pl-4">tools: [<span className="text-orange-400">webSearch</span>, <span className="text-orange-400">codeGen</span>],</p>
                    <p className="pl-4">memory: <span className="text-blue-400">true</span></p>
                    <p>{'}'});</p>
                    <p className="mt-2 text-gray-500">// Your custom AI, production-ready</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              {/* Top Right Widget */}
              <div className="absolute -right-12 top-20 bg-bg-card p-4 rounded-2xl border border-border-subtle shadow-xl flex items-center gap-3 animate-float"
                style={{ transform: 'translateZ(60px)', animationDelay: '0s' }}>
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted">System Load</p>
                  <p className="text-sm font-bold text-text-main">24%</p>
                </div>
              </div>

              {/* Bottom Left Widget */}
              <div className="absolute -left-8 bottom-32 bg-bg-card p-4 rounded-2xl border border-border-subtle shadow-xl flex items-center gap-3 animate-float"
                style={{ transform: 'translateZ(40px)', animationDelay: '1.5s' }}>
                <div className="w-10 h-10 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted">Tokens/sec</p>
                  <p className="text-sm font-bold text-text-main">4,200</p>
                </div>
              </div>

              {/* Floating Icons */}
              <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-bg-surface rounded-2xl border border-border-subtle shadow-lg flex items-center justify-center text-accent-secondary animate-bounce"
                style={{ transform: 'translateZ(80px)', animationDuration: '3s' }}>
                <Code2 size={24} />
              </div>

              <div className="absolute bottom-10 -right-4 w-12 h-12 bg-bg-surface rounded-xl border border-border-subtle shadow-lg flex items-center justify-center text-accent-primary animate-pulse"
                style={{ transform: 'translateZ(30px)' }}>
                <Cpu size={20} />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
