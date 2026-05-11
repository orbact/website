import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { ArrowUpRight, Terminal, Cpu, Layers, Activity, LucideIcon, Code2, Globe, Database, Server, Filter } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import useScrollReveal from '../hooks/useScrollReveal';

// --- Unified 3D Visualization Component for Cards ---

interface UnifiedVisualProps {
  color: string;
  icon: LucideIcon;
}

const UnifiedServiceVisual: React.FC<UnifiedVisualProps> = ({ color, icon: Icon }) => {
  const colorClass = color.replace('text-', 'bg-');
  const borderClass = color.replace('text-', 'border-');

  return (
    <div className="relative w-48 h-48 flex items-center justify-center preserve-3d group-hover:scale-110 transition-transform duration-500">
      {/* 3D Tilted Perspective Layer */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'rotateX(60deg) rotateZ(45deg)', transformStyle: 'preserve-3d' }}>

        {/* Base Glow */}
        <div className={`absolute w-32 h-32 rounded-full ${colorClass} opacity-10 blur-2xl translate-z-[-20px]`} />

        {/* Outer Rotating Ring (Dashed) */}
        <div className={`absolute w-40 h-40 border-2 border-dashed ${borderClass} rounded-full opacity-30 animate-[spin_12s_linear_infinite]`} />

        {/* Middle Ring (Solid with gaps) */}
        <div className={`absolute w-28 h-28 border border-${borderClass} rounded-full opacity-40 animate-[spin_16s_linear_infinite_reverse] border-t-transparent border-l-transparent`} />

        {/* Core Geometric Shape */}
        <div className={`absolute w-20 h-20 ${colorClass} rounded-xl opacity-10 border border-${borderClass} animate-pulse shadow-[0_0_15px_rgba(0,0,0,0.2)]`} />

        {/* Floating Particles */}
        <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 ${colorClass} rounded-full shadow-[0_0_10px_currentColor]`} />
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 ${colorClass} rounded-full shadow-[0_0_10px_currentColor]`} />
        </div>
      </div>

      {/* Central Floating Icon (Always facing user) */}
      <div className="relative z-10 animate-float">
        <div className={`p-4 rounded-2xl bg-bg-page/50 backdrop-blur-md border border-${borderClass} shadow-xl`}>
          <Icon size={32} className={`${color} drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
        </div>
      </div>
    </div>
  );
};

// --- New Hero 3D Component: ServiceCore ---

const ServiceCore: React.FC = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center" style={{ perspective: '1000px' }}>
      {/* Outer Orbit */}
      <div className="absolute inset-0 border border-accent-primary/20 rounded-full animate-[spin_20s_linear_infinite]" />
      <div className="absolute inset-0 border-t border-accent-primary/60 rounded-full animate-[spin_20s_linear_infinite]" />

      {/* Middle Orbit Tilted */}
      <div className="absolute w-[80%] h-[80%] border border-accent-secondary/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"
        style={{ transform: 'rotateX(60deg)' }} />
      <div className="absolute w-[80%] h-[80%] border-l border-accent-secondary/60 rounded-full animate-[spin_15s_linear_infinite_reverse]"
        style={{ transform: 'rotateX(60deg)' }} />

      {/* Floating Icons Ring */}
      <div className="absolute w-[65%] h-[65%] animate-[spin_25s_linear_infinite]">
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 p-3 bg-bg-card border border-border-subtle rounded-xl shadow-lg backdrop-blur-sm animate-[spin_25s_linear_infinite_reverse]">
          <Code2 size={20} className="text-accent-primary" />
        </div>
        <div className="absolute top-1/2 -right-5 -translate-y-1/2 p-3 bg-bg-card border border-border-subtle rounded-xl shadow-lg backdrop-blur-sm animate-[spin_25s_linear_infinite_reverse]">
          <Database size={20} className="text-accent-secondary" />
        </div>
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 p-3 bg-bg-card border border-border-subtle rounded-xl shadow-lg backdrop-blur-sm animate-[spin_25s_linear_infinite_reverse]">
          <Globe size={20} className="text-purple-400" />
        </div>
        <div className="absolute top-1/2 -left-5 -translate-y-1/2 p-3 bg-bg-card border border-border-subtle rounded-xl shadow-lg backdrop-blur-sm animate-[spin_25s_linear_infinite_reverse]">
          <Server size={20} className="text-pink-400" />
        </div>
      </div>

      {/* Central Core */}
      <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-bg-surface to-bg-card border border-border-subtle rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(124,231,208,0.2)] animate-float">
        <Layers size={40} className="text-text-main drop-shadow-lg" />
        {/* Inner pulse */}
        <div className="absolute inset-0 bg-accent-primary/10 rounded-3xl animate-pulse" />
      </div>

      {/* Glow */}
      <div className="absolute inset-0 bg-accent-primary/5 blur-3xl rounded-full -z-10" />
    </div>
  );
};

// --- Page Component ---

const Solutions: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Data State
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = ['All', 'Engineering', 'Design', 'Strategy', 'Data'];

  useEffect(() => {
    async function fetchServices() {
      const data = await serviceService.getAllServices();

      // If no data in DB (initial load), fallback to static constants for demo purposes
      if (data.length === 0) {
        setServices(SERVICES); // Fallback to avoid empty page
      } else {
        setServices(data);
      }
      setLoading(false);
    }
    fetchServices();
  }, []);

  const getServiceMeta = (id: string) => {
    // Basic category mapping logic - can be improved by adding 'category' to DB schema
    if (['ai-engineering', 'web-app-dev', 'agents-workflows', 'robotics'].includes(id)) return { cat: 'Engineering' };
    if (['ui-ux-design', 'graphics-design', 'video-editing'].includes(id)) return { cat: 'Design' };
    if (['digital-marketing'].includes(id)) return { cat: 'Strategy' };
    return { cat: 'Data' }; // Default fallback
  };

  const filteredServices = activeCategory === 'All'
    ? services
    : services.filter(s => getServiceMeta(s.id).cat === activeCategory);

  const addToRefs = useScrollReveal([filteredServices, loading]);

  return (
    <div className="min-h-screen pb-20 relative overflow-x-hidden bg-bg-page selection:bg-accent-primary selection:text-black">
      <SEO
        title="Solutions | Orbact"
        description="Explore our suite of AI engineering services: Custom LLMs, Autonomous Agents, and Scalable Web Architecture."
      />

      {/* Ambient Background & Grid - Matched to Works page */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 animate-grid-flow-lg" />
      </div>

      {/* Expanded Hero Section - Standardized Layout */}
      <section className="relative z-10 min-h-[60vh] flex pt-36 md:pt-48 pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text Content */}
            <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-bold uppercase tracking-widest text-accent-primary mb-6">
                <Terminal size={12} />
                <span>System Capabilities_v2</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-main leading-[1.1] mb-6">
                Architecting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-white to-accent-secondary animate-shine bg-[length:200%_auto]">Intelligence.</span>
              </h1>

              <p className="text-lg text-muted max-w-lg leading-relaxed border-l-2 border-border-subtle pl-6 mb-8">
                We combine creative artistry with engineering precision. Explore our service modules designed to scale your business into the future.
              </p>

              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-text-main">150+</span>
                  <span className="text-xs text-muted uppercase tracking-wider">Modules Deployed</span>
                </div>
                <div className="w-px h-10 bg-border-subtle"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-bold text-text-main">99.9%</span>
                  <span className="text-xs text-muted uppercase tracking-wider">System Uptime</span>
                </div>
              </div>
            </div>

            {/* 3D Element */}
            <div ref={addToRefs} className="flex justify-center lg:justify-end opacity-0 scale-90 transition-all duration-1000 ease-out delay-200">
              <ServiceCore />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar - Optimized for Mobile */}
      <div className="sticky top-24 z-40 mb-20 pointer-events-none">
        <div className="container mx-auto px-2 md:px-6 flex justify-center">
          <div className="pointer-events-auto bg-bg-page/70 backdrop-blur-xl border border-border-subtle p-1.5 rounded-2xl md:rounded-full shadow-2xl flex items-center gap-1 overflow-x-auto w-full md:w-auto max-w-full no-scrollbar">
            <div className="px-4 text-muted hidden md:block">
              <Filter size={16} />
            </div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 md:px-5 md:py-2.5 rounded-xl md:rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                  ? 'bg-text-main text-bg-page shadow-lg'
                  : 'text-muted hover:text-text-main hover:bg-bg-surface'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-32">
          {filteredServices.map((service, index) => {
            const meta = getServiceMeta(service.id);
            const isHovered = hoveredCard === service.id;

            return (
              <div
                key={service.id}
                ref={addToRefs}
                className="opacity-0 translate-y-20 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${index * 50}ms` }}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => navigate(`/solutions/${service.id}`)}
              >
                <TiltCard className={`h-full min-h-[420px] flex flex-col relative rounded-[2rem] bg-bg-card border transition-all duration-500 group cursor-pointer overflow-hidden ${isHovered ? 'border-accent-primary/40 shadow-2xl' : 'border-border-subtle hover:border-border-strong'
                  }`}>

                  {/* Card Background Glow */}
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${service.color.replace('text-', 'from-')}/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                  <div className="p-8 flex flex-col h-full relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-bg-subtle text-[10px] font-mono uppercase tracking-widest text-muted border border-transparent group-hover:border-border-subtle transition-colors">
                        {meta.cat}
                      </div>
                      <ArrowUpRight size={18} className="text-border-strong group-hover:text-accent-primary transition-colors" />
                    </div>

                    {/* Unified 3D Visual Centerpiece */}
                    <div className="flex-grow flex items-center justify-center py-2 perspective-[800px]">
                      <UnifiedServiceVisual color={service.color} icon={service.icon} />
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 space-y-3">
                      <h3 className="text-2xl font-bold text-text-main group-hover:text-accent-primary transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed line-clamp-2 group-hover:text-text-muted/80">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div ref={addToRefs} className="mb-20 opacity-0 translate-y-20 transition-all duration-1000 ease-out">
          <div className="rounded-[2rem] md:rounded-[3rem] bg-bg-surface border border-border-subtle p-12 md:p-16 relative overflow-hidden text-center group">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,var(--spotlight-color)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-shine pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-50" />

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-main">
              Unsure which module fits?
            </h2>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/contact')} icon>Consult an Architect</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Solutions;