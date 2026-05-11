import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BarChart3,
  BriefcaseBusiness,
  Check,
  Database,
  FileText,
  HelpCircle,
  Image,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  MessageSquare,
  Package,
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Settings,
  Star,
  Trash2,
  Users,
} from 'lucide-react';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { useNotify } from '../components/Toast';
import { adminAuth } from '../lib/adminAuth';
import { useAdmin } from '../lib/AdminContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { ICON_OPTIONS } from '../lib/cmsMaps';
import { contentService } from '../services/contentService';

type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'list' | 'json' | 'select' | 'image';

interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  helper?: string;
}

interface AdminSection {
  key: string;
  label: string;
  table?: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  fields?: FieldConfig[];
  columns?: string[];
  readOnly?: boolean;
}

const colorOptions = [
  'text-emerald-400',
  'text-blue-400',
  'text-purple-400',
  'text-pink-400',
  'text-orange-400',
  'text-cyan-400',
  'text-yellow-400',
  'text-red-400',
  'text-indigo-400',
];

const sections: AdminSection[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'CMS health, security notes, and content counts.', icon: LayoutDashboard },
  {
    key: 'pages',
    label: 'Pages',
    table: 'page_sections',
    description: 'Edit hero blocks, CTA copy, page sections, images, and SEO-friendly page content.',
    icon: FileText,
    columns: ['page', 'section_key', 'headline', 'published'],
    fields: [
      { name: 'page', label: 'Page', type: 'select', required: true, options: ['home', 'solutions', 'works', 'pricing', 'about', 'contact'] },
      { name: 'section_key', label: 'Section key', type: 'text', required: true, helper: 'Example: hero, cta, process' },
      { name: 'label', label: 'Admin label', type: 'text' },
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'headline', label: 'Headline', type: 'text' },
      { name: 'subheadline', label: 'Subheadline', type: 'text' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'cta_label', label: 'Primary CTA label', type: 'text' },
      { name: 'cta_href', label: 'Primary CTA URL', type: 'text' },
      { name: 'secondary_cta_label', label: 'Secondary CTA label', type: 'text' },
      { name: 'secondary_cta_href', label: 'Secondary CTA URL', type: 'text' },
      { name: 'image_url', label: 'Image URL', type: 'image' },
      { name: 'image_alt', label: 'Image alt text', type: 'text' },
      { name: 'metadata', label: 'Metadata JSON', type: 'json' },
      { name: 'published', label: 'Published', type: 'boolean' },
      { name: 'order_index', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'services',
    label: 'Services',
    table: 'services',
    description: 'Manage AI engineering, automation, design, marketing, and delivery services.',
    icon: Package,
    columns: ['title', 'slug', 'published', 'order_index'],
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'short_description', label: 'Short description', type: 'textarea' },
      { name: 'full_description', label: 'Full description', type: 'textarea' },
      { name: 'icon_name', label: 'Icon', type: 'select', options: ICON_OPTIONS },
      { name: 'color', label: 'Color class', type: 'select', options: colorOptions },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'published', label: 'Published', type: 'boolean' },
      { name: 'order_index', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'work',
    label: 'Work',
    table: 'projects',
    description: 'Add case studies, portfolio work, links, cover images, and featured homepage projects.',
    icon: BriefcaseBusiness,
    columns: ['title', 'category', 'is_featured', 'published'],
    fields: [
      { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'title', label: 'Project title', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'image_url', label: 'Cover image URL', type: 'image' },
      { name: 'image_alt', label: 'Cover image alt text', type: 'text' },
      { name: 'link', label: 'Live URL', type: 'text' },
      { name: 'huggingface_link', label: 'Hugging Face URL', type: 'text' },
      { name: 'stats', label: 'Stats JSON', type: 'json', helper: 'Example: [{"label":"ROI","value":"3x"}]' },
      { name: 'is_featured', label: 'Featured on home', type: 'boolean' },
      { name: 'published', label: 'Published', type: 'boolean' },
      { name: 'order_index', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'pricing',
    label: 'Pricing',
    table: 'pricing_tiers',
    description: 'Edit pricing tiers, descriptions, recommendations, and feature bullets.',
    icon: BarChart3,
    columns: ['name', 'price', 'recommended', 'published'],
    fields: [
      { name: 'name', label: 'Plan name', type: 'text', required: true },
      { name: 'price', label: 'Price', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'features', label: 'Features', type: 'list' },
      { name: 'recommended', label: 'Recommended', type: 'boolean' },
      { name: 'published', label: 'Published', type: 'boolean' },
      { name: 'order_index', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'reviews',
    label: 'Reviews',
    table: 'testimonials',
    description: 'Manage client testimonials and review marquee content.',
    icon: Star,
    columns: ['author', 'company', 'rating', 'published'],
    fields: [
      { name: 'quote', label: 'Quote', type: 'textarea', required: true },
      { name: 'author', label: 'Author', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text' },
      { name: 'company', label: 'Company', type: 'text' },
      { name: 'avatar_url', label: 'Avatar URL', type: 'image' },
      { name: 'rating', label: 'Rating', type: 'number' },
      { name: 'published', label: 'Published', type: 'boolean' },
      { name: 'order_index', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'faqs',
    label: 'FAQs',
    table: 'faqs',
    description: 'Manage pricing and page-specific FAQ content.',
    icon: HelpCircle,
    columns: ['page', 'question', 'published', 'order_index'],
    fields: [
      { name: 'page', label: 'Page', type: 'select', options: ['pricing', 'home', 'solutions', 'works', 'about', 'contact'] },
      { name: 'question', label: 'Question', type: 'text', required: true },
      { name: 'answer', label: 'Answer', type: 'textarea', required: true },
      { name: 'published', label: 'Published', type: 'boolean' },
      { name: 'order_index', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'team',
    label: 'Team',
    table: 'team_members',
    description: 'Manage team members shown on the About page.',
    icon: Users,
    columns: ['name', 'role', 'published', 'order_index'],
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'role', label: 'Role', type: 'text', required: true },
      { name: 'bio', label: 'Bio', type: 'textarea' },
      { name: 'image_url', label: 'Image URL', type: 'image' },
      { name: 'image_alt', label: 'Image alt text', type: 'text' },
      { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
      { name: 'twitter_url', label: 'X/Twitter URL', type: 'text' },
      { name: 'published', label: 'Published', type: 'boolean' },
      { name: 'order_index', label: 'Order', type: 'number' },
    ],
  },
  {
    key: 'media',
    label: 'Media',
    table: 'media_assets',
    description: 'Upload and copy reusable CMS image URLs.',
    icon: Image,
    columns: ['file_name', 'alt_text', 'public_url', 'created_at'],
    readOnly: true,
  },
  {
    key: 'settings',
    label: 'Settings',
    table: 'site_settings',
    description: 'Site-wide settings including footer copy, social links, contact details, and chatbot context.',
    icon: Settings,
    columns: ['key', 'value', 'updated_at'],
    fields: [
      { name: 'key', label: 'Key', type: 'text', required: true },
      { name: 'value', label: 'Value JSON', type: 'json', required: true },
    ],
  },
  {
    key: 'messages',
    label: 'Messages',
    table: 'contact_submissions',
    description: 'View contact submissions collected by the secure Edge Function.',
    icon: MessageSquare,
    columns: ['name', 'email', 'company', 'budget', 'created_at'],
    readOnly: true,
  },
];

const defaultsByType: Record<FieldType, any> = {
  text: '',
  textarea: '',
  number: 0,
  boolean: true,
  list: '',
  json: '{}',
  select: '',
  image: '',
};

function formFromRow(row: Record<string, any>, fields: FieldConfig[]) {
  return fields.reduce<Record<string, any>>((acc, field) => {
    const value = row[field.name];
    if (field.type === 'list') acc[field.name] = Array.isArray(value) ? value.join('\n') : '';
    else if (field.type === 'json') acc[field.name] = JSON.stringify(value ?? (field.name === 'stats' ? [] : {}), null, 2);
    else acc[field.name] = value ?? defaultsByType[field.type];
    return acc;
  }, {});
}

function emptyForm(fields: FieldConfig[]) {
  return fields.reduce<Record<string, any>>((acc, field) => {
    if (field.type === 'select') acc[field.name] = field.options?.[0] || '';
    else if (field.name === 'metadata') acc[field.name] = '{}';
    else if (field.name === 'stats') acc[field.name] = '[]';
    else if (field.name === 'rating') acc[field.name] = 5;
    else if (field.name === 'published') acc[field.name] = true;
    else acc[field.name] = defaultsByType[field.type];
    return acc;
  }, {});
}

function payloadFromForm(form: Record<string, any>, fields: FieldConfig[]) {
  return fields.reduce<Record<string, any>>((acc, field) => {
    const value = form[field.name];
    if (field.type === 'list') {
      acc[field.name] = String(value || '')
        .split('\n')
        .map(item => item.trim())
        .filter(Boolean);
    } else if (field.type === 'json') {
      acc[field.name] = value ? JSON.parse(value) : field.name === 'stats' ? [] : {};
    } else if (field.type === 'number') {
      acc[field.name] = Number(value || 0);
    } else if (field.type === 'boolean') {
      acc[field.name] = Boolean(value);
    } else {
      acc[field.name] = value === '' ? null : value;
    }
    return acc;
  }, {});
}

const Admin: React.FC = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const { isAdmin, loading: adminLoading, refreshAdmin } = useAdmin();
  const activeKey = section || 'dashboard';
  const activeSection = sections.find(item => item.key === activeKey) || sections[0];

  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loadingRows, setLoadingRows] = useState(false);
  const [editing, setEditing] = useState<Record<string, any> | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadAlt, setUploadAlt] = useState('');

  const editable = Boolean(activeSection.table && activeSection.fields && !activeSection.readOnly);

  const tableSections = useMemo(() => sections.filter(item => item.table), []);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  useEffect(() => {
    if (!isAdmin) return;
    loadRows();
    loadCounts();
  }, [activeKey, isAdmin]);

  const safeNavigate = (next: string) => {
    if (dirty && !window.confirm('Discard unsaved changes?')) return;
    setEditing(null);
    setDirty(false);
    navigate(`/admin/${next}`);
  };

  const loadCounts = async () => {
    const nextCounts: Record<string, number> = {};
    await Promise.all(
      tableSections.map(async item => {
        if (!item.table) return;
        const { count } = await supabase.from(item.table).select('*', { count: 'exact', head: true });
        nextCounts[item.key] = count || 0;
      })
    );
    setCounts(nextCounts);
  };

  const loadRows = async () => {
    if (!activeSection.table) return;
    setLoadingRows(true);
    setRows([]);
    try {
      let query = supabase.from(activeSection.table).select('*');
      if (!['site_settings', 'contact_submissions', 'media_assets'].includes(activeSection.table)) {
        query = query.order('order_index', { ascending: true });
      } else {
        query = query.order(activeSection.table === 'site_settings' ? 'key' : 'created_at', { ascending: activeSection.table === 'site_settings' });
      }
      const { data, error } = await query;
      if (error) throw error;
      setRows(data || []);
    } catch (error: any) {
      notify.error(error?.message || 'Unable to load content.');
    } finally {
      setLoadingRows(false);
    }
  };

  const startCreate = () => {
    if (!activeSection.fields) return;
    setEditing(null);
    setForm(emptyForm(activeSection.fields));
    setDirty(false);
  };

  const startEdit = (row: Record<string, any>) => {
    if (!activeSection.fields) return;
    setEditing(row);
    setForm(formFromRow(row, activeSection.fields));
    setDirty(false);
  };

  const updateField = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
    setDirty(true);
  };

  const saveRow = async () => {
    if (!activeSection.table || !activeSection.fields) return;
    try {
      const payload = payloadFromForm(form, activeSection.fields);
      const missing = activeSection.fields.find(field => field.required && !payload[field.name]);
      if (missing) {
        notify.warning(`${missing.label} is required.`);
        return;
      }

      let response;
      if (editing) {
        const idColumn = activeSection.table === 'site_settings' ? 'key' : 'id';
        response = await supabase
          .from(activeSection.table)
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq(idColumn, editing[idColumn])
          .select()
          .single();
      } else if (activeSection.table === 'site_settings') {
        response = await supabase.from(activeSection.table).upsert(payload, { onConflict: 'key' }).select().single();
      } else {
        response = await supabase.from(activeSection.table).insert(payload).select().single();
      }

      if (response.error) throw response.error;
      notify.success('Content saved.');
      setEditing(response.data);
      if (activeSection.fields) setForm(formFromRow(response.data, activeSection.fields));
      setDirty(false);
      await loadRows();
      await loadCounts();
    } catch (error: any) {
      notify.error(error?.message || 'Unable to save content. Check required fields and JSON syntax.');
    }
  };

  const deleteRow = async (row: Record<string, any>) => {
    if (!activeSection.table || !window.confirm('Delete this item? This cannot be undone.')) return;
    try {
      const idColumn = activeSection.table === 'site_settings' ? 'key' : 'id';
      const { error } = await supabase.from(activeSection.table).delete().eq(idColumn, row[idColumn]);
      if (error) throw error;
      notify.success('Item deleted.');
      setEditing(null);
      setForm({});
      setDirty(false);
      await loadRows();
      await loadCounts();
    } catch (error: any) {
      notify.error(error?.message || 'Unable to delete item.');
    }
  };

  const uploadIntoField = async (fieldName: string, file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const asset = await contentService.uploadMedia(file, form.image_alt || uploadAlt);
      if (!asset) throw new Error('Upload failed.');
      updateField(fieldName, asset.public_url);
      notify.success('Image uploaded and URL inserted.');
      if (activeSection.key === 'media') await loadRows();
    } catch (error: any) {
      notify.error(error?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const uploadMediaAsset = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const asset = await contentService.uploadMedia(file, uploadAlt);
      if (!asset) throw new Error('Upload failed.');
      setUploadAlt('');
      notify.success('Media uploaded.');
      await loadRows();
      await loadCounts();
    } catch (error: any) {
      notify.error(error?.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoginError('');
    try {
      const ok = await adminAuth.login(password);
      if (!ok) {
        setLoginError('Invalid password or this Supabase user is not listed in admin_users.');
        return;
      }
      await refreshAdmin();
      notify.success('Admin unlocked.');
      navigate('/admin/dashboard');
    } catch (error: any) {
      setLoginError(error?.message || 'Admin login failed.');
    }
  };

  const handleLogout = async () => {
    await adminAuth.logout();
    notify.info('Logged out.');
    navigate('/admin');
  };

  if (!isSupabaseConfigured) {
    return (
      <AdminShell>
        <StatusPanel
          title="Supabase is not configured"
          body="Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and VITE_ADMIN_EMAIL to your deployment environment before using the admin CMS."
        />
      </AdminShell>
    );
  }

  if (adminLoading) {
    return (
      <AdminShell>
        <div className="flex min-h-[50vh] items-center justify-center text-muted">
          <Loader2 className="mr-3 animate-spin" /> Verifying admin session...
        </div>
      </AdminShell>
    );
  }

  if (!isAdmin) {
    return (
      <AdminShell>
        <div className="mx-auto max-w-md rounded-2xl border border-border-subtle bg-bg-card p-6 shadow-2xl md:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-primary/30 bg-accent-primary/10 text-accent-primary">
              <Lock size={24} />
            </div>
            <h1 className="text-2xl font-bold text-text-main">Admin Access</h1>
            <p className="mt-2 text-sm text-muted">Use the password for {import.meta.env.VITE_ADMIN_EMAIL || 'the configured admin email'}.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-bg-page px-4 py-3 text-sm text-text-main outline-none focus:border-accent-primary"
              placeholder="Admin password"
              autoFocus
              required
            />
            {loginError && <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-300">{loginError}</div>}
            <Button type="submit" className="w-full justify-center">
              <Lock size={16} /> Unlock Admin
            </Button>
          </form>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-border-subtle bg-bg-card/70 p-3 lg:sticky lg:top-28 lg:self-start">
          <div className="mb-3 flex items-center justify-between px-3 py-2">
            <span className="text-xs font-bold uppercase text-accent-primary">Orbact CMS</span>
            <button onClick={handleLogout} className="rounded-lg p-2 text-muted hover:bg-bg-surface hover:text-red-300" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
          <nav className="space-y-1">
            {sections.map(item => (
              <button
                key={item.key}
                onClick={() => safeNavigate(item.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${activeSection.key === item.key ? 'bg-accent-primary text-black' : 'text-muted hover:bg-bg-surface hover:text-text-main'}`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0">
          <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-border-subtle bg-bg-card/60 p-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-accent-primary">
                <activeSection.icon size={14} />
                {activeSection.label}
              </div>
              <h1 className="text-2xl font-bold text-text-main md:text-3xl">{activeSection.label}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted">{activeSection.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeSection.table && (
                <Button variant="outline" onClick={loadRows}>
                  <RefreshCcw size={16} /> Refresh
                </Button>
              )}
              {editable && (
                <Button onClick={startCreate}>
                  <Plus size={16} /> New
                </Button>
              )}
            </div>
          </div>

          {activeSection.key === 'dashboard' ? (
            <Dashboard counts={counts} />
          ) : (
            <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
              <section className="rounded-2xl border border-border-subtle bg-bg-card/50 p-4">
                {activeSection.key === 'media' && (
                  <MediaUpload
                    uploading={uploading}
                    uploadAlt={uploadAlt}
                    onAltChange={setUploadAlt}
                    onUpload={uploadMediaAsset}
                  />
                )}
                <DataTable
                  section={activeSection}
                  rows={rows}
                  loading={loadingRows}
                  onEdit={startEdit}
                  onDelete={deleteRow}
                />
              </section>

              {editable ? (
                <section className="rounded-2xl border border-border-subtle bg-bg-card/50 p-5 xl:sticky xl:top-28 xl:self-start">
                  {Object.keys(form).length === 0 ? (
                    <div className="py-14 text-center text-sm text-muted">
                      Select an item or create a new one.
                    </div>
                  ) : (
                    <>
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <h2 className="font-bold text-text-main">{editing ? 'Edit item' : 'New item'}</h2>
                        {dirty && <span className="rounded-full bg-yellow-400/10 px-2 py-1 text-xs text-yellow-300">Unsaved</span>}
                      </div>
                      <FormFields
                        fields={activeSection.fields || []}
                        form={form}
                        uploading={uploading}
                        onChange={updateField}
                        onUpload={uploadIntoField}
                      />
                      <div className="mt-6 flex gap-3 border-t border-border-subtle pt-5">
                        <Button onClick={saveRow} className="flex-1 justify-center">
                          <Save size={16} /> Save
                        </Button>
                        <Button variant="outline" onClick={() => { setForm({}); setEditing(null); setDirty(false); }}>
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </section>
              ) : (
                <section className="rounded-2xl border border-border-subtle bg-bg-card/50 p-5 text-sm text-muted">
                  <h2 className="mb-3 font-bold text-text-main">Read-only</h2>
                  {activeSection.key === 'messages'
                    ? 'Contact submissions are collected by the secure Edge Function and cannot be edited from the CMS.'
                    : 'Media items are uploaded here and then copied into page, project, review, or team image fields.'}
                </section>
              )}
            </div>
          )}
        </main>
      </div>
    </AdminShell>
  );
};

const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-bg-page px-6 pb-20 pt-32">
    <SEO title="Admin | Orbact" description="Orbact admin CMS." noindex />
    <div className="container mx-auto max-w-7xl">{children}</div>
  </div>
);

const StatusPanel: React.FC<{ title: string; body: string }> = ({ title, body }) => (
  <div className="mx-auto max-w-2xl rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-6 text-center">
    <Database className="mx-auto mb-4 text-yellow-300" />
    <h1 className="text-2xl font-bold text-text-main">{title}</h1>
    <p className="mt-3 text-sm text-muted">{body}</p>
  </div>
);

const Dashboard: React.FC<{ counts: Record<string, number> }> = ({ counts }) => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {sections.filter(item => item.table).slice(0, 8).map(item => (
        <Link key={item.key} to={`/admin/${item.key}`} className="rounded-2xl border border-border-subtle bg-bg-card/60 p-5 transition-colors hover:border-accent-primary/50">
          <div className="mb-4 flex items-center justify-between">
            <item.icon size={18} className="text-accent-primary" />
            <span className="text-2xl font-bold text-text-main">{counts[item.key] || 0}</span>
          </div>
          <p className="text-sm font-semibold text-text-main">{item.label}</p>
          <p className="mt-1 text-xs text-muted">CMS records</p>
        </Link>
      ))}
    </div>

    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border-subtle bg-bg-card/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-text-main"><Check size={18} className="text-green-400" /> Security posture</h2>
        <ul className="space-y-3 text-sm text-muted">
          <li>Public users can read published content only.</li>
          <li>CMS writes require Supabase Auth plus an `admin_users` row.</li>
          <li>Secrets for AI chat and contact delivery are handled in Edge Functions.</li>
          <li>Admin pages are marked noindex and excluded from sitemap intent.</li>
        </ul>
      </div>
      <div className="rounded-2xl border border-border-subtle bg-bg-card/60 p-6">
        <h2 className="mb-4 flex items-center gap-2 font-bold text-text-main"><Settings size={18} className="text-accent-primary" /> Recommended setup</h2>
        <ul className="space-y-3 text-sm text-muted">
          <li>Create one Supabase Auth user for `VITE_ADMIN_EMAIL`.</li>
          <li>Insert that user's id into `admin_users` after signup.</li>
          <li>Deploy the `chat` and `contact` Edge Functions with server-only secrets.</li>
          <li>Upload real Orbact media and replace placeholder image URLs.</li>
        </ul>
      </div>
    </div>
  </div>
);

const DataTable: React.FC<{
  section: AdminSection;
  rows: Record<string, any>[];
  loading: boolean;
  onEdit: (row: Record<string, any>) => void;
  onDelete: (row: Record<string, any>) => void;
}> = ({ section, rows, loading, onEdit, onDelete }) => {
  const columns = section.columns || [];

  if (loading) {
    return <div className="flex min-h-[220px] items-center justify-center text-muted"><Loader2 className="mr-3 animate-spin" /> Loading...</div>;
  }

  if (rows.length === 0) {
    return <div className="rounded-xl border border-dashed border-border-subtle p-10 text-center text-sm text-muted">No records yet.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="text-xs uppercase text-muted">
          <tr>
            {columns.map(column => <th key={column} className="border-b border-border-subtle px-3 py-3">{column.replace(/_/g, ' ')}</th>)}
            <th className="border-b border-border-subtle px-3 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id || row.key} className="border-b border-border-subtle/60">
              {columns.map(column => (
                <td key={column} className="max-w-[260px] truncate px-3 py-3 text-text-muted">
                  {typeof row[column] === 'boolean' ? (row[column] ? 'Yes' : 'No') : stringifyCell(row[column])}
                </td>
              ))}
              <td className="px-3 py-3">
                <div className="flex justify-end gap-2">
                  {!section.readOnly && (
                    <>
                      <button onClick={() => onEdit(row)} className="rounded-lg p-2 text-muted hover:bg-bg-surface hover:text-accent-primary" title="Edit"><Pencil size={15} /></button>
                      <button onClick={() => onDelete(row)} className="rounded-lg p-2 text-muted hover:bg-red-400/10 hover:text-red-300" title="Delete"><Trash2 size={15} /></button>
                    </>
                  )}
                  {section.key === 'media' && (
                    <button
                      onClick={() => navigator.clipboard?.writeText(row.public_url)}
                      className="rounded-lg px-3 py-2 text-xs text-muted hover:bg-bg-surface hover:text-text-main"
                    >
                      Copy URL
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FormFields: React.FC<{
  fields: FieldConfig[];
  form: Record<string, any>;
  uploading: boolean;
  onChange: (name: string, value: any) => void;
  onUpload: (fieldName: string, file?: File) => void;
}> = ({ fields, form, uploading, onChange, onUpload }) => (
  <div className="space-y-4">
    {fields.map(field => (
      <label key={field.name} className="block">
        <span className="mb-1.5 block text-xs font-bold uppercase text-muted">{field.label}</span>
        {field.type === 'textarea' || field.type === 'list' || field.type === 'json' ? (
          <textarea
            rows={field.type === 'json' ? 8 : 4}
            value={form[field.name] ?? ''}
            onChange={event => onChange(field.name, event.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-bg-page px-3 py-2 text-sm text-text-main outline-none focus:border-accent-primary"
          />
        ) : field.type === 'boolean' ? (
          <button
            type="button"
            onClick={() => onChange(field.name, !form[field.name])}
            className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm ${form[field.name] ? 'border-accent-primary/50 bg-accent-primary/10 text-accent-primary' : 'border-border-subtle bg-bg-page text-muted'}`}
          >
            {form[field.name] ? 'Enabled' : 'Disabled'}
            <Check size={16} className={form[field.name] ? 'opacity-100' : 'opacity-20'} />
          </button>
        ) : field.type === 'select' ? (
          <select
            value={form[field.name] ?? ''}
            onChange={event => onChange(field.name, event.target.value)}
            className="w-full rounded-xl border border-border-subtle bg-bg-page px-3 py-2 text-sm text-text-main outline-none focus:border-accent-primary"
          >
            {(field.options || []).map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        ) : (
          <div className="space-y-2">
            <input
              type={field.type === 'number' ? 'number' : 'text'}
              value={form[field.name] ?? ''}
              onChange={event => onChange(field.name, field.type === 'number' ? Number(event.target.value) : event.target.value)}
              className="w-full rounded-xl border border-border-subtle bg-bg-page px-3 py-2 text-sm text-text-main outline-none focus:border-accent-primary"
            />
            {field.type === 'image' && (
              <input
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={event => onUpload(field.name, event.target.files?.[0])}
                className="w-full rounded-xl border border-border-subtle bg-bg-page px-3 py-2 text-xs text-muted"
              />
            )}
          </div>
        )}
        {field.helper && <span className="mt-1 block text-xs text-muted/70">{field.helper}</span>}
      </label>
    ))}
  </div>
);

const MediaUpload: React.FC<{
  uploading: boolean;
  uploadAlt: string;
  onAltChange: (value: string) => void;
  onUpload: (file?: File) => void;
}> = ({ uploading, uploadAlt, onAltChange, onUpload }) => (
  <div className="mb-4 rounded-2xl border border-border-subtle bg-bg-page/40 p-4">
    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-text-main">
      <Image size={16} /> Upload media
    </div>
    <div className="grid gap-3 md:grid-cols-[1fr_1fr]">
      <input
        value={uploadAlt}
        onChange={event => onAltChange(event.target.value)}
        placeholder="Alt text"
        className="rounded-xl border border-border-subtle bg-bg-page px-3 py-2 text-sm text-text-main outline-none focus:border-accent-primary"
      />
      <input
        type="file"
        accept="image/*"
        disabled={uploading}
        onChange={event => onUpload(event.target.files?.[0])}
        className="rounded-xl border border-border-subtle bg-bg-page px-3 py-2 text-sm text-muted"
      />
    </div>
  </div>
);

function stringifyCell(value: any) {
  if (value === null || value === undefined) return '-';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export default Admin;
