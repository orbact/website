import { supabase } from '../lib/supabase';
import { PricingTier } from '../types';

export interface DbPricingTier {
    id: string;
    name: string;
    price: string;
    description: string | null;
    features: string[];
    recommended: boolean;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export interface DbFAQ {
    id: string;
    question: string;
    answer: string;
    page: string;
    order_index: number;
    created_at: string;
}

export const pricingService = {
    // PRICING TIERS
    async getAllTiers(): Promise<PricingTier[]> {
        try {
            const { data, error } = await supabase
                .from('pricing_tiers')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) {
                console.error('Error fetching pricing tiers:', error);
                return [];
            }

            return data ? data.map(dbTierToPricingTier) : [];
        } catch (error) {
            console.error('Exception fetching pricing tiers:', error);
            return [];
        }
    },

    async createTier(tier: Partial<PricingTier>): Promise<PricingTier | null> {
        try {
            const { data, error } = await supabase
                .from('pricing_tiers')
                .insert({
                    name: tier.name,
                    price: tier.price,
                    description: tier.description,
                    features: tier.features || [],
                    recommended: tier.recommended || false,
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating pricing tier:', error);
                return null;
            }

            return data ? dbTierToPricingTier(data) : null;
        } catch (error) {
            console.error('Exception creating pricing tier:', error);
            return null;
        }
    },

    async updateTier(id: string, updates: Partial<PricingTier>): Promise<PricingTier | null> {
        try {
            const { data, error } = await supabase
                .from('pricing_tiers')
                .update({
                    name: updates.name,
                    price: updates.price,
                    description: updates.description,
                    features: updates.features,
                    recommended: updates.recommended,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating pricing tier:', error);
                return null;
            }

            return data ? dbTierToPricingTier(data) : null;
        } catch (error) {
            console.error('Exception updating pricing tier:', error);
            return null;
        }
    },

    async deleteTier(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('pricing_tiers')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting pricing tier:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Exception deleting pricing tier:', error);
            return false;
        }
    },

    // FAQs
    async getAllFAQs(page: string = 'pricing'): Promise<DbFAQ[]> {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .select('*')
                .eq('page', page)
                .order('order_index', { ascending: true });

            if (error) {
                console.error('Error fetching FAQs:', error);
                return [];
            }

            return data || [];
        } catch (error) {
            console.error('Exception fetching FAQs:', error);
            return [];
        }
    },

    async createFAQ(faq: { question: string; answer: string; page?: string }): Promise<DbFAQ | null> {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .insert({
                    question: faq.question,
                    answer: faq.answer,
                    page: faq.page || 'pricing',
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating FAQ:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Exception creating FAQ:', error);
            return null;
        }
    },

    async updateFAQ(id: string, updates: { question?: string; answer?: string }): Promise<DbFAQ | null> {
        try {
            const { data, error } = await supabase
                .from('faqs')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating FAQ:', error);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Exception updating FAQ:', error);
            return null;
        }
    },

    async deleteFAQ(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('faqs')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting FAQ:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Exception deleting FAQ:', error);
            return false;
        }
    },
};

function dbTierToPricingTier(dbTier: DbPricingTier): PricingTier {
    return {
        name: dbTier.name,
        price: dbTier.price,
        description: dbTier.description || '',
        features: dbTier.features,
        recommended: dbTier.recommended,
    };
}
