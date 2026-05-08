import {
  Bot,
  Workflow,
  Code2,
  Palette,
  Megaphone,
  BrainCircuit,
  PenTool,
  Video,
  Cpu
} from 'lucide-react';
import { Service, CaseStudy, PricingTier, TeamMember } from './types';

export const NAV_ITEMS = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/solutions' },
  { label: 'Works', path: '/works' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
];

export const SERVICES: Service[] = [
  {
    id: 'ai-engineering',
    title: 'AI/ML Engineering',
    shortDescription: 'Custom LLMs and neural architectures.',
    fullDescription: 'We build bespoke AI models tailored to your enterprise data. From fine-tuning Llama 3 to deploying scalable RAG pipelines, our engineering ensures you stay ahead of the curve.',
    icon: Bot,
    color: 'text-emerald-400',
    features: ['Custom LLM Training', 'RAG Pipelines', 'Predictive Modeling'],
  },
  {
    id: 'agents-workflows',
    title: 'Agents & Workflows',
    shortDescription: 'Autonomous systems that work for you.',
    fullDescription: 'Deploy autonomous agents that handle complex workflows. We orchestrate multi-agent systems to automate customer support, data analysis, and operational logistics.',
    icon: Workflow,
    color: 'text-blue-400',
    features: ['Multi-Agent Systems', 'Process Automation', 'Intelligent RPA'],
  },
  {
    id: 'web-app-dev',
    title: 'Web & App Dev',
    shortDescription: 'Scalable, modern digital products.',
    fullDescription: 'Full-stack development using the latest frameworks. We build performant, accessible, and scalable web and mobile applications designed for growth.',
    icon: Code2,
    color: 'text-purple-400',
    features: ['React & Next.js', 'Native Mobile Apps', 'Cloud Infrastructure'],
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX Design',
    shortDescription: 'Interfaces that humans love.',
    fullDescription: 'User-centric design that converts. We craft intuitive interfaces and seamless experiences, backed by deep user research and modern aesthetic principles.',
    icon: Palette,
    color: 'text-pink-400',
    features: ['Design Systems', 'User Research', 'Prototyping'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    shortDescription: 'Data-driven growth strategies.',
    fullDescription: 'Amplify your reach with AI-enhanced marketing campaigns. We utilize predictive analytics to optimize ad spend and target the right audience.',
    icon: Megaphone,
    color: 'text-orange-400',
    features: ['SEO & SEM', 'Content Strategy', 'Growth Hacking'],
  },
  {
    id: 'data-science',
    title: 'Data Science',
    shortDescription: 'Turning raw data into insights.',
    fullDescription: 'Unlock the value of your data. Our data scientists employ advanced statistical methods and machine learning to uncover trends and drive decision-making.',
    icon: BrainCircuit,
    color: 'text-cyan-400',
    features: ['Big Data Analysis', 'Visualization', 'ML Ops'],
  },
  {
    id: 'graphics-design',
    title: 'Graphics Design',
    shortDescription: 'Visual identities that stand out.',
    fullDescription: 'From branding to marketing collateral, our graphic designers create visually stunning assets that communicate your brand message effectively.',
    icon: PenTool,
    color: 'text-yellow-400',
    features: ['Branding', 'Illustration', 'Marketing Assets'],
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    shortDescription: 'Compelling storytelling in motion.',
    fullDescription: 'High-quality video production and editing. We create engaging video content for social media, ads, and corporate communications.',
    icon: Video,
    color: 'text-red-400',
    features: ['Motion Graphics', 'Post-Production', 'Sound Design'],
  },
  {
    id: 'robotics',
    title: 'Robotics Engineering',
    shortDescription: 'Intelligent hardware solutions.',
    fullDescription: 'Bridging digital intelligence with physical action. We build autonomous robotic systems, integrating advanced computer vision, path planning, and hardware control.',
    icon: Cpu,
    color: 'text-indigo-400',
    features: ['ROS Integration', 'Computer Vision', 'Embedded Systems'],
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  // Demo projects removed - all projects now come from Supabase database
  // Add your real projects through the admin panel
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Starter',
    price: '$2,500',
    description: 'Perfect for MVPs and small projects.',
    features: ['1 Dedicated Developer', 'Basic UI/UX Audit', 'Weekly Sprints', 'Shared Project Manager'],
  },
  {
    name: 'Professional',
    price: '$8,000',
    description: 'For growing companies needing velocity.',
    features: ['3 Dedicated Experts', 'Full Design System', 'Daily Standups', 'Priority Support', 'Cloud Architecture'],
    recommended: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale digital transformation.',
    features: ['Full Engineering Team', '24/7 SLA Support', 'On-premise Deployment', 'Custom AI Training', 'Executive Strategy'],
  },
];

export const TEAM: TeamMember[] = [
  { name: 'Alex Rivera', role: 'Founder & CEO', image: 'https://picsum.photos/200/200?random=10' },
  { name: 'Sarah Chen', role: 'Head of AI', image: 'https://picsum.photos/200/200?random=11' },
  { name: 'Marcus Jo', role: 'Design Director', image: 'https://picsum.photos/200/200?random=12' },
  { name: 'Priya Patel', role: 'CTO', image: 'https://picsum.photos/200/200?random=13' },
];