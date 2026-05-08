import { createClient } from '@supabase/supabase-js';
import { CaseStudy } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables. Please check .env.local file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Database types
export interface DbProject {
    id: string;
    title: string;
    category: string;
    description: string;
    image_url: string | null;
    link: string | null;
    huggingface_link: string | null;
    stats: { label: string; value: string }[];
    created_at: string;
    updated_at: string;
    is_featured: boolean;
    order: number;
}

// Helper to convert DB project to CaseStudy type
export function dbProjectToCaseStudy(dbProject: DbProject): CaseStudy {
    return {
        id: dbProject.id,
        title: dbProject.title,
        category: dbProject.category,
        description: dbProject.description,
        image: dbProject.image_url || `https://picsum.photos/800/600?random=${Math.random()}`,
        link: dbProject.link || undefined,
        huggingFaceLink: dbProject.huggingface_link || undefined,
        stats: dbProject.stats,
        isSelected: dbProject.is_featured,
    };
}

// Helper to convert CaseStudy to DB project format
export function caseStudyToDbProject(caseStudy: Partial<CaseStudy>): Partial<DbProject> {
    return {
        title: caseStudy.title,
        category: caseStudy.category,
        description: caseStudy.description,
        image_url: caseStudy.image,
        link: caseStudy.link || null,
        huggingface_link: caseStudy.huggingFaceLink || null,
        stats: caseStudy.stats || [],
        is_featured: caseStudy.isSelected || false,
    };
}
