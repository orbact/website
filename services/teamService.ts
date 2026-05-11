import { dbMemberToTeamMember, isSupabaseConfigured, stripUndefined, supabase, teamMemberToDbMember } from '../lib/supabase';
import { TeamMember } from '../types';

export const teamService = {
  async getAllMembers(includeDrafts = false): Promise<TeamMember[]> {
    if (!isSupabaseConfigured) return [];
    try {
      let query = supabase.from('team_members').select('*').order('order_index', { ascending: true });
      if (!includeDrafts) query = query.eq('published', true);

      const { data, error } = await query;
      if (error) throw error;
      return data ? data.map(dbMemberToTeamMember) : [];
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  },

  async createMember(member: Partial<TeamMember>): Promise<TeamMember | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert(teamMemberToDbMember(member))
        .select()
        .single();

      if (error) throw error;
      return data ? dbMemberToTeamMember(data) : null;
    } catch (error) {
      console.error('Error creating team member:', error);
      return null;
    }
  },

  async updateMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(stripUndefined({ ...teamMemberToDbMember(updates), updated_at: new Date().toISOString() }))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data ? dbMemberToTeamMember(data) : null;
    } catch (error) {
      console.error('Error updating team member:', error);
      return null;
    }
  },

  async deleteMember(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('team_members').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting team member:', error);
      return false;
    }
  },

  async uploadImage(file: File): Promise<string | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const safeBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
      const filePath = `team/${Date.now()}-${safeBase}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-media')
        .upload(filePath, file, { cacheControl: '31536000', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('site-media').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading team image:', error);
      return null;
    }
  },
};
