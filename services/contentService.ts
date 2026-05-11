import { isSupabaseConfigured, supabase } from '../lib/supabase';

export interface PageSection {
  id?: string;
  page: string;
  section_key: string;
  label?: string | null;
  eyebrow?: string | null;
  headline?: string | null;
  subheadline?: string | null;
  body?: string | null;
  cta_label?: string | null;
  cta_href?: string | null;
  secondary_cta_label?: string | null;
  secondary_cta_href?: string | null;
  image_url?: string | null;
  image_alt?: string | null;
  metadata?: Record<string, unknown>;
  published?: boolean;
  order_index?: number;
}

export interface MediaAsset {
  id?: string;
  file_name: string;
  file_path: string;
  public_url: string;
  alt_text?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  created_at?: string;
}

export const contentService = {
  async getSection(page: string, sectionKey: string): Promise<PageSection | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page', page)
        .eq('section_key', sectionKey)
        .eq('published', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching page section:', error);
      return null;
    }
  },

  async getSettings(): Promise<Record<string, any>> {
    if (!isSupabaseConfigured) return {};
    try {
      const { data, error } = await supabase.from('site_settings').select('key,value');
      if (error) throw error;

      return (data || []).reduce<Record<string, any>>((acc, row) => {
        acc[row.key] = row.value;
        return acc;
      }, {});
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return {};
    }
  },

  async uploadMedia(file: File, altText = ''): Promise<MediaAsset | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const fileExt = file.name.split('.').pop() || 'bin';
      const safeBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase();
      const filePath = `uploads/${Date.now()}-${safeBase}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-media')
        .upload(filePath, file, { cacheControl: '31536000', upsert: false });
      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from('site-media').getPublicUrl(filePath);
      const asset: Omit<MediaAsset, 'id'> = {
        file_name: file.name,
        file_path: filePath,
        public_url: publicData.publicUrl,
        alt_text: altText,
        mime_type: file.type,
        size_bytes: file.size,
      };

      const { data, error } = await supabase.from('media_assets').insert(asset).select().single();
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading media:', error);
      return null;
    }
  },
};
