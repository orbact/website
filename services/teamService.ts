import { supabase } from '../lib/supabase';
import { TeamMember } from '../types';

export interface DbTeamMember {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    image_url: string | null;
    linkedin_url: string | null;
    twitter_url: string | null;
    order_index: number;
    created_at: string;
    updated_at: string;
}

export const teamService = {
    /**
     * Fetch all team members
     */
    async getAllMembers(): Promise<TeamMember[]> {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('order_index', { ascending: true });

            if (error) {
                console.error('Error fetching team members:', error);
                return [];
            }

            return data ? data.map(dbMemberToTeamMember) : [];
        } catch (error) {
            console.error('Exception fetching team members:', error);
            return [];
        }
    },

    /**
     * Create a new team member
     */
    async createMember(member: Partial<TeamMember>): Promise<TeamMember | null> {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .insert({
                    name: member.name,
                    role: member.role,
                    bio: member.bio || null,
                    image_url: member.image || null,
                    linkedin_url: member.linkedin || null,
                    twitter_url: member.twitter || null,
                })
                .select()
                .single();

            if (error) {
                console.error('Error creating team member:', error);
                return null;
            }

            return data ? dbMemberToTeamMember(data) : null;
        } catch (error) {
            console.error('Exception creating team member:', error);
            return null;
        }
    },

    /**
     * Update an existing team member
     */
    async updateMember(id: string, updates: Partial<TeamMember>): Promise<TeamMember | null> {
        try {
            const { data, error } = await supabase
                .from('team_members')
                .update({
                    name: updates.name,
                    role: updates.role,
                    bio: updates.bio,
                    image_url: updates.image,
                    linkedin_url: updates.linkedin,
                    twitter_url: updates.twitter,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating team member:', error);
                return null;
            }

            return data ? dbMemberToTeamMember(data) : null;
        } catch (error) {
            console.error('Exception updating team member:', error);
            return null;
        }
    },

    /**
     * Delete a team member
     */
    async deleteMember(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting team member:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Exception deleting team member:', error);
            return false;
        }
    },

    /**
     * Upload team member image
     */
    async uploadImage(file: File): Promise<string | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `team/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('project-images') // Reusing same bucket
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Error uploading team image:', uploadError);
                return null;
            }

            const { data } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Exception uploading team image:', error);
            return null;
        }
    },
};

function dbMemberToTeamMember(dbMember: DbTeamMember): TeamMember {
    return {
        id: dbMember.id,
        name: dbMember.name,
        role: dbMember.role,
        image: dbMember.image_url || `https://picsum.photos/200/200?random=${Math.random()}`,
        bio: dbMember.bio || undefined,
        linkedin: dbMember.linkedin_url || undefined,
        twitter: dbMember.twitter_url || undefined,
    };
}
