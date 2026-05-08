uimport React, { useState } from 'react';
import Button from '../components/Button';
import TiltCard from '../components/TiltCard';
import { Mail, MapPin, Phone, CheckCircle, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';
import useScrollReveal from '../hooks/useScrollReveal';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const addToRefs = useScrollReveal([]);

  // Focus state for form groups
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || "https://hook.us2.make.com/df8fjzr5o5gxlz8md6abez9x994edxm4";

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString(),
          source: 'Orbact Website'
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', budget: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(`Submission failed (${response.status}). Please try again or email us directly.`);
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection or email us at hello@orbact.com.');
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: 'hello@orbact.com',
      action: 'mailto:hello@orbact.com',
      color: 'text-accent-primary',
      desc: 'Typical response < 2h'
    },
    {
      icon: MapPin,
      label: 'HQ',
      value: 'San Francisco, CA',
      action: 'https://maps.google.com',
      color: 'text-accent-secondary',
      desc: '123 Market St, Floor 4'
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 000-0000',
      action: 'tel:+15550000000',
      color: 'text-purple-400',
      desc: 'Mon-Fri, 9am-6pm PST'
    }
  ];

  return (
    <div className="min-h-screen bg-bg-page selection:bg-accent-primary selection:text-black overflow-x-hidden">

      {/* Standardized Ambient Background & Grid */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 animate-grid-flow-lg" />
      </div>

      {/* Main Section */}
      <section className="relative z-10 pt-36 md:pt-48 pb-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left Column: Content & Info */}
            <div className="flex flex-col gap-12 relative">

              <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-bold uppercase tracking-widest text-accent-primary mb-6 shadow-lg shadow-accent-primary/10 backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
                  </span>
                  Signal Status: Online
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-text-main leading-tight tracking-tight">
                  Initiate <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-white to-accent-secondary animate-shine bg-[length:200%_auto]">Protocol.</span>
                </h1>
                <p className="text-lg text-muted leading-relaxed border-l-2 border-border-subtle pl-6">
                  Establish a secure uplink with our architects. Whether it's a new venture or a system overhaul, we are ready to deploy.
                </p>
              </div>

              {/* Contact List */}
              <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out delay-100 flex flex-col gap-4">
                {contactMethods.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-5 p-4 rounded-2xl bg-bg-card/30 border border-border-subtle hover:border-accent-primary/30 hover:bg-bg-surface transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ${item.color} shadow-lg`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted font-bold uppercase tracking-wider mb-0.5 flex items-center gap-2">
                        {item.label}
                      </p>
                      <p className="text-base font-bold text-text-main group-hover:text-white transition-colors">{item.value}</p>
                      <p className="text-xs text-muted/60 mt-1">{item.desc}</p>
                    </div>
                    <ArrowRight className="ml-auto w-4 h-4 text-border-strong group-hover:text-accent-primary -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="relative w-full">
              <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out delay-300 h-full">
                <TiltCard className="h-full bg-bg-card/50 backdrop-blur-xl border border-border-subtle rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-2xl relative overflow-hidden group/form">

                  {/* Glowing Mesh Gradient behind form */}
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-accent-primary/5 via-accent-secondary/5 to-transparent blur-[100px] pointer-events-none -z-10" />

                  {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 animate-fade-in-up border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      </div>
                      <h3 className="text-3xl font-bold mb-4 text-text-main animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Transmission Received</h3>
                      <p className="text-muted text-lg mb-10 animate-fade-in-up max-w-xs mx-auto leading-relaxed" style={{ animationDelay: '0.2s' }}>
                        We've sent a confirmation to <span className="text-text-main font-semibold">{formData.email}</span>. Our architects will decode your request shortly.
                      </p>
                      <Button onClick={() => setStatus('idle')} variant="outline" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Send Another Signal
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                      <div>
                        <h3 className="text-2xl font-bold text-text-main mb-2">Project Brief</h3>
                        <p className="text-sm text-muted">Please fill in the details below. All fields are secured.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 group">
                          <label className={`text-xs font-bold uppercase tracking-wider pl-1 transition-colors ${focusedField === 'name' ? 'text-accent-primary' : 'text-muted'}`}>Name</label>
                          <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-bg-surface/50 border border-border-subtle text-text-main rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 focus:bg-bg-surface transition-all placeholder:text-muted/30"
                            placeholder="Agent Name"
                            disabled={status === 'submitting'}
                          />
                        </div>
                        <div className="space-y-1.5 group">
                          <label className={`text-xs font-bold uppercase tracking-wider pl-1 transition-colors ${focusedField === 'company' ? 'text-accent-primary' : 'text-muted'}`}>Company</label>
                          <input
                            type="text"
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            onFocus={() => setFocusedField('company')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-bg-surface/50 border border-border-subtle text-text-main rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 focus:bg-bg-surface transition-all placeholder:text-muted/30"
                            placeholder="Organization"
                            disabled={status === 'submitting'}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5 group">
                          <label className={`text-xs font-bold uppercase tracking-wider pl-1 transition-colors ${focusedField === 'email' ? 'text-accent-primary' : 'text-muted'}`}>Email Coordinates</label>
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-bg-surface/50 border border-border-subtle text-text-main rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 focus:bg-bg-surface transition-all placeholder:text-muted/30"
                            placeholder="name@domain.com"
                            disabled={status === 'submitting'}
                          />
                        </div>

                        <div className="space-y-1.5 group">
                          <label className={`text-xs font-bold uppercase tracking-wider pl-1 transition-colors ${focusedField === 'budget' ? 'text-accent-primary' : 'text-muted'}`}>Estimated Budget</label>
                          <input
                            type="text"
                            value={formData.budget}
                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                            onFocus={() => setFocusedField('budget')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full bg-bg-surface/50 border border-border-subtle text-text-main rounded-xl px-4 h-11 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 focus:bg-bg-surface transition-all placeholder:text-muted/30"
                            placeholder="$25,000+"
                            disabled={status === 'submitting'}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 group">
                        <label className={`text-xs font-bold uppercase tracking-wider pl-1 transition-colors ${focusedField === 'message' ? 'text-accent-primary' : 'text-muted'}`}>Mission Details</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={e => setFormData({ ...formData, message: e.target.value })}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full bg-bg-surface/50 border border-border-subtle text-text-main rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/50 focus:bg-bg-surface transition-all resize-none placeholder:text-muted/30"
                          placeholder="Describe your objectives, timeline, and requirements..."
                          disabled={status === 'submitting'}
                        />
                      </div>

                      {status === 'error' && (
                        <div className="flex items-start gap-3 text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                          <AlertCircle size={18} className="shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{errorMessage || "Transmission interrupted. Please try again or use the emergency uplink (email)."}</span>
                        </div>
                      )}

                      <div className="pt-2">
                        <Button
                          type="submit"
                          className="w-full h-12 text-sm font-semibold shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 transition-all duration-300"
                          disabled={status === 'submitting'}
                          icon={status !== 'submitting'}
                        >
                          {status === 'submitting' ? 'Encrypting & Sending...' : 'Execute Transmission'}
                        </Button>
                        <p className="text-center text-[10px] text-muted mt-3 flex items-center justify-center gap-1 opacity-60">
                          <ShieldCheck size={10} /> Secured by End-to-End Encryption
                        </p>
                      </div>
                    </form>
                  )}
                </TiltCard>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;