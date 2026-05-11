import { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from './supabase';

const ADMIN_FLAG = 'orbact_admin_verified';

export const adminAuth = {
  isAdmin(): boolean {
    return localStorage.getItem(ADMIN_FLAG) === 'true';
  },

  async login(password: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
    }

    const email = import.meta.env.VITE_ADMIN_EMAIL;
    if (!email) {
      throw new Error('VITE_ADMIN_EMAIL is missing. Set it to the admin Supabase Auth email.');
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      localStorage.removeItem(ADMIN_FLAG);
      return false;
    }

    const isAllowed = await this.checkAdmin();
    if (!isAllowed) {
      await supabase.auth.signOut();
      localStorage.removeItem(ADMIN_FLAG);
      return false;
    }

    localStorage.setItem(ADMIN_FLAG, 'true');
    return true;
  },

  async logout(): Promise<void> {
    localStorage.removeItem(ADMIN_FLAG);
    await supabase.auth.signOut();
  },

  async getSession(): Promise<Session | null> {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async checkAdmin(): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) {
      localStorage.removeItem(ADMIN_FLAG);
      return false;
    }

    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error || !data) {
      localStorage.removeItem(ADMIN_FLAG);
      return false;
    }

    localStorage.setItem(ADMIN_FLAG, 'true');
    return true;
  },

  onAuthStateChange(callback: (isAdmin: boolean) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        localStorage.removeItem(ADMIN_FLAG);
        callback(false);
        return;
      }

      callback(await this.checkAdmin());
    });
  },
};
