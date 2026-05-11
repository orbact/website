import { createClient } from '@supabase/supabase-js';
import { CaseStudy, PricingTier, Service, TeamMember } from '../types';
import { DEFAULT_PROJECT_IMAGE, DEFAULT_TEAM_IMAGE, ICON_MAP } from './cmsMaps';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-anon-key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface DbProject {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  image_alt: string | null;
  link: string | null;
  huggingface_link: string | null;
  stats: { label: string; value: string }[] | null;
  published: boolean;
  created_at: string;
  updated_at: string;
  is_featured: boolean;
  order_index: number;
}

export interface DbService {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  icon_name: string;
  color: string;
  features: string[] | null;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface DbPricingTier {
  id: string;
  name: string;
  price: string;
  description: string | null;
  features: string[] | null;
  recommended: boolean;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface DbTeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  image_url: string | null;
  image_alt: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export function dbProjectToCaseStudy(dbProject: DbProject): CaseStudy {
  return {
    id: dbProject.id,
    slug: dbProject.slug || dbProject.id,
    title: dbProject.title,
    category: dbProject.category,
    description: dbProject.description,
    image: dbProject.image_url || DEFAULT_PROJECT_IMAGE,
    imageAlt: dbProject.image_alt || dbProject.title,
    link: dbProject.link || undefined,
    huggingFaceLink: dbProject.huggingface_link || undefined,
    stats: dbProject.stats || [],
    isSelected: dbProject.is_featured,
    published: dbProject.published,
    order: dbProject.order_index,
  };
}

export function caseStudyToDbProject(caseStudy: Partial<CaseStudy>): Partial<DbProject> {
  return stripUndefined({
    slug: caseStudy.slug,
    title: caseStudy.title,
    category: caseStudy.category,
    description: caseStudy.description,
    image_url: caseStudy.image,
    image_alt: caseStudy.imageAlt,
    link: caseStudy.link || null,
    huggingface_link: caseStudy.huggingFaceLink || null,
    stats: caseStudy.stats || [],
    is_featured: caseStudy.isSelected || false,
    published: caseStudy.published ?? true,
    order_index: caseStudy.order,
  });
}

export function dbServiceToService(dbService: DbService): Service {
  return {
    id: dbService.slug || dbService.id,
    dbId: dbService.id,
    slug: dbService.slug,
    title: dbService.title,
    shortDescription: dbService.short_description || '',
    fullDescription: dbService.full_description || '',
    icon: ICON_MAP[dbService.icon_name] || ICON_MAP.Bot,
    iconName: dbService.icon_name,
    color: dbService.color,
    features: dbService.features || [],
    published: dbService.published,
    order: dbService.order_index,
  };
}

export function serviceToDbService(service: Partial<Service>): Partial<DbService> {
  return stripUndefined({
    slug: service.slug || service.id,
    title: service.title,
    short_description: service.shortDescription,
    full_description: service.fullDescription,
    icon_name: service.iconName || 'Bot',
    color: service.color || 'text-emerald-400',
    features: service.features || [],
    published: service.published ?? true,
    order_index: service.order,
  });
}

export function dbTierToPricingTier(dbTier: DbPricingTier): PricingTier {
  return {
    id: dbTier.id,
    name: dbTier.name,
    price: dbTier.price,
    description: dbTier.description || '',
    features: dbTier.features || [],
    recommended: dbTier.recommended,
    published: dbTier.published,
    order: dbTier.order_index,
  };
}

export function pricingTierToDbTier(tier: Partial<PricingTier>): Partial<DbPricingTier> {
  return stripUndefined({
    name: tier.name,
    price: tier.price,
    description: tier.description,
    features: tier.features || [],
    recommended: tier.recommended || false,
    published: tier.published ?? true,
    order_index: tier.order,
  });
}

export function dbMemberToTeamMember(dbMember: DbTeamMember): TeamMember {
  return {
    id: dbMember.id,
    name: dbMember.name,
    role: dbMember.role,
    image: dbMember.image_url || DEFAULT_TEAM_IMAGE,
    imageAlt: dbMember.image_alt || dbMember.name,
    bio: dbMember.bio || undefined,
    linkedin: dbMember.linkedin_url || undefined,
    twitter: dbMember.twitter_url || undefined,
    published: dbMember.published,
    order: dbMember.order_index,
  };
}

export function teamMemberToDbMember(member: Partial<TeamMember>): Partial<DbTeamMember> {
  return stripUndefined({
    name: member.name,
    role: member.role,
    bio: member.bio || null,
    image_url: member.image || null,
    image_alt: member.imageAlt,
    linkedin_url: member.linkedin || null,
    twitter_url: member.twitter || null,
    published: member.published ?? true,
    order_index: member.order,
  });
}

export function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  Object.keys(value).forEach((key) => {
    if (value[key] === undefined) {
      delete value[key];
    }
  });
  return value;
}
