import React, { useState, useEffect } from 'react';
import { PRICING_TIERS } from '../constants';
import Button from '../components/Button';
import TiltCard from '../components/TiltCard';
import { Check, X, Zap, Shield, Rocket, HelpCircle, ChevronDown, ChevronUp, Lock, RotateCcw, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { pricingService, DbFAQ } from '../services/pricingService';
import { PricingTier } from '../types';
import SEO from '../components/SEO';
import useScrollReveal from '../hooks/useScrollReveal';

// --- 3D Component: Flux Prism ---
const FluxPrism: React.FC = () => {
   return (
      <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center perspective-[1000px]">
         <div className="relative w-24 h-24 transform-style-3d animate-[spin_15s_linear_infinite]">
            {/* Prism Faces (Triangular-ish illusion using rotated planes) */}
            {[0, 120, 240].map((deg, i) => (
               <React.Fragment key={i}>
                  <div
                     className="absolute inset-0 border-2 border-accent-primary/30 bg-accent-primary/5 backdrop-blur-sm"
                     style={{
                        transform: `rotateY(${deg}deg) translateZ(50px)`,
                        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
                     }}
                  />
                  <div
                     className="absolute inset-0 border-2 border-accent-secondary/30 bg-accent-secondary/5 backdrop-blur-sm"
                     style={{
                        transform: `rotateY(${deg}deg) translateZ(50px) rotateX(180deg) translateY(-100%)`, // Inverted pyramid
                        clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
                     }}
                  />
               </React.Fragment>
            ))}

            {/* Inner Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full blur-[30px] animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-accent-primary rounded-lg rotate-45 animate-[spin_4s_linear_infinite]" />
         </div>

         {/* Floating Rings */}
         <div className="absolute w-[120%] h-[120%] border border-border-subtle rounded-full animate-[spin_20s_linear_infinite_reverse] opacity-50" />
         <div className="absolute w-[150%] h-[150%] border border-border-subtle rounded-full animate-[spin_30s_linear_infinite] opacity-30" />
      </div>
   );
};

const Pricing: React.FC = () => {
   const [annual, setAnnual] = useState(true);
   const [selectedTier, setSelectedTier] = useState<string>('Professional');
   const [openFaq, setOpenFaq] = useState<number | null>(null);
   const navigate = useNavigate();

   // Data State
   const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
   const [faqs, setFaqs] = useState<{ q: string, a: string }[]>([]);
   const [loading, setLoading] = useState(true);

   // Fetch Data
   useEffect(() => {
      async function fetchData() {
         const [tiers, dbFaqs] = await Promise.all([
            pricingService.getAllTiers(),
            pricingService.getAllFAQs('pricing')
         ]);

         // Fallback for demo if no data
         if (tiers.length === 0) {
            setPricingTiers(PRICING_TIERS);
         } else {
            setPricingTiers(tiers);
         }

         if (dbFaqs.length === 0) {
            setFaqs([
               { q: "Can I switch plans mid-sprint?", a: "Yes. Upgrades are instant and pro-rated. Downgrades take effect at the start of the next billing cycle to ensure sprint continuity." },
               { q: "What is a 'Dedicated Expert'?", a: "A senior-level engineer or designer solely allocated to your project. Unlike agencies that split attention, our experts focus 100% on your stack." },
               { q: "Do you offer custom SLAs?", a: "Absolutely. Our Enterprise tier allows for custom Service Level Agreements, including 99.99% uptime guarantees and <1hr response times." },
               { q: "Is there a setup fee?", a: "No hidden fees. The price you see is the price you pay for the talent and infrastructure provided." }
            ]);
         } else {
            setFaqs(dbFaqs.map(f => ({ q: f.question, a: f.answer })));
         }
         setLoading(false);
      }
      fetchData();
   }, []);

   const addToRefs = useScrollReveal([loading]);

   const getTierIcon = (name: string) => {
      if (name === 'Starter') return Zap;
      if (name === 'Professional') return Rocket;
      if (name === 'Enterprise') return Shield;
      return Zap;
   };

   return (
      <div className="min-h-screen bg-bg-page relative overflow-hidden selection:bg-accent-primary selection:text-black">
         <SEO
            title="Pricing | Orbact"
            description="Transparent pricing for AI engineering and development teams. Monthly and annual plans available."
         />

         {/* Ambient Background & Grid - Matched to Works page */}
         <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
            <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 animate-grid-flow-lg" />
         </div>

         {/* --- HERO SECTION --- */}
         <section className="relative z-10 min-h-[60vh] flex pt-36 md:pt-48 pb-12">
            <div className="container mx-auto px-6">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                  {/* Text Side */}
                  <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                     <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-bold uppercase tracking-widest text-accent-primary mb-6">
                        <Zap size={12} />
                        <span>INVESTMENT_MODELS</span>
                     </div>

                     <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-text-main leading-[1.1] mb-6">
                        Invest in <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-white to-accent-secondary animate-shine bg-[length:200%_auto]">Velocity.</span>
                     </h1>

                     <p className="text-lg text-muted max-w-lg leading-relaxed border-l-2 border-border-subtle pl-6 mb-10">
                        Stop hiring, training, and managing. Start shipping. Choose the power level that matches your ambition.
                     </p>

                     {/* Features Strip */}
                     <div className="flex flex-wrap gap-4 mt-8">
                        {[
                           { label: 'Secure Payment', icon: Lock },
                           { label: 'Flexible Cancelation', icon: RotateCcw },
                           { label: 'Instant Access', icon: Headphones }
                        ].map((item, i) => (
                           <div key={i} className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-bg-surface/40 border border-border-subtle hover:border-accent-primary/40 hover:bg-bg-surface/80 transition-all duration-300 cursor-default backdrop-blur-sm">
                              <item.icon size={16} className="text-muted group-hover:text-accent-primary transition-colors" />
                              <span className="text-sm font-medium text-text-muted group-hover:text-text-main transition-colors">
                                 {item.label}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* 3D Prism */}
                  <div ref={addToRefs} className="flex justify-center lg:justify-end items-center opacity-0 scale-90 transition-all duration-1000 ease-out delay-200">
                     <FluxPrism />
                  </div>
               </div>
            </div>
         </section>

         {/* --- STICKY TOGGLE BAR --- */}
         <div className="sticky top-24 z-40 mb-20 pointer-events-none">
            <div className="container mx-auto px-6 flex justify-center">
               <div className="pointer-events-auto bg-bg-page/70 backdrop-blur-xl border border-border-subtle p-1.5 rounded-full shadow-2xl flex items-center gap-1">
                  <button
                     onClick={() => setAnnual(false)}
                     className={`px-4 md:px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${!annual
                        ? 'bg-text-main text-bg-page shadow-lg'
                        : 'text-muted hover:text-text-main hover:bg-bg-surface'
                        }`}
                  >
                     Monthly
                  </button>
                  <button
                     onClick={() => setAnnual(true)}
                     className={`px-4 md:px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${annual
                        ? 'bg-text-main text-bg-page shadow-lg'
                        : 'text-muted hover:text-text-main hover:bg-bg-surface'
                        }`}
                  >
                     Annual <span className={`text-[10px] px-1.5 rounded-full ${annual ? 'bg-black/20 text-white' : 'bg-accent-primary text-black'}`}>-20%</span>
                  </button>
               </div>
            </div>
         </div>

         {/* --- PLANS DOCK --- */}
         <section className="container mx-auto px-6 mb-32 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
               {pricingTiers.map((tier, idx) => {
                  const Icon = getTierIcon(tier.name);
                  const isSelected = selectedTier === tier.name;
                  const isRec = tier.recommended;

                  const displayPrice = tier.price === 'Custom' ? 'Custom' : annual ? '$' + (parseInt(tier.price.replace('$', '').replace(',', '')) * 0.8).toLocaleString() : tier.price;

                  return (
                     <div
                        key={tier.name || idx}
                        ref={addToRefs}
                        className="opacity-0 translate-y-20 transition-all duration-700 ease-out flex"
                        style={{ transitionDelay: `${idx * 100}ms` }}
                     >
                        {/* 
                        Wrapper separates animation from selection logic.
                        Added flex layout to card to ensure equal height and consistent button positioning.
                     */}
                        <div
                           onClick={() => setSelectedTier(tier.name)}
                           className={`
                           relative group rounded-[24px] bg-bg-card border transition-all duration-500 overflow-hidden cursor-pointer w-full flex flex-col
                           ${isSelected
                                 ? 'border-accent-primary shadow-[0_0_40px_-10px_rgba(var(--accent-primary-rgb),0.2)] md:-translate-y-6 z-20'
                                 : 'border-border-subtle opacity-70 hover:opacity-100 hover:border-border-strong hover:scale-[1.02]'
                              }
                           ${!isSelected && isRec ? 'md:-translate-y-2' : ''}
                        `}
                        >
                           {/* Interactive "Power Level" Bar */}
                           <div className="absolute top-0 left-0 w-full h-1 bg-bg-surface">
                              <div className={`h-full transition-all duration-700 ${isSelected ? 'w-full' : 'w-0'} ${isSelected ? 'bg-gradient-to-r from-accent-primary to-accent-secondary' : 'bg-text-muted'}`} />
                           </div>

                           {/* Card Body - Content layout with flex grow */}
                           <div className="p-6 md:p-8 relative flex-grow flex flex-col">
                              {/* Header */}
                              <div className="flex justify-between items-start mb-6">
                                 <div className={`p-2.5 rounded-xl bg-bg-surface border border-border-subtle ${isSelected ? 'text-accent-primary' : 'text-text-muted'}`}>
                                    <Icon size={20} />
                                 </div>
                                 {isRec && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-accent-primary/10 text-accent-primary text-[10px] font-bold uppercase tracking-wider border border-accent-primary/20">
                                       Recommended
                                    </span>
                                 )}
                              </div>

                              <h3 className={`text-xl font-bold mb-2 transition-colors ${isSelected ? 'text-text-main' : 'text-text-muted'}`}>{tier.name}</h3>
                              <div className="h-10">
                                 <p className="text-xs text-muted leading-relaxed">{tier.description}</p>
                              </div>

                              {/* Price - Fixed height container to prevent layout jump */}
                              <div className="my-6 pt-6 border-t border-border-subtle">
                                 <div className="flex items-baseline gap-1">
                                    <span className={`text-4xl font-bold tracking-tighter transition-colors ${isSelected ? 'text-text-main' : 'text-text-muted'}`}>
                                       {displayPrice}
                                    </span>
                                    {tier.price !== 'Custom' && <span className="text-muted text-sm font-medium">/mo</span>}
                                 </div>
                                 <div className="h-4 mt-1">
                                    {annual && tier.price !== 'Custom' && (
                                       <p className="text-[10px] text-green-400 font-medium animate-fade-in-up">Billed annually</p>
                                    )}
                                 </div>
                              </div>

                              {/* Features List - Flex grow pushes button down */}
                              <ul className="space-y-3 mb-8 flex-1">
                                 {tier.features.map((feat, i) => (
                                    <li key={i} className="flex items-start gap-3 group/li">
                                       <Check size={14} className={`mt-0.5 shrink-0 transition-colors ${isSelected ? 'text-accent-primary' : 'text-muted group-hover/li:text-text-main'}`} />
                                       <span className="text-xs text-text-muted group-hover/li:text-text-main transition-colors">{feat}</span>
                                    </li>
                                 ))}
                              </ul>

                              {/* Button pinned to bottom */}
                              <div className="mt-auto">
                                 <Button
                                    variant={isSelected ? 'primary' : 'outline'}
                                    className={`w-full justify-center h-10 text-sm transition-all ${isSelected ? 'shadow-[0_0_20px_rgba(var(--shadow-rgb),0.3)]' : ''}`}
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       navigate('/contact');
                                    }}
                                 >
                                    {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Access'}
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         </section>

         {/* --- FEATURE MATRIX / FAQ (Terminals) --- */}
         <section className="container mx-auto px-6 pb-20 max-w-4xl">
            <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out mb-12">
               <h2 className="text-3xl font-bold text-text-main mb-2">System Inquiries</h2>
               <p className="text-muted">Common configuration questions.</p>
            </div>

            <div className="space-y-4">
               {faqs.map((faq, i) => (
                  <div
                     key={i}
                     ref={addToRefs}
                     className="opacity-0 translate-y-10 transition-all duration-1000 ease-out"
                     style={{ transitionDelay: `${i * 50}ms` }}
                  >
                     <div
                        className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openFaq === i
                           ? 'bg-bg-card border-accent-primary/50'
                           : 'bg-bg-surface/30 border-border-subtle hover:bg-bg-surface'
                           }`}
                     >
                        <button
                           onClick={() => setOpenFaq(openFaq === i ? null : i)}
                           className="w-full flex items-center justify-between p-6 text-left"
                        >
                           <span className="font-bold text-text-main">{faq.q}</span>
                           {openFaq === i ? <ChevronUp size={20} className="text-accent-primary" /> : <ChevronDown size={20} className="text-muted" />}
                        </button>
                        <div
                           className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaq === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                              }`}
                        >
                           <p className="px-6 pb-6 text-sm text-muted leading-relaxed font-mono">
                              {faq.a}
                           </p>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* --- BOTTOM PROMPT --- */}
         <section className="container mx-auto px-6 pb-20 text-center">
            <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out py-12 border-t border-border-subtle">
               <p className="text-lg text-text-main mb-6">Need a custom architecture?</p>
               <button onClick={() => navigate('/contact')} className="text-muted hover:text-accent-primary transition-colors flex items-center gap-2 mx-auto">
                  <HelpCircle size={18} /> Book a consultation
               </button>
            </div>
         </section>

      </div>
   );
};

export default Pricing;