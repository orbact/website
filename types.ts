import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface Service {
  id: string;
  dbId?: string;
  slug?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: LucideIcon;
  iconName?: string;
  color: string;
  features: string[];
  published?: boolean;
  order?: number;
}

export interface CaseStudy {
  id: string;
  slug?: string;
  title: string;
  category: string;
  image: string;
  imageAlt?: string;
  description: string;
  stats: { label: string; value: string }[];
  link?: string;
  huggingFaceLink?: string;
  isSelected?: boolean;
  published?: boolean;
  order?: number;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  image: string;
  imageAlt?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  published?: boolean;
  order?: number;
}

export interface PricingTier {
  id?: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  published?: boolean;
  order?: number;
}

export interface Testimonial {
  id?: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating: number;
  published?: boolean;
  order?: number;
}
