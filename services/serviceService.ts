import { dbServiceToService, isSupabaseConfigured, serviceToDbService, stripUndefined, supabase } from '../lib/supabase';
import { Service } from '../types';

export const serviceService = {
  async getAllServices(includeDrafts = false): Promise<Service[]> {
    if (!isSupabaseConfigured) return [];
    try {
      let query = supabase
        .from('services')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (!includeDrafts) query = query.eq('published', true);

      const { data, error } = await query;
      if (error) throw error;
      return data ? data.map(dbServiceToService) : [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      return data ? dbServiceToService(data) : null;
    } catch (error) {
      console.error('Error fetching service:', error);
      return null;
    }
  },

  async createService(service: Partial<Service>): Promise<Service | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('services')
        .insert(serviceToDbService(service))
        .select()
        .single();

      if (error) throw error;
      return data ? dbServiceToService(data) : null;
    } catch (error) {
      console.error('Error creating service:', error);
      return null;
    }
  },

  async updateService(id: string, updates: Partial<Service>): Promise<Service | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('services')
        .update(stripUndefined({ ...serviceToDbService(updates), updated_at: new Date().toISOString() }))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbServiceToService(data) : null;
    } catch (error) {
      console.error('Error updating service:', error);
      return null;
    }
  },

  async deleteService(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      return false;
    }
  },
};
