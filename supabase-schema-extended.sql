-- ============================================
-- SUPABASE SITE-WIDE ADMIN SCHEMA
-- Complete database structure for all content
-- ============================================

-- ============================================
-- 1. SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  icon_name TEXT NOT NULL, -- e.g., 'Bot', 'Workflow', 'Code2'
  color TEXT NOT NULL,     -- e.g., 'text-emerald-400'
  features JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PRICING TIERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  recommended BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. FAQS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  page TEXT DEFAULT 'pricing', -- 'pricing', 'home', 'about'
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. TEAM MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. TESTIMONIALS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  company TEXT,
  rating INTEGER DEFAULT 5,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. SITE SETTINGS TABLE (for hero text, etc.)
-- ============================================
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public insert services" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update services" ON services FOR UPDATE USING (true);
CREATE POLICY "Public delete services" ON services FOR DELETE USING (true);

-- Pricing Tiers
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read pricing" ON pricing_tiers FOR SELECT USING (true);
CREATE POLICY "Public insert pricing" ON pricing_tiers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update pricing" ON pricing_tiers FOR UPDATE USING (true);
CREATE POLICY "Public delete pricing" ON pricing_tiers FOR DELETE USING (true);

-- FAQs
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public insert faqs" ON faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update faqs" ON faqs FOR UPDATE USING (true);
CREATE POLICY "Public delete faqs" ON faqs FOR DELETE USING (true);

-- Team Members
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read team" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public insert team" ON team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update team" ON team_members FOR UPDATE USING (true);
CREATE POLICY "Public delete team" ON team_members FOR DELETE USING (true);

-- Testimonials
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public insert testimonials" ON testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update testimonials" ON testimonials FOR UPDATE USING (true);
CREATE POLICY "Public delete testimonials" ON testimonials FOR DELETE USING (true);

-- Site Settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public update settings" ON site_settings FOR UPDATE USING (true);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);
CREATE INDEX IF NOT EXISTS idx_pricing_order ON pricing_tiers(order_index);
CREATE INDEX IF NOT EXISTS idx_faqs_page_order ON faqs(page, order_index);
CREATE INDEX IF NOT EXISTS idx_team_order ON team_members(order_index);
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(order_index);

-- ============================================
-- INITIAL DATA MIGRATION (Optional)
-- Run this to migrate from constants.ts
-- ============================================

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_title', '"Our Work\nIn Action."'::jsonb),
  ('hero_subtitle', '"From custom LLMs to high-performance web apps, explore how we deliver value."'::jsonb),
  ('company_email', '"contact@orbact.ai"'::jsonb),
  ('company_phone', '"+1 (555) 123-4567"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Note: Services, pricing, team, and testimonials should be added via admin panel
-- Or you can manually insert initial data here if needed
