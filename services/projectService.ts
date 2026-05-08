import { supabase, dbProjectToCaseStudy, caseStudyToDbProject } from '../lib/supabase';
import { CaseStudy } from '../types';

export const projectService = {
    /**
     * Fetch all projects from database
     */
    async getAllProjects(): Promise<CaseStudy[]> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching projects:', error);
                return [];
            }

            return data ? data.map(dbProjectToCaseStudy) : [];
        } catch (error) {
            console.error('Exception fetching projects:', error);
            return [];
        }
    },

    /**
     * Create a new project
     */
    async createProject(project: Omit<CaseStudy, 'id'>): Promise<CaseStudy | null> {
        try {
            const dbProject = caseStudyToDbProject(project);

            const { data, error } = await supabase
                .from('projects')
                .insert(dbProject)
                .select()
                .single();

            if (error) {
                console.error('Error creating project:', error);
                return null;
            }

            return data ? dbProjectToCaseStudy(data) : null;
        } catch (error) {
            console.error('Exception creating project:', error);
            return null;
        }
    },

    /**
     * Update an existing project
     */
    async updateProject(id: string, updates: Partial<CaseStudy>): Promise<CaseStudy | null> {
        try {
            const dbUpdates = caseStudyToDbProject(updates);

            const { data, error } = await supabase
                .from('projects')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating project:', error);
                return null;
            }

            return data ? dbProjectToCaseStudy(data) : null;
        } catch (error) {
            console.error('Exception updating project:', error);
            return null;
        }
    },

    /**
     * Delete a project
     */
    async deleteProject(id: string): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting project:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Exception deleting project:', error);
            return false;
        }
    },

    /**
     * Upload image to Supabase Storage
     */
    async uploadImage(file: File): Promise<string | null> {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = fileName;

            const { error: uploadError } = await supabase.storage
                .from('project-images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('Error uploading image:', uploadError);
                return null;
            }

            const { data } = supabase.storage
                .from('project-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Exception uploading image:', error);
            return null;
        }
    },

    /**
     * Get selected projects (featured) for Home page
     */
    async getSelectedProjects(): Promise<CaseStudy[]> {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('is_featured', true)
                .order('order', { ascending: true })
                .limit(4);

            if (error) {
                console.error('Error fetching selected projects:', error);
                return [];
            }

            return data ? data.map(dbProjectToCaseStudy) : [];
        } catch (error) {
            console.error('Exception fetching selected projects:', error);
            return [];
        }
    },

    /**
     * Toggle project selection (max 4 selected)
     */
    async toggleProjectSelection(id: string, isSelected: boolean): Promise<{ success: boolean; message?: string }> {
        try {
            // If selecting, check if limit reached
            if (isSelected) {
                const { count, error: countError } = await supabase
                    .from('projects')
                    .select('*', { count: 'exact', head: true })
                    .eq('is_featured', true);

                if (countError) {
                    console.error('Error checking selected count:', countError);
                    return { success: false, message: 'Failed to check limit' };
                }

                if (count !== null && count >= 4) {
                    return { success: false, message: 'Maximum 4 projects can be selected' };
                }
            }

            const { error } = await supabase
                .from('projects')
                .update({ is_featured: isSelected })
                .eq('id', id);

            if (error) {
                console.error('Error toggling selection:', error);
                return { success: false, message: 'Database error' };
            }

            return { success: true };
        } catch (error) {
            console.error('Exception toggling selection:', error);
            return { success: false, message: 'System error' };
        }
    },
};
