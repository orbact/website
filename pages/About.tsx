import React, { useState, useEffect } from 'react';
import { TEAM } from '../constants';
import { Target, Users, Zap, Heart, Globe2, Fingerprint, Code2, ArrowDown } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { teamService } from '../services/teamService';
import { TeamMember } from '../types';
import SEO from '../components/SEO';
import useScrollReveal from '../hooks/useScrollReveal';

// --- 3D Component: Neural Helix ---
const NeuralHelix: React.FC = () => {
   return (
      <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden pointer-events-none">
         {/* Central Axis */}
         <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-accent-primary/50 to-transparent" />

         {/* Helix Strands */}
         {[...Array(20)].map((_, i) => (
            <div
               key={i}
               className="absolute w-[300px] h-[2px] bg-gradient-to-r from-transparent via-accent-secondary/30 to-transparent animate-[spin_8s_linear_infinite]"
               style={{
                  top: `${(i / 20) * 100}%`,
                  animationDelay: `${i * -0.2}s`,
                  opacity: 1 - Math.abs(i - 10) / 10 // Fade edges
               }}
            />
         ))}

         {[...Array(20)].map((_, i) => (
            <div
               key={`rev-${i}`}
               className="absolute w-[300px] h-[2px] bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent animate-[spin_8s_linear_infinite_reverse]"
               style={{
                  top: `${(i / 20) * 100}%`,
                  animationDelay: `${i * -0.2}s`,
                  opacity: 1 - Math.abs(i - 10) / 10
               }}
            />
         ))}

         {/* Floating Particles */}
         <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-text-main rounded-full blur-[2px] animate-float opacity-50" />
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-accent-primary rounded-full blur-[1px] animate-float" style={{ animationDelay: '1s' }} />
         </div>
      </div>
   );
};

const About: React.FC = () => {
   const navigate = useNavigate();
   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

   useEffect(() => {
      async function fetchTeam() {
         const data = await teamService.getAllMembers();
         if (data.length > 0) {
            setTeamMembers(data);
         } else {
            setTeamMembers(TEAM); // Fallback
         }
      }
      fetchTeam();
   }, []);

   const addToRefs = useScrollReveal([teamMembers]);

   return (
      <div className="min-h-screen bg-bg-page relative overflow-hidden selection:bg-accent-secondary selection:text-white">
         <SEO
            title="About Us | Orbact"
            description="Meet the architects, designers, and futurists behind the machine. We are the human kernel."
         />

         {/* Background Ambience */}
         <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--bg-page)_100%)] z-0 pointer-events-none" />
         <div className="fixed top-20 right-[-10%] w-[600px] h-[600px] bg-accent-secondary/5 blur-[100px] rounded-full pointer-events-none" />

         {/* --- HERO SECTION --- */}
         <section className="relative z-10 min-h-[60vh] flex pt-36 md:pt-48 pb-12">
            <div className="absolute inset-0 z-0 opacity-50">
               <NeuralHelix />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
               <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-bold uppercase tracking-widest text-accent-primary mb-8">
                     <Fingerprint size={12} />
                     <span>IDENTIFICATION: ORBACT_COLLECTIVE</span>
                  </div>

                  <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-text-main tracking-tighter mb-8 leading-[0.9]">
                     THE HUMAN <br />
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-primary via-white to-accent-secondary">KERNEL.</span>
                  </h1>

                  <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
                     We are not just a dev shop. We are a hive mind of architects, designers, and futurists dedicated to one directive: <span className="text-text-main font-bold">Building the Impossible.</span>
                  </p>
               </div>

               <div className="mt-20 flex justify-center animate-bounce opacity-50">
                  <ArrowDown className="text-text-main" />
               </div>
            </div>
         </section>

         {/* --- MANIFESTO (Stream of Consciousness) --- */}
         <section className="container mx-auto px-6 py-20 relative z-10">
            <div className="max-w-4xl mx-auto space-y-20 md:space-y-32">
               {[
                  { title: "Precision", text: "We measure twice, cut once. In a world of fast-food software, we serve Michelin-star code.", icon: Target },
                  { title: "Autonomy", text: "We don't micromanage. We deploy agents—human and silicon—empowered to make critical decisions.", icon: Users },
                  { title: "Velocity", text: "Speed isn't just about moving fast. It's about removing friction. We optimize for flow.", icon: Zap },
                  { title: "Empathy", text: "Technology is cold. We bring the warmth. We design for the human on the other side of the screen.", icon: Heart }
               ].map((item, i) => (
                  <div
                     key={i}
                     ref={addToRefs}
                     className={`flex flex-col md:flex-row gap-6 md:gap-8 items-start opacity-0 translate-y-20 transition-all duration-1000 ease-out ${i % 2 !== 0 ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}
                  >
                     <div className="hidden md:flex flex-col items-center gap-4 mt-4">
                        <div className="w-px h-24 bg-gradient-to-b from-transparent via-border-strong to-transparent" />
                        <div className="w-12 h-12 rounded-full border border-border-strong flex items-center justify-center text-accent-primary bg-bg-card">
                           <item.icon size={20} />
                        </div>
                        <div className="w-px h-24 bg-gradient-to-b from-transparent via-border-strong to-transparent" />
                     </div>

                     {/* Mobile Icon - Visible only on mobile to connect context */}
                     <div className="md:hidden flex items-center gap-3 mb-2 text-accent-primary">
                        <item.icon size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-50">Core Value_0{i + 1}</span>
                     </div>

                     <div className={`flex-1 ${i % 2 !== 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                        <h2 className="text-4xl md:text-7xl font-bold text-gray-200 dark:text-bg-surface mb-4 uppercase tracking-tighter transition-colors duration-500 hover:text-text-main cursor-default">
                           {item.title}
                        </h2>
                        <p className="text-lg md:text-2xl text-text-muted leading-relaxed font-light">
                           {item.text}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </section>

         {/* --- CREW DECK (Team) --- */}
         <section className="py-20 md:py-32 border-t border-border-subtle bg-bg-surface/5">
            <div className="container mx-auto px-6">
               <div ref={addToRefs} className="mb-12 md:mb-16 flex justify-between items-end opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                  <div>
                     <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-2">Active Operatives</h2>
                     <p className="text-muted">The minds behind the machine.</p>
                  </div>
                  <div className="hidden md:block">
                     <div className="flex gap-2 text-xs font-mono text-muted">
                        <span>STATUS:</span>
                        <span className="text-green-500">ONLINE</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {teamMembers.map((member, i) => (
                     <div
                        key={i}
                        ref={addToRefs}
                        className="opacity-0 translate-y-20 transition-all duration-1000 ease-out group"
                        style={{ transitionDelay: `${i * 100}ms` }}
                     >
                        <div className="relative h-[400px] rounded-[32px] overflow-hidden bg-bg-card border border-border-subtle group-hover:border-accent-primary/50 transition-colors duration-500">
                           {/* Image */}
                           <div className="absolute inset-0">
                              <img
                                 src={member.image}
                                 alt={member.name}
                                 className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                           </div>

                           {/* Info Overlay */}
                           <div className="absolute bottom-0 left-0 w-full p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                              <div className="mb-4 overflow-hidden h-0 group-hover:h-auto transition-all duration-500 opacity-0 group-hover:opacity-100">
                                 <div className="flex gap-2 mb-2">
                                    <span className="p-1 rounded bg-white/10 backdrop-blur"><Code2 size={12} className="text-white" /></span>
                                    <span className="p-1 rounded bg-white/10 backdrop-blur"><Globe2 size={12} className="text-white" /></span>
                                 </div>
                              </div>

                              <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                              <p className="text-accent-primary text-xs font-bold uppercase tracking-widest">{member.role}</p>
                           </div>

                           {/* Corner Accents */}
                           <div className="absolute top-4 right-4 w-2 h-2 bg-accent-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* --- GLOBAL PRESENCE (Footer CTA) --- */}
         <section className="container mx-auto px-6 pb-20 pt-10">
            <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
               <TiltCard className="rounded-[32px] md:rounded-[40px] bg-bg-card border border-border-subtle p-10 md:p-24 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:32px_32px] opacity-30 animate-grid-flow-sm" />
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent-secondary to-transparent opacity-50" />

                  <div className="relative z-10">
                     <h2 className="text-3xl md:text-5xl font-bold text-text-main mb-8">
                        Join the <span className="text-accent-secondary">Collective.</span>
                     </h2>
                     <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Button onClick={() => navigate('/contact')} icon className="w-full sm:w-auto">View Open Positions</Button>
                        <Button variant="outline" onClick={() => navigate('/contact')} className="w-full sm:w-auto">Become a Client</Button>
                     </div>

                     <div className="mt-12 flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-muted text-sm font-mono">
                        <span className="flex items-center justify-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SF_HQ</span>
                        <span className="flex items-center justify-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-75" /> LDN_HUB</span>
                        <span className="flex items-center justify-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse delay-150" /> REMOTE_NET</span>
                     </div>
                  </div>
               </TiltCard>
            </div>
         </section>

      </div>
   );
};

export default About;