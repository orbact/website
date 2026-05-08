import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, Github, Twitter, Linkedin, ArrowRight, Mail, ChevronDown, ArrowUpRight, Sparkles, Shield, Lock, LogOut } from 'lucide-react';
import { NAV_ITEMS, SERVICES, CASE_STUDIES } from '../constants';
import Button from './Button';
import Logo from './Logo';
import Chatbot from './Chatbot';
import { adminAuth } from '../lib/adminAuth';
import ReCAPTCHA from 'react-google-recaptcha';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Admin State
    const [isAdmin, setIsAdmin] = useState(adminAuth.isAdmin());
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    // Navigation Sliding Effect State
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const navRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});
    const headerRef = useRef<HTMLElement>(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Initialize theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('light', savedTheme === 'light');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('light', newTheme === 'light');
    };

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Increased scroll threshold for a smoother transition from large header
            setIsScrolled(currentScroll > 50);
            setScrollProgress((currentScroll / scrollHeight) * 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Recalculate sliding indicator position
    const updateIndicator = () => {
        const activePath = location.pathname;
        const activeItem = NAV_ITEMS.find(item =>
            item.path === '/' ? activePath === '/' : activePath.startsWith(item.path)
        );

        const currentRef = activeItem ? navRefs.current[activeItem.path] : null;

        if (currentRef) {
            setIndicatorStyle({
                left: currentRef.offsetLeft,
                width: currentRef.offsetWidth,
                opacity: 1
            });
        } else {
            setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        }
    };

    useEffect(() => {
        updateIndicator();
        window.addEventListener('resize', updateIndicator);

        // Slight delay to ensure refs are populated
        const timeout = setTimeout(updateIndicator, 100);

        return () => {
            window.removeEventListener('resize', updateIndicator);
            clearTimeout(timeout);
        };
    }, [location.pathname]);

    useEffect(() => {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        window.scrollTo(0, 0);
    }, [location]);

    // Mega Menu Helpers
    const handleMouseEnter = (path: string) => {
        if (path === '/solutions') {
            setActiveDropdown(path);
        } else {
            setActiveDropdown(null);
        }
    };

    const handleMouseLeaveNav = (e: React.MouseEvent) => {
        // Only close if we're not focusing on an element inside the nav (for keyboard users)
        if (!e.currentTarget.contains(document.activeElement)) {
            setActiveDropdown(null);
        }
    };

    // Close dropdown on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveDropdown(null);
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Admin Handlers
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!recaptchaToken) {
            alert('Please complete the reCAPTCHA verification');
            return;
        }

        const success = adminAuth.login(adminPassword);
        if (success) {
            setIsAdmin(true);
            setShowAdminLogin(false);
            setAdminPassword('');
            setRecaptchaToken(null);
            recaptchaRef.current?.reset();
        } else {
            alert('Invalid admin password');
            setRecaptchaToken(null);
            recaptchaRef.current?.reset();
        }
    };

    const handleAdminLogout = () => {
        adminAuth.logout();
        setIsAdmin(false);
    };

    // Keyboard Shortcut: Ctrl+Alt+O to open admin login
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'o') {
                e.preventDefault();
                if (!isAdmin) {
                    setShowAdminLogin(true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isAdmin]);

    return (
        <div className="min-h-screen bg-bg-page text-text-main font-sans selection:bg-accent-secondary selection:text-white overflow-x-hidden transition-colors duration-300 flex flex-col">

            {/* Skip to Content - Accessibility */}
            <a href="#main-content" className="skip-to-content">
                Skip to main content
            </a>

            {/* Navigation Bar */}
            <nav
                ref={headerRef}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isScrolled
                    ? 'bg-bg-page/80 backdrop-blur-xl py-4 border-b border-border-subtle'
                    : 'bg-transparent border-b border-transparent py-6 md:py-10'
                    }`}
                onMouseLeave={handleMouseLeaveNav}
            >
                {/* Scroll Progress Bar */}
                <div
                    className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary transition-all duration-100 ease-out z-50 opacity-50"
                    style={{ width: `${scrollProgress}%` }}
                />

                <div className="container mx-auto px-4 md:px-6 flex items-center justify-between relative">

                    {/* Logo - Matches Footer Size Initially */}
                    <div className="flex items-center gap-3 md:gap-4 cursor-pointer z-50 group" onClick={() => navigate('/')}>
                        <div className={`relative flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:rotate-180 ${isScrolled ? 'w-10 h-10' : 'w-10 h-10 md:w-12 md:h-12'}`}>
                            <div className="absolute inset-0 bg-accent-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Logo className="w-full h-full text-text-main relative z-10" />
                        </div>
                        <span className={`font-bold tracking-tight text-text-main relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isScrolled ? 'text-2xl' : 'text-3xl md:text-4xl'}`}>
                            Orbact
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        </span>
                    </div>

                    {/* Desktop Nav - Centered Island Style */}
                    <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
                        <div className={`flex items-center gap-2 relative px-2 py-2 rounded-full transition-all duration-500 ${isScrolled
                            ? 'bg-bg-surface/50 border border-border-subtle shadow-lg backdrop-blur-md'
                            : 'bg-bg-page/40 border border-white/5 backdrop-blur-sm'
                            }`}>

                            {/* Sliding Pill Indicator */}
                            <div
                                className="absolute top-2 bottom-2 bg-text-main/10 rounded-full transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)"
                                style={{
                                    left: indicatorStyle.left,
                                    width: indicatorStyle.width,
                                    opacity: indicatorStyle.opacity
                                }}
                            />

                            {NAV_ITEMS.map((item) => (
                                <div 
                                    key={item.path} 
                                    onMouseEnter={() => handleMouseEnter(item.path)}
                                    // Keep menu open when focusing inside
                                    onFocus={() => handleMouseEnter(item.path)}
                                >
                                    <NavLink
                                        to={item.path}
                                        ref={(el) => { navRefs.current[item.path] = el; }}
                                        className={({ isActive }) =>
                                            `relative z-10 px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 flex items-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-accent-primary ${isActive
                                                ? 'text-text-main'
                                                : 'text-text-muted hover:text-text-main'
                                            }`
                                        }
                                        // Accessibility Attributes
                                        aria-haspopup={item.path === '/solutions' ? 'true' : undefined}
                                        aria-expanded={item.path === '/solutions' ? activeDropdown === '/solutions' : undefined}
                                    >
                                        {item.label}
                                        {item.path === '/solutions' && (
                                            <ChevronDown
                                                size={12}
                                                className={`transition-transform duration-300 opacity-50 ${activeDropdown === '/solutions' ? 'rotate-180' : ''}`}
                                            />
                                        )}
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {/* Admin Badge/Controls */}
                        {isAdmin && (
                            <div className="flex items-center gap-2">
                                <div className="px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/30 backdrop-blur-md flex items-center gap-2">
                                    <Shield size={14} className="text-accent-primary" />
                                    <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider">Admin</span>
                                </div>
                                <button
                                    onClick={handleAdminLogout}
                                    className="p-2 rounded-full bg-bg-surface/50 border border-border-subtle hover:border-red-400/50 hover:bg-red-400/10 backdrop-blur-md transition-all group outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                                    title="Logout"
                                    aria-label="Logout Admin"
                                >
                                    <LogOut size={14} className="text-text-muted group-hover:text-red-400 transition-colors" />
                                </button>
                            </div>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="w-12 h-12 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-bg-surface/50 border border-transparent hover:border-border-subtle transition-all"
                            aria-label="Toggle Theme"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <NavLink to="/contact">
                            <Button variant="primary" className={`transition-all duration-500 ${isScrolled ? 'h-10 px-6 text-sm' : 'h-12 px-8 text-base'} shadow-lg shadow-accent-primary/5 hover:shadow-accent-primary/20`}>
                                Let's Talk
                            </Button>
                        </NavLink>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-text-main hover:bg-bg-surface/50 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
                        </button>
                        <button
                            className="z-50 p-2 text-text-main relative group"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <div className="w-8 h-8 flex flex-col justify-center items-end gap-1.5">
                                <div className={`w-8 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                                <div className={`w-8 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* --- Mega Menu (Services) --- */}
                <div
                    className={`absolute top-full left-0 w-full bg-bg-page/95 backdrop-blur-2xl border-b border-border-subtle shadow-2xl overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] origin-top ${activeDropdown === '/solutions' ? 'opacity-100 max-h-[600px] visible' : 'opacity-0 max-h-0 invisible'
                        }`}
                    onMouseEnter={() => setActiveDropdown('/solutions')}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <div className="container mx-auto px-6 py-12">
                        <div className="grid grid-cols-12 gap-12">
                            {/* Intro Column */}
                            <div className="col-span-3 pr-8 border-r border-border-subtle">
                                <h3 className="text-lg font-bold text-text-main mb-4 flex items-center gap-2">
                                    <Sparkles size={16} className="text-accent-primary" />
                                    Our Expertise
                                </h3>
                                <p className="text-sm text-muted leading-relaxed mb-6">
                                    We architect comprehensive digital ecosystems. From neural networks to pixel-perfect interfaces, explore our core capabilities.
                                </p>
                                <NavLink to="/solutions" className="text-sm font-bold text-accent-primary flex items-center gap-2 hover:gap-4 transition-all">
                                    View All Services <ArrowRight size={14} />
                                </NavLink>
                            </div>

                            {/* Services Grid */}
                            <div className="col-span-6 grid grid-cols-2 gap-x-8 gap-y-6">
                                {SERVICES.slice(0, 6).map((service) => (
                                    <NavLink
                                        key={service.id}
                                        to={`/solutions/${service.id}`}
                                        className="group flex items-start gap-4 p-3 rounded-xl hover:bg-bg-surface/50 transition-colors"
                                    >
                                        <div className={`mt-1 w-8 h-8 rounded-lg ${service.color.replace('text-', 'bg-')}/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                                            <service.icon size={16} className={service.color} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-text-main group-hover:text-accent-primary transition-colors flex items-center gap-1">
                                                {service.title}
                                                <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 translate-x-1" />
                                            </h4>
                                            <p className="text-xs text-muted mt-1 line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                                {service.shortDescription}
                                            </p>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>

                            {/* Featured Card */}
                            <div className="col-span-3 pl-8 border-l border-border-subtle">
                                {CASE_STUDIES && CASE_STUDIES.length > 0 ? (
                                    <div className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer" onClick={() => navigate('/works')}>
                                        <img src={CASE_STUDIES[0].image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Featured Work" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-0 left-0 p-4">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-accent-primary bg-black/50 backdrop-blur-md px-2 py-1 rounded-md mb-2 inline-block">
                                                Featured Case Study
                                            </span>
                                            <h4 className="text-white font-bold text-sm">{CASE_STUDIES[0].title}</h4>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative rounded-2xl overflow-hidden aspect-video group cursor-pointer bg-bg-surface/50 border border-border-subtle flex items-center justify-center" onClick={() => navigate('/works')}>
                                        <div className="text-center p-6">
                                            <ArrowRight size={32} className="text-accent-primary mx-auto mb-3" />
                                            <h4 className="text-text-main font-bold text-sm mb-1">View Projects</h4>
                                            <p className="text-xs text-muted">Explore our portfolio</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Bottom Gradient Line */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-primary/50 to-transparent" />
                </div>

                {/* --- Mobile Menu Overlay --- */}
                <div
                    className={`fixed inset-0 z-40 bg-bg-page/95 backdrop-blur-2xl transition-all duration-500 ease-in-out flex flex-col ${mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'
                        }`}
                    style={{ top: '0' }}
                    aria-hidden={!mobileMenuOpen}
                    role="dialog"
                    aria-label="Navigation menu"
                >
                    {/* Background Decor */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />

                    <div className="container mx-auto px-6 pt-28 md:pt-36 pb-12 flex flex-col h-full overflow-y-auto">
                        <div className="flex-1 flex flex-col justify-center space-y-4 md:space-y-6">
                            {NAV_ITEMS.map((item, idx) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                text-3xl sm:text-4xl md:text-6xl font-black tracking-tight transition-all duration-300 transform
                                ${mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}
                                ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary' : 'text-text-main hover:text-text-muted'}
                            `}
                                    style={{ transitionDelay: `${idx * 100}ms` }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="text-xs md:text-sm font-mono text-muted mr-4 opacity-50 font-normal">0{idx + 1}</span>
                                    {item.label}
                                </NavLink>
                            ))}
                        </div>

                        <div className={`mt-8 md:mt-12 pt-8 md:pt-12 border-t border-border-subtle grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700 delay-300 ${mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div>
                                <h4 className="text-sm font-bold text-muted uppercase tracking-widest mb-4">Contact</h4>
                                <a href="mailto:hello@orbact.com" className="text-xl text-text-main font-medium hover:text-accent-primary transition-colors block mb-2">hello@orbact.com</a>
                                <p className="text-muted">San Francisco, CA</p>
                            </div>
                            <div className="flex flex-col items-start gap-4">
                                <h4 className="text-sm font-bold text-muted uppercase tracking-widest mb-2">Socials</h4>
                                <div className="flex gap-4">
                                    {[Twitter, Github, Linkedin].map((Icon, i) => (
                                        <a key={i} href="#" className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center text-text-main hover:bg-bg-surface hover:text-accent-primary transition-all">
                                            <Icon size={20} />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-4 md:mt-8">
                                <Button onClick={() => { navigate('/contact'); setMobileMenuOpen(false); }} className="w-full md:w-auto h-12 md:h-14 text-base md:text-lg" icon>
                                    Start a Project
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main id="main-content" className="flex-grow" role="main">
                {children}
            </main>

            {/* Comprehensive Footer */}
            <footer className="relative bg-bg-page border-t border-border-subtle overflow-hidden">
                {/* Decorative Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-50" />
                <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[800px] h-[800px] bg-accent-secondary/5 rounded-full blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-6 pt-16 pb-12 relative z-10">

                    {/* Top Row: Brand & Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
                        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="relative w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                                <Logo className="w-full h-full text-text-main" />
                            </div>
                            <span className="text-4xl font-bold text-text-main tracking-tight">Orbact</span>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                            <div className="flex gap-4 w-full sm:w-auto justify-center sm:justify-start">
                                {[
                                    { icon: Twitter, href: "https://x.com/Orbactai" },
                                    { icon: Github, href: "https://github.com/orbact" },
                                    { icon: Linkedin, href: "https://www.linkedin.com/company/orbact" }
                                ].map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-12 h-12 rounded-full border border-border-subtle flex items-center justify-center hover:bg-text-main hover:text-bg-page hover:border-text-main transition-all duration-300 group bg-bg-surface/50 backdrop-blur-sm"
                                    >
                                        <social.icon size={20} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                ))}
                            </div>
                            <Button onClick={() => navigate('/contact')} className="h-12 px-8 text-base shadow-lg shadow-accent-primary/20 w-full sm:w-auto" icon>
                                Start a Project
                            </Button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-border-subtle mb-16 opacity-50" />

                    {/* Links Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-32">
                        {/* Brand Description & Status */}
                        <div className="col-span-1 md:col-span-4 lg:col-span-5 space-y-8 pr-0 lg:pr-12">
                            <p className="text-muted text-lg leading-relaxed">
                                Orbact combines strategy, design, and engineering to build digital products that define the future. We empower visionaries with the technology of tomorrow.
                            </p>
                            <div className="flex items-center gap-2 text-sm font-bold text-green-500 bg-green-500/10 px-4 py-2 rounded-full w-fit border border-green-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                All Systems Operational
                            </div>
                        </div>

                        {/* Sitemap */}
                        <div className="col-span-1 md:col-span-2 lg:col-span-2">
                            <h4 className="font-bold text-text-main mb-8 text-lg">Explore</h4>
                            <ul className="space-y-4 text-muted">
                                {NAV_ITEMS.map(item => (
                                    <li key={item.path}>
                                        <NavLink to={item.path} className="hover:text-accent-primary transition-colors flex items-center gap-2 group">
                                            <span className="w-0 group-hover:w-2 transition-all h-[1px] bg-accent-primary"></span>
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="col-span-1 md:col-span-3 lg:col-span-2">
                            <h4 className="font-bold text-text-main mb-8 text-lg">Services</h4>
                            <ul className="space-y-4 text-muted">
                                <li><NavLink to="/solutions/ai-engineering" className="hover:text-accent-primary transition-colors">AI Engineering</NavLink></li>
                                <li><NavLink to="/solutions/ui-ux-design" className="hover:text-accent-primary transition-colors">UI/UX Design</NavLink></li>
                                <li><NavLink to="/solutions/web-app-dev" className="hover:text-accent-primary transition-colors">Web & App Dev</NavLink></li>
                                <li><NavLink to="/solutions" className="text-accent-secondary hover:text-text-main transition-colors text-sm mt-2 block font-medium">View all &rarr;</NavLink></li>
                            </ul>
                        </div>

                        {/* Contact/Legal */}
                        <div className="col-span-1 md:col-span-3 lg:col-span-3">
                            <h4 className="font-bold text-text-main mb-8 text-lg">Contact</h4>
                            <ul className="space-y-4 text-muted">
                                <li>
                                    <a href="mailto:hello@orbact.com" className="hover:text-accent-primary transition-colors flex items-center gap-2">
                                        <Mail size={16} /> hello@orbact.com
                                    </a>
                                </li>
                                <li className="pt-2 text-sm opacity-60 leading-relaxed">
                                    123 Market St, Floor 4<br />
                                    San Francisco, CA 94103
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border-subtle relative z-20">
                        <p className="text-sm text-muted">
                            &copy; {new Date().getFullYear()} Orbact Inc. All rights reserved.
                        </p>

                        <div className="flex gap-8 mt-4 md:mt-0 text-sm text-muted">
                            <a href="#" className="hover:text-text-main transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-text-main transition-colors">Terms of Service</a>
                        </div>
                    </div>

                    {/* Massive Watermark Effect */}
                    <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden">
                        <span className="text-[18vw] font-black leading-none text-text-main opacity-[0.02] tracking-tighter">
                            ORBACT
                        </span>
                    </div>
                </div>
            </footer>

            {/* Chatbot moved outside footer for proper fixed positioning on mobile */}
            <Chatbot />

            {/* Admin Login Modal - Global */}
            {showAdminLogin && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Admin Login">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdminLogin(false)} />
                    <div className="relative bg-bg-card border border-border-subtle rounded-2xl w-full max-w-md shadow-2xl p-6 md:p-8 animate-fade-in-up">
                        <button
                            onClick={() => setShowAdminLogin(false)}
                            className="absolute top-4 right-4 p-2 text-muted hover:text-text-main hover:bg-bg-surface rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 rounded-full bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center mb-4">
                                <Shield size={28} className="text-accent-primary" />
                            </div>
                            <h2 className="text-2xl font-bold text-text-main mb-2">Admin Access</h2>
                            <p className="text-sm text-muted">Press Ctrl+Alt+O to access admin panel</p>
                        </div>

                        <form onSubmit={handleAdminLogin} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-muted">Password</label>
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    className="w-full bg-bg-page border border-border-subtle rounded-lg px-4 py-3 text-sm text-text-main focus:border-accent-primary focus:outline-none"
                                    placeholder="Enter admin password"
                                    required
                                    autoFocus
                                />
                            </div>

                            {/* Google reCAPTCHA */}
                            <div className="flex justify-center">
                                <ReCAPTCHA
                                    ref={recaptchaRef}
                                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY || ''}
                                    onChange={(token) => setRecaptchaToken(token)}
                                    theme="dark"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full justify-center"
                                disabled={!recaptchaToken}
                            >
                                <Lock size={16} />
                                Login as Admin
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;