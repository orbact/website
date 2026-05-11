import { caseStudyToDbProject, dbProjectToCaseStudy, isSupabaseConfigured, stripUndefined, supabase } from '../lib/supabase';
import { CaseStudy } from '../types';

export const projectService = {
  async getAllProjects(includeDrafts = false): Promise<CaseStudy[]> {
    if (!isSupabaseConfigured) return [];
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });

      if (!includeDrafts) {
        query = query.eq('published', true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ? data.map(dbProjectToCaseStudy) : [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  async getSelectedProjects(): Promise<CaseStudy[]> {
    if (!isSupabaseConfigured) return [];
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('is_featured', true)
        .eq('published', true)
        .order('order_index', { ascending: true })
        .limit(4);

      if (error) throw error;
      return data ? data.map(dbProjectToCaseStudy) : [];
    } catch (error) {
      console.error('Error fetching selected projects:', error);
      return [];
    }
  },

  async createProject(project: Omit<CaseStudy, 'id'>): Promise<CaseStudy | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(caseStudyToDbProject(project))
        .select()
        .single();

      if (error) throw error;
      return data ? dbProjectToCaseStudy(data) : null;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  },

  async updateProject(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(stripUndefined({ ...caseStudyToDbProject(updates), updated_at: new Date().toISOString() }))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbProjectToCaseStudy(data) : null;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  },

  async deleteProject(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  },

  async uploadImage(file: File): Promise<string | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const safeBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
      const filePath = `projects/${Date.now()}-${safeBase}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-media')
        .upload(filePath, file, { cacheControl: '31536000', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-media').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading project image:', error);
      return null;
    }
  },

  async toggleProjectSelection(id: string, isSelected: boolean): Promise<{ success: boolean; message?: string }> {
    if (!isSupabaseConfigured) return { success: false, message: 'Supabase is not configured' };
    try {
      if (isSelected) {
        const { count, error: countError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('is_featured', true);

        if (countError) throw countError;
        if (count !== null && count >= 4) {
          return { success: false, message: 'Maximum 4 projects can be selected' };
        }
      }

      const { error } = await supabase.from('projects').update({ is_featured: isSelected }).eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error toggling project selection:', error);
      return { success: false, message: 'Unable to update selected works' };
    }
  },
};
