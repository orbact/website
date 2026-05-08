import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SERVICES, CASE_STUDIES } from '../constants';
import Button from '../components/Button';
import TiltCard from '../components/TiltCard';
import { CheckCircle2, ArrowLeft, Layers, Zap, ArrowRight, Clock, Users } from 'lucide-react';
import SEO from '../components/SEO';
import useScrollReveal from '../hooks/useScrollReveal';

const SolutionDetail: React.FC = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const service = SERVICES.find(s => s.id === id);
   const addToRefs = useScrollReveal([id]);

   if (!service) {
      return (
         <div className="container mx-auto px-6 py-32 text-center">
            <h2 className="text-3xl font-bold mb-4 text-text-main">Service not found</h2>
            <Button onClick={() => navigate('/solutions')}>Back to Services</Button>
         </div>
      );
   }

   const relatedCases = CASE_STUDIES.filter(c => c.category.includes(service.title.split(' ')[0])) || CASE_STUDIES.slice(0, 2);



   return (
      <div className="pb-20 overflow-hidden">
         <SEO
            title={`${service.title} | Orbact`}
            description={service.shortDescription}
         />
         {/* Background Ambience */}
         <div className={`fixed top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br ${service.color.replace('text-', 'from-')}/10 to-transparent blur-[150px] rounded-full pointer-events-none -z-10`} />
         <div className={`fixed bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr ${service.color.replace('text-', 'from-')}/5 to-transparent blur-[120px] rounded-full pointer-events-none -z-10`} />

         {/* Hero Section */}
         <section className="relative pt-36 md:pt-48 pb-20">
            <div className="container mx-auto px-6 relative z-10">
               <button
                  onClick={() => navigate('/solutions')}
                  className="flex items-center text-sm font-medium text-muted hover:text-text-main mb-8 transition-colors group"
               >
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Services
               </button>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                     <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-bold uppercase tracking-widest mb-6 ${service.color}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        Service Vertical
                     </div>
                     <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-text-main leading-tight tracking-tight">
                        {service.title}
                     </h1>
                     <p className="text-xl text-muted leading-relaxed max-w-xl border-l-2 border-border-subtle pl-6">
                        {service.fullDescription}
                     </p>
                     <div className="flex gap-4 mt-10">
                        <Button onClick={() => navigate('/contact')} icon>Start Project</Button>
                        <Button variant="outline" onClick={() => document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' })}>How it works</Button>
                     </div>
                  </div>

                  {/* 3D Visual Representation */}
                  <div
                     ref={addToRefs}
                     className="relative hidden lg:block perspective-[1000px] opacity-0 translate-y-20 transition-all duration-1000 ease-out delay-200"
                  >
                     <TiltCard className="w-full aspect-square max-w-[500px] mx-auto rounded-[40px] bg-gradient-to-br from-bg-surface/80 to-bg-card/30 border border-border-subtle backdrop-blur-xl shadow-2xl flex items-center justify-center group">
                        <div className={`absolute inset-0 bg-gradient-to-tr ${service.color.replace('text-', 'from-')}/20 to-transparent opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-[40px]`} />

                        <div className="relative z-10 p-12 text-center w-full flex flex-col items-center">
                           <div className={`w-32 h-32 mx-auto rounded-3xl bg-bg-page border border-border-subtle flex items-center justify-center mb-8 shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                              <service.icon size={64} className={service.color} />
                           </div>
                           <div className="space-y-4 w-full max-w-[200px]">
                              <div className="h-2 w-full bg-bg-subtle rounded-full overflow-hidden">
                                 <div className={`h-full w-2/3 ${service.color.replace('text-', 'bg-')} animate-pulse`} />
                              </div>
                              <div className="h-2 w-3/4 mx-auto bg-bg-subtle rounded-full opacity-50" />
                           </div>
                        </div>

                        {/* Floating Orbiting Elements */}
                        <div className="absolute top-1/4 left-0 -translate-x-1/2 p-4 bg-bg-card rounded-2xl border border-border-subtle shadow-lg animate-float">
                           <Layers size={24} className="text-text-main" />
                        </div>
                        <div className="absolute bottom-1/4 right-0 translate-x-1/2 p-4 bg-bg-card rounded-2xl border border-border-subtle shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                           <Zap size={24} className="text-text-main" />
                        </div>
                     </TiltCard>
                  </div>
               </div>
            </div>
         </section>

         <section className="container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* Main Content Column */}
            <div className="lg:col-span-8 space-y-24">

               {/* Deliverables Grid */}
               <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                  <h2 className="text-3xl font-bold mb-10 text-text-main flex items-center gap-3">
                     <div className={`w-2 h-8 rounded-full ${service.color.replace('text-', 'bg-')}`} />
                     Core Deliverables
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {service.features.map((feature, idx) => (
                        <TiltCard key={idx} className="bg-bg-card border border-border-subtle rounded-2xl p-6 group hover:border-border-strong">
                           <div className="flex items-start gap-4">
                              <div className={`mt-1 p-2 rounded-lg bg-bg-subtle ${service.color}`}>
                                 <CheckCircle2 size={20} />
                              </div>
                              <div>
                                 <h4 className="text-lg font-bold mb-2 text-text-main">{feature}</h4>
                                 <p className="text-sm text-muted leading-relaxed">
                                    Enterprise-grade implementation with full documentation and post-launch support.
                                 </p>
                              </div>
                           </div>
                        </TiltCard>
                     ))}
                  </div>
               </div>

               {/* Process Timeline */}
               <div id="process" ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out delay-100">
                  <h2 className="text-3xl font-bold mb-10 text-text-main flex items-center gap-3">
                     <div className={`w-2 h-8 rounded-full ${service.color.replace('text-', 'bg-')}`} />
                     Execution Roadmap
                  </h2>
                  <div className="relative space-y-12 pl-8 border-l border-border-subtle ml-4">
                     {[
                        { title: 'Discovery & Blueprint', desc: 'We analyze your infrastructure, data pipelines, and business goals to architect a scalable solution.' },
                        { title: 'Agile Development', desc: 'Two-week sprints with continuous integration. You get transparent access to our code repositories and project boards.' },
                        { title: 'Deployment & Scale', desc: 'Rigorous testing, security auditing, and automated deployment pipelines ensuring 99.9% uptime.' }
                     ].map((step, idx) => (
                        <div key={idx} className="relative group">
                           <div className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-4 border-bg-page ${service.color.replace('text-', 'bg-')} z-10 group-hover:scale-125 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]`} />
                           <h3 className="text-xl font-bold mb-3 text-text-main group-hover:text-accent-primary transition-colors">{step.title}</h3>
                           <p className="text-muted text-lg leading-relaxed max-w-2xl">
                              {step.desc}
                           </p>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 relative">
               <div className="sticky top-32 space-y-8">
                  <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-300">
                     <TiltCard className="p-8 rounded-3xl bg-bg-card/50 border border-border-subtle backdrop-blur-md shadow-2xl">
                        <div className="mb-8">
                           <span className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                              <Clock size={14} /> Estimated Velocity
                           </span>
                           <h3 className="text-3xl font-bold text-text-main mt-2">2-4 Weeks</h3>
                           <p className="text-sm text-muted mt-2">Typical time to MVP</p>
                        </div>

                        <div className="space-y-4 mb-8">
                           <div className="flex items-center justify-between text-sm py-2 border-b border-border-subtle">
                              <span className="text-muted flex items-center gap-2"><Users size={14} /> Team Size</span>
                              <span className="font-bold text-text-main">3-5 Experts</span>
                           </div>
                           <div className="flex items-center justify-between text-sm py-2 border-b border-border-subtle">
                              <span className="text-muted flex items-center gap-2"><Zap size={14} /> Availability</span>
                              <span className="font-bold text-green-400 flex items-center gap-2">
                                 <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Immediate
                              </span>
                           </div>
                        </div>

                        <Button className="w-full" onClick={() => navigate('/contact')}>Book Strategy Call</Button>
                     </TiltCard>
                  </div>

                  {relatedCases.length > 0 && (
                     <div ref={addToRefs} className="opacity-0 translate-y-10 transition-all duration-1000 ease-out delay-500 pt-8 border-t border-border-subtle">
                        <p className="text-xs font-bold mb-6 text-muted uppercase tracking-wider">Relevant Case Studies</p>
                        <div className="space-y-4">
                           {relatedCases.map(c => (
                              <div
                                 key={c.id}
                                 className="group cursor-pointer flex items-center gap-4 p-3 rounded-xl hover:bg-bg-surface transition-colors border border-transparent hover:border-border-subtle"
                                 onClick={() => navigate('/works')}
                              >
                                 <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                    <img src={c.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                 </div>
                                 <div>
                                    <p className="font-bold text-text-main text-sm group-hover:text-accent-primary transition-colors line-clamp-1">{c.title}</p>
                                    <div className="flex items-center gap-1 text-xs text-muted mt-1">
                                       View details <ArrowRight size={10} />
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </section>
      </div>
   );
};

export default SolutionDetail;