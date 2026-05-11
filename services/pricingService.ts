import { dbTierToPricingTier, isSupabaseConfigured, pricingTierToDbTier, stripUndefined, supabase } from '../lib/supabase';
import { PricingTier } from '../types';

export interface DbFAQ {
  id: string;
  question: string;
  answer: string;
  page: string;
  published: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const pricingService = {
  async getAllTiers(includeDrafts = false): Promise<PricingTier[]> {
    if (!isSupabaseConfigured) return [];
    try {
      let query = supabase.from('pricing_tiers').select('*').order('order_index', { ascending: true });
      if (!includeDrafts) query = query.eq('published', true);

      const { data, error } = await query;
      if (error) throw error;
      return data ? data.map(dbTierToPricingTier) : [];
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
      return [];
    }
  },

  async createTier(tier: Partial<PricingTier>): Promise<PricingTier | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .insert(pricingTierToDbTier(tier))
        .select()
        .single();

      if (error) throw error;
      return data ? dbTierToPricingTier(data) : null;
    } catch (error) {
      console.error('Error creating pricing tier:', error);
      return null;
    }
  },

  async updateTier(id: string, updates: Partial<PricingTier>): Promise<PricingTier | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .update(stripUndefined({ ...pricingTierToDbTier(updates), updated_at: new Date().toISOString() }))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbTierToPricingTier(data) : null;
    } catch (error) {
      console.error('Error updating pricing tier:', error);
      return null;
    }
  },

  async deleteTier(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('pricing_tiers').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting pricing tier:', error);
      return false;
    }
  },

  async getAllFAQs(page = 'pricing', includeDrafts = false): Promise<DbFAQ[]> {
    if (!isSupabaseConfigured) return [];
    try {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('page', page)
        .order('order_index', { ascending: true });

      if (!includeDrafts) query = query.eq('published', true);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }
  },

  async createFAQ(faq: { question: string; answer: string; page?: string; published?: boolean }): Promise<DbFAQ | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('faqs')
        .insert({
          question: faq.question,
          answer: faq.answer,
          page: faq.page || 'pricing',
          published: faq.published ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return null;
    }
  },

  async updateFAQ(id: string, updates: Partial<DbFAQ>): Promise<DbFAQ | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('faqs')
        .update(stripUndefined({ ...updates, updated_at: new Date().toISOString() }))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return null;
    }
  },

  async deleteFAQ(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return false;
    }
  },
};
