import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: LucideIcon;
  color: string;
  features: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  stats: { label: string; value: string }[];
  link?: string;
  huggingFaceLink?: string;
  isSelected?: boolean;
}

export interface TeamMember {
  id?: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
}