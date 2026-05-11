import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { Testimonial } from '../types';

interface DbTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  company: string | null;
  avatar_url: string | null;
  rating: number;
  published: boolean;
  order_index: number;
}

function dbToTestimonial(row: DbTestimonial): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    author: row.author,
    role: row.role || undefined,
    company: row.company || undefined,
    avatar: row.avatar_url || undefined,
    rating: row.rating,
    published: row.published,
    order: row.order_index,
  };
}

export const testimonialService = {
  async getAllTestimonials(includeDrafts = false): Promise<Testimonial[]> {
    if (!isSupabaseConfigured) return [];
    try {
      let query = supabase.from('testimonials').select('*').order('order_index', { ascending: true });
      if (!includeDrafts) query = query.eq('published', true);

      const { data, error } = await query;
      if (error) throw error;
      return data ? data.map(dbToTestimonial) : [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  },
};
