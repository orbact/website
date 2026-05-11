import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import { SERVICES } from '../constants';
import { projectService } from '../services/projectService';
import { CaseStudy } from '../types';
import { serviceService } from '../services/serviceService';
import { testimonialService } from '../services/testimonialService';
import Button from '../components/Button';
import TiltCard from '../components/TiltCard';
import { ArrowUpRight, ShieldCheck, Zap, Globe, Layers, ArrowRight, Target, Quote, Star } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';

interface Review {
    text: string;
    author: string;
    role: string;
    avatar: string;
    stars: number;
}

const REVIEWS: Review[] = [
    { text: "Orbact transformed our legacy stack into a high-performance AI engine. The velocity was incredible.", author: "Sarah Jenkins", role: "CTO, Fintech Corp", avatar: "https://picsum.photos/100/100?random=20", stars: 5 },
    { text: "The design team didn't just make it look good; they made it work intuitively. Our conversion rates doubled.", author: "Michael Ross", role: "VP of Product, E-Comm", avatar: "https://picsum.photos/100/100?random=21", stars: 5 },
    { text: "Their agentic workflow automation saved us 40+ hours per week. A game changer for operations.", author: "Elena Rodriguez", role: "COO, Logistics Inc", avatar: "https://picsum.photos/100/100?random=22", stars: 5 },
    { text: "Truly partners in innovation. They helped us define the roadmap and executed with precision.", author: "David Chen", role: "Founder, HealthTech AI", avatar: "https://picsum.photos/100/100?random=23", stars: 5 },
    { text: "Code quality is top-notch. Scalable, clean, and well-documented. A developer's dream.", author: "James Foster", role: "Lead Engineer, SaaS Co", avatar: "https://picsum.photos/100/100?random=24", stars: 5 },
    { text: "From concept to launch in 4 weeks. I've never seen a team move this fast without breaking things.", author: "Amanda Liu", role: "Director, Marketing", avatar: "https://picsum.photos/100/100?random=25", stars: 5 },
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="w-[260px] md:w-[300px] p-5 rounded-xl bg-bg-surface/50 border border-border-subtle backdrop-blur-[2px] hover:bg-bg-surface hover:border-border-strong transition-all duration-500 shrink-0 group cursor-default">
        {/* Compact Header */}
        <div className="flex justify-between items-center mb-3 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex gap-0.5">
                {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} size={10} className="fill-accent-primary text-accent-primary" />
                ))}
            </div>
            <Quote className="w-3 h-3 text-text-main" />
        </div>

        {/* Compact Text */}
        <p className="text-sm text-muted/80 group-hover:text-text-muted font-medium leading-relaxed mb-4 line-clamp-2 transition-colors duration-500">
            "{review.text}"
        </p>

        {/* Compact Footer */}
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-bg-subtle overflow-hidden opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                <img src={review.avatar} alt={review.author} className="w-full h-full object-cover grayscale" />
            </div>
            <div>
                <p className="font-bold text-xs text-muted/60 group-hover:text-text-main transition-colors duration-500">{review.author}</p>
                <p className="text-[10px] text-muted/40 group-hover:text-muted/60 uppercase tracking-wider transition-colors duration-500">{review.role}</p>
            </div>
        </div>
    </div>
);

import SEO from '../components/SEO';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const addToRefs = useScrollReveal([]);
    const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
    const [selectedProjects, setSelectedProjects] = useState<CaseStudy[]>([]);
    const [services, setServices] = useState(SERVICES);
    const [reviews, setReviews] = useState<Review[]>(REVIEWS);

    useEffect(() => {
        const loadHomeData = async () => {
            const [projects, cmsServices, cmsReviews] = await Promise.all([
                projectService.getSelectedProjects(),
                serviceService.getAllServices(),
                testimonialService.getAllTestimonials(),
            ]);
            setSelectedProjects(projects);
            if (cmsServices.length > 0) setServices(cmsServices);
            if (cmsReviews.length > 0) {
                setReviews(cmsReviews.map(review => ({
                    text: review.quote,
                    author: review.author,
                    role: review.role || review.company || 'Orbact Client',
                    avatar: review.avatar || '/orbact-icon.svg',
                    stars: review.rating || 5,
                })));
            }
        };
        loadHomeData();
    }, []);

    const features = [
        { icon: Layers, title: "Modular Arch", desc: "Microservices ready." },
        { icon: Zap, title: "High Perf", desc: "Core Vitals optimized." },
        { icon: ShieldCheck, title: "Enterprise Sec", desc: "SOC2 compliant." },
        { icon: Globe, title: "Global Edge", desc: "Multi-region deploy." }
    ];



    return (
        <div className="space-y-32 md:space-y-40 pb-20 overflow-x-hidden">
            <SEO
                title="Orbact | AI Engineering & Automation Collective"
                description="We build custom AI agents, neural architectures, and high-performance web apps to scale your business. Stop hiring, start shipping."
            />
            <Hero />

            {/* Feature Strip */}
            <section className="container mx-auto px-6">
                <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                        <h2 className="text-3xl md:text-5xl font-bold text-text-main">
                            Core <span className="text-muted">Capabilities</span>
                        </h2>
                        <Button variant="outline" onClick={() => navigate('/solutions')} className="hidden md:inline-flex">
                            View All Services
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.slice(0, 4).map((service, index) => (
                            <TiltCard
                                key={service.id}
                                className="h-full rounded-3xl bg-bg-card border border-border-subtle hover:border-border-strong cursor-pointer group overflow-hidden"
                                onClick={() => navigate(`/solutions/${service.id}`)}
                            >
                                <div className="p-8 h-full flex flex-col">
                                    <div className="mb-6 flex justify-between items-start">
                                        <div className={`w-14 h-14 rounded-2xl bg-bg-subtle flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                            <service.icon className={`w-7 h-7 ${service.color}`} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full border border-border-subtle flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight size={14} className="text-text-main" />
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-text-main">{service.title}</h3>
                                    <p className="text-muted text-sm leading-relaxed flex-grow">{service.shortDescription}</p>
                                </div>
                            </TiltCard>
                        ))}
                    </div>
                    <div className="mt-8 text-center md:hidden">
                        <Button variant="outline" onClick={() => navigate('/solutions')} className="w-full">
                            View All Services
                        </Button>
                    </div>
                </div>
            </section>

            {/* Integrations Marquee */}
            <section className="w-full overflow-hidden py-12 md:py-16 border-y border-border-subtle bg-bg-surface/30 backdrop-blur-sm">
                <div className="container mx-auto px-6 mb-8 md:mb-10 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-primary">Powering the next generation</p>
                </div>
                <div className="relative flex overflow-x-hidden group">
                    <div className="py-2 animate-marquee whitespace-nowrap flex gap-12 md:gap-24 px-8 md:px-16 items-center opacity-40 hover:opacity-80 transition-opacity duration-500">
                        {['Acme Corp', 'GlobalTech', 'Nebula', 'Vertex', 'Quantum', 'Hyperion', 'Oasis', 'Zenith', 'Bijju', 'Jewelsbyamina'].map(brand => (
                            <span key={brand} className="text-2xl md:text-3xl font-bold font-sans text-text-main flex items-center gap-2">
                                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-text-main"></span> {brand}
                            </span>
                        ))}
                        {['Acme Corp', 'GlobalTech', 'Nebula', 'Vertex', 'Quantum', 'Hyperion', 'Oasis', 'Zenith', 'Bijju', 'Jewelsbyamina'].map(brand => (
                            <span key={`${brand}-2`} className="text-2xl md:text-3xl font-bold font-sans text-text-main flex items-center gap-2">
                                <span className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-text-main"></span> {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Selected Works */}
            <section className="container mx-auto px-6">
                <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out delay-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-text-main">Selected Works</h2>
                            <p className="text-lg md:text-xl text-muted max-w-md">We partner with ambitious brands to build what's next.</p>
                        </div>
                        <Button variant="outline" onClick={() => navigate('/works')} icon className="hidden md:inline-flex">View All Work</Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                        {selectedProjects.length >= 1 ? (
                            <>
                                {/* Large Featured Card - First Project */}
                                <div
                                    className="md:col-span-7 group relative rounded-[24px] md:rounded-[32px] overflow-hidden aspect-[4/3] md:aspect-auto md:h-[600px] cursor-pointer"
                                    onClick={() => navigate('/works')}
                                >
                                    <img
                                        src={selectedProjects[0].image}
                                        alt={selectedProjects[0].title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                    <div className="absolute top-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                        <ArrowUpRight className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-8 md:p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <span className="inline-block px-3 py-1 rounded-full bg-accent-primary text-black text-xs font-bold tracking-wider mb-4">
                                            {selectedProjects[0].category}
                                        </span>
                                        <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">{selectedProjects[0].title}</h3>
                                        <p className="text-gray-300 text-sm md:text-lg mb-4 md:mb-6 max-w-md line-clamp-2 md:line-clamp-none">{selectedProjects[0].description}</p>
                                    </div>
                                </div>

                                {/* Smaller Card + Stats (Displays second project if available) */}
                                <div className="md:col-span-5 flex flex-col gap-6 md:gap-8 md:h-[600px]">
                                    {selectedProjects[1] && (
                                        <div
                                            className="flex-[1.2] group relative rounded-[24px] md:rounded-[32px] overflow-hidden cursor-pointer min-h-[250px]"
                                            onClick={() => navigate('/works')}
                                        >
                                            <img
                                                src={selectedProjects[1].image}
                                                alt={selectedProjects[1].title}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                                            <div className="absolute bottom-0 left-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                <span className="text-accent-secondary text-xs font-bold tracking-wider mb-2 block uppercase">
                                                    {selectedProjects[1].category}
                                                </span>
                                                <h3 className="text-xl md:text-2xl font-bold text-white">{selectedProjects[1].title}</h3>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex-1 bg-bg-card rounded-[24px] md:rounded-[32px] p-8 border border-border-subtle flex flex-col justify-center">
                                        <h4 className="text-muted uppercase tracking-wider text-xs font-bold mb-6">Our Impact</h4>
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-3xl md:text-4xl font-bold text-text-main mb-1">$500M+</p>
                                                <p className="text-sm text-muted">Client Value Generated</p>
                                            </div>
                                            <div className="h-px bg-border-subtle" />
                                            <div>
                                                <p className="text-3xl md:text-4xl font-bold text-text-main mb-1">150+</p>
                                                <p className="text-sm text-muted">Enterprise Launches</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Placeholder when no projects */
                            <div className="md:col-span-12">
                                <div className="bg-bg-card rounded-[32px] border border-border-subtle p-12 md:p-20 text-center">
                                    <Layers size={64} className="text-accent-primary mx-auto mb-6 opacity-50" />
                                    <h3 className="text-2xl md:text-3xl font-bold text-text-main mb-4">Projects Coming Soon</h3>
                                    <p className="text-lg text-muted mb-8 max-w-md mx-auto">
                                        We're building something amazing. Check back soon to see our featured work.
                                    </p>
                                    <Button variant="primary" onClick={() => navigate('/contact')} icon>
                                        Let's Start Your Project
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="md:hidden">
                            <Button variant="outline" onClick={() => navigate('/works')} icon className="w-full">View All Work</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Engineered for Scale - System Core Visual */}
            <section className="container mx-auto px-6">
                <div ref={addToRefs} className="opacity-0 translate-y-20 transition-all duration-1000 ease-out delay-200">
                    <div className="bg-gradient-to-br from-bg-card to-bg-surface rounded-[32px] md:rounded-[48px] p-8 md:p-20 border border-border-subtle relative overflow-hidden group">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-color)_1px,transparent_1px),linear-gradient(90deg,var(--grid-color)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 animate-grid-flow" />

                        {/* Dynamic Lighting */}
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-secondary/10 blur-[120px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-accent-secondary/15" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[100px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-accent-primary/10" />

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
                            {/* Content */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs font-bold mb-6 text-text-main">
                                    <Zap size={12} className="text-accent-primary" />
                                    THE ORBACT WAY
                                </div>
                                <h2 className="text-3xl md:text-6xl font-bold mb-6 md:mb-8 text-text-main leading-tight">
                                    Engineered for <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-main to-text-muted">Scale & Speed.</span>
                                </h2>
                                <p className="text-lg md:text-xl text-muted mb-8 md:mb-10 leading-relaxed">
                                    We don't just build MVPs; we architect systems ready for millions of users. Our methodology combines research-level rigor with production-grade reliability.
                                </p>
                                <Button onClick={() => navigate('/about')} variant="outline" className="w-full md:w-auto">Learn about our process</Button>
                            </div>

                            {/* Interactive System Visual */}
                            <div className="relative h-[300px] md:h-[400px] flex items-center justify-center scale-[0.6] sm:scale-75 md:scale-100 origin-center transition-transform duration-500">
                                {/* Orbit Rings */}
                                <div className="absolute w-[300px] h-[300px] border border-border-subtle rounded-full animate-spin [animation-duration:20s]" />
                                <div className="absolute w-[200px] h-[200px] border border-border-subtle/50 rounded-full animate-spin [animation-duration:15s] direction-reverse" />

                                {/* Central Core */}
                                <div className="relative z-20 w-24 h-24 bg-bg-surface rounded-full border border-accent-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(124,231,208,0.2)]">
                                    <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center animate-pulse">
                                        <Target className="text-accent-primary w-8 h-8" />
                                    </div>
                                </div>

                                {/* Orbiting Nodes */}
                                {features.map((item, i) => {
                                    // Position calculation based on angle
                                    const angle = (i * 90) * (Math.PI / 180);
                                    const radius = 140; // distance from center
                                    const x = Math.cos(angle) * radius;
                                    const y = Math.sin(angle) * radius;
                                    const isHovered = hoveredFeature === i;

                                    return (
                                        <div
                                            key={i}
                                            className={`absolute transition-all duration-500 ease-out cursor-pointer z-20 ${isHovered ? 'scale-110 z-30' : 'scale-100'}`}
                                            style={{
                                                top: '50%',
                                                left: '50%',
                                                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                            }}
                                            onMouseEnter={() => setHoveredFeature(i)}
                                            onMouseLeave={() => setHoveredFeature(null)}
                                        >
                                            <div className={`p-4 rounded-xl border backdrop-blur-md shadow-lg transition-colors ${isHovered
                                                ? 'bg-bg-surface border-accent-primary/50'
                                                : 'bg-bg-page/80 border-border-subtle'
                                                }`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isHovered ? 'bg-accent-primary text-black' : 'bg-bg-subtle text-text-muted'
                                                        }`}>
                                                        <item.icon size={16} />
                                                    </div>
                                                    <div className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isHovered ? 'w-auto opacity-100' : 'w-0 opacity-0 md:w-auto md:opacity-100'
                                                        }`}>
                                                        <p className="text-sm font-bold text-text-main">{item.title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What Our Clients Say - Seamless Marquee Reviews */}
            <section className="py-16 md:py-20 bg-bg-surface/10 border-y border-border-subtle relative overflow-hidden group/marquee">
                {/* Edge Masks for Smooth Fade */}
                <div className="absolute inset-y-0 left-0 w-12 md:w-32 bg-gradient-to-r from-bg-page to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-12 md:w-32 bg-gradient-to-l from-bg-page to-transparent z-10 pointer-events-none" />

                <div className="container mx-auto px-6 mb-12 md:mb-16 text-center relative z-20">
                    <h2 className="text-4xl md:text-7xl font-bold text-text-main mb-4 md:mb-6">What our Clients Say</h2>
                    <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto">Don't just take our word for it. Here's what visionary leaders say about working with us.</p>
                </div>

                {/* Row 1: Right to Left */}
                <div className="relative w-full overflow-hidden mb-6 flex group-hover/marquee:[animation-play-state:paused]">
                    <div className="flex shrink-0 animate-marquee space-x-6 px-3" style={{ animationDuration: '80s' }}>
                        {reviews.map((review, i) => <ReviewCard key={`r1-a-${i}`} review={review} />)}
                    </div>
                    <div className="flex shrink-0 animate-marquee space-x-6 px-3" style={{ animationDuration: '80s' }} aria-hidden="true">
                        {reviews.map((review, i) => <ReviewCard key={`r1-b-${i}`} review={review} />)}
                    </div>
                </div>

                {/* Row 2: Left to Right (Reverse) */}
                <div className="relative w-full overflow-hidden flex group-hover/marquee:[animation-play-state:paused]">
                    <div className="flex shrink-0 animate-marquee space-x-6 px-3" style={{ animationDuration: '80s', animationDirection: 'reverse' }}>
                        {reviews.map((review, i) => <ReviewCard key={`r2-a-${i}`} review={review} />)}
                    </div>
                    <div className="flex shrink-0 animate-marquee space-x-6 px-3" style={{ animationDuration: '80s', animationDirection: 'reverse' }} aria-hidden="true">
                        {reviews.map((review, i) => <ReviewCard key={`r2-b-${i}`} review={review} />)}
                    </div>
                </div>
            </section>

            {/* Ready to Evolve - CTA Section */}
            <section className="py-16 md:py-32 !mt-12 flex items-center justify-center relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] md:w-[600px] md:h-[300px] bg-accent-primary/5 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-accent-secondary/5 blur-[60px] rounded-full pointer-events-none" />

                <div ref={addToRefs} className="relative z-10 text-center space-y-8 opacity-0 translate-y-20 transition-all duration-1000 ease-out">
                    <p className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter text-text-main">
                        Ready to <span className="font-serif italic text-accent-secondary">evolve?</span>
                    </p>
                    <p className="text-lg md:text-xl text-muted max-w-lg mx-auto">
                        Let's build something extraordinary together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button onClick={() => navigate('/contact')} icon className="shadow-lg shadow-accent-primary/20">
                            Start Your Project
                        </Button>
                        <Button variant="outline" onClick={() => navigate('/solutions')}>
                            Explore Services
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
