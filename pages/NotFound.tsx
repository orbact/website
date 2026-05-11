import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Home, ArrowLeft, Terminal, Zap, Wifi, WifiOff } from 'lucide-react';
import SEO from '../components/SEO';

// Glitch-style 404 3D component
const GlitchCore: React.FC = () => {
  const [glitchPhase, setGlitchPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchPhase(prev => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center perspective-[1000px]">
      {/* Outer glitch rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`absolute w-full h-full border-2 border-dashed rounded-full transition-all duration-500 ${
            glitchPhase === 0 ? 'border-red-500/50 scale-100' : 'border-accent-primary/30 scale-105'
          }`}
          style={{ animationDelay: '0s' }}
        />
        <div 
          className={`absolute w-[85%] h-[85%] border-2 border-dashed rounded-full transition-all duration-500 ${
            glitchPhase === 1 ? 'border-blue-500/50 -translate-x-2' : 'border-accent-secondary/30'
          }`}
        />
        <div 
          className={`absolute w-[70%] h-[70%] border-2 border-dashed rounded-full transition-all duration-500 ${
            glitchPhase === 2 ? 'border-green-500/50 translate-x-2' : 'border-border-subtle'
          }`}
        />
      </div>

      {/* Central error display */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          {/* Glitch layers for 404 */}
          <div className="absolute inset-0 text-7xl md:text-9xl font-black text-red-500/30 animate-pulse" 
               style={{ transform: glitchPhase === 1 ? 'translateX(-4px)' : 'none' }}>
            404
          </div>
          <div className="absolute inset-0 text-7xl md:text-9xl font-black text-blue-500/30" 
               style={{ transform: glitchPhase === 2 ? 'translateX(4px)' : 'none' }}>
            404
          </div>
          <div className="relative text-7xl md:text-9xl font-black text-text-main tracking-tighter">
            404
          </div>
        </div>
        
        {/* Error indicator */}
        <div className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30">
          <WifiOff size={14} className="text-red-400" />
          <span className="text-xs font-mono text-red-400 uppercase tracking-wider">Signal Lost</span>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent-primary rounded-full animate-float opacity-50" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-red-500 rounded-full animate-float opacity-30" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-accent-secondary rounded-full animate-float opacity-40" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 bg-red-500/5 blur-3xl rounded-full -z-10" />
    </div>
  );
};

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [shouldRedirect, setShouldRedirect] = useState(true);

  // Auto-redirect countdown
  useEffect(() => {
    if (!shouldRedirect) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, shouldRedirect]);

  return (
    <div className="min-h-screen bg-bg-page relative overflow-hidden selection:bg-accent-primary selection:text-black">
      <SEO
        title="404 - Page Not Found | Orbact"
        description="The requested resource could not be found. Navigate back to explore our AI engineering solutions."
      />

      {/* Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 animate-grid-flow-lg" />
      </div>

      {/* Main Content */}
      <section className="relative z-10 min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-xs font-bold uppercase tracking-widest text-red-400 mb-6">
                <Terminal size={12} />
                <span>ERROR::ROUTE_NOT_FOUND</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-main leading-[1.1] mb-6">
                Lost in the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-accent-secondary">
                  Void.
                </span>
              </h1>

              <p className="text-lg text-muted max-w-lg leading-relaxed border-l-2 border-red-500/30 pl-6 mb-8 mx-auto lg:mx-0">
                The dimension you're looking for doesn't exist in this reality. 
                Perhaps it was moved, deleted, or never existed at all.
              </p>

              {/* Terminal-style error log */}
              <div className="bg-bg-surface/50 border border-border-subtle rounded-xl p-4 mb-8 max-w-lg mx-auto lg:mx-0 font-mono text-sm">
                <div className="flex items-center gap-2 text-muted mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="ml-2 text-xs">system_log</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-red-400">&gt; Error: ENOENT - Route not found</p>
                  <p className="text-muted">&gt; Attempted path: <span className="text-text-main">{window.location.pathname}</span></p>
                  <p className="text-accent-primary">&gt; Initiating recovery protocol...</p>
                  {shouldRedirect && (
                    <p className="text-yellow-400">&gt; Auto-redirect in {countdown}s <span className="animate-pulse">█</span></p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button onClick={() => navigate('/')} icon>
                  <Home size={16} />
                  Return to Base
                </Button>
                <Button variant="outline" onClick={() => navigate(-1)}>
                  <ArrowLeft size={16} />
                  Go Back
                </Button>
              </div>

              {/* Cancel auto-redirect */}
              {shouldRedirect && (
                <button 
                  onClick={() => setShouldRedirect(false)}
                  className="mt-6 text-xs text-muted hover:text-text-main transition-colors flex items-center gap-2 mx-auto lg:mx-0"
                >
                  <Zap size={12} />
                  Cancel auto-redirect
                </button>
              )}
            </div>

            {/* 3D Visual */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <GlitchCore />
            </div>
          </div>

          {/* Helpful Links */}
          <div className="mt-20 pt-12 border-t border-border-subtle animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-center text-sm text-muted mb-6">Popular destinations:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: 'Solutions', path: '/solutions' },
                { label: 'Works', path: '/works' },
                { label: 'Pricing', path: '/pricing' },
                { label: 'About', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ].map(link => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="px-4 py-2 rounded-full bg-bg-surface/50 border border-border-subtle text-sm text-muted hover:text-text-main hover:border-accent-primary/50 transition-all duration-300"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
