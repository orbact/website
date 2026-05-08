# Orbact AI Company Website

A modern, full-stack AI company website built with React, TypeScript, and Supabase. Features include AI chatbot, project portfolio management, admin panel, and more.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **Supabase Account** ([Sign up](https://supabase.com/))
- **Google Gemini API Key** ([Get key](https://makersuite.google.com/app/apikey))
- **Google reCAPTCHA v2** ([Setup](https://www.google.com/recaptcha/admin/create))
- **(Optional) Supabase CLI** for Edge Functions ([Install](https://supabase.com/docs/guides/cli))

> **⚠️ Security Note:** For production, implement the Supabase Edge Function to keep your Gemini API key secure.  
> See [API_SECURITY.md](API_SECURITY.md) for detailed instructions.

### Installation

1. **Clone and Install Dependencies**
   ```bash
   cd "d:\Work\Orbact\Website\Version 1"
   npm install
   ```

2. **Set Up Environment Variables**
   ```bash
   # Copy the example file
   copy .env.local.example .env.local
   ```
   
   Then edit `.env.local` with your actual values:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_ADMIN_PASSWORD=your_secure_password_here
   VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
   ```

3. **Set Up Supabase Database**
   - Open your [Supabase Dashboard](https://supabase.com/dashboard)
   - Go to **SQL Editor**
   - Run the SQL files in order:
     1. `supabase-schema.sql` (projects table)
     2. `supabase-schema-extended.sql` (all other tables)
   
   - Set up Storage:
     - Go to **Storage** → Create bucket: `project-images`
     - Make it **public**

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   
   Visit: `http://localhost:3000`

---

## 🔐 Admin Access

The website has a **hidden admin panel** for managing content:

1. **Press `Ctrl+Alt+O`** anywhere on the website
2. **Login** with your password + reCAPTCHA
3. **Manage Content:**
   - ✅ Add/Edit/Delete Projects (Works page)
   - 🚧 Services, Pricing, Team (coming soon - infrastructure ready)

**Note:** Admin button is completely invisible to public users!

---

## 📁 Project Structure

```
d:\Work\Orbact\Website\Version 1\
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Global layout with admin controls
│   ├── Hero.tsx        # Homepage hero section
│   ├── Chatbot.tsx     # AI chatbot (uses Gemini API)
│   └── ...
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Solutions.tsx
│   ├── Works.tsx       # Project portfolio (admin-enabled)
│   ├── Pricing.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── services/           # API/Database services
│   ├── projectService.ts     # Projects CRUD
│   ├── serviceService.ts     # Services CRUD (ready)
│   ├── pricingService.ts     # Pricing CRUD (ready)
│   └── teamService.ts        # Team CRUD (ready)
├── lib/
│   ├── supabase.ts     # Supabase client
│   └── adminAuth.ts    # Admin authentication
├── .env.local.example  # Environment template
└── index.html          # Entry point
```

---

## 🔧 Environment Variables Guide

### Required for Core Functionality

| Variable | Purpose | How to Get |
|----------|---------|------------|
| `VITE_GEMINI_API_KEY` | AI Chatbot | [Get API Key](https://makersuite.google.com/app/apikey) |
| `VITE_SUPABASE_URL` | Database & Storage | Your Supabase project dashboard |
| `VITE_SUPABASE_ANON_KEY` | Database access | Your Supabase project dashboard |

### Required for Admin Panel

| Variable | Purpose | How to Get |
|----------|---------|------------|
| `VITE_ADMIN_PASSWORD` | Admin login | Choose a secure password |
| `VITE_RECAPTCHA_SITE_KEY` | Bot protection | [Setup reCAPTCHA](https://www.google.com/recaptcha/admin/create) |

### Optional

| Variable | Purpose | How to Get |
|----------|---------|------------|
| `VITE_MAKE_WEBHOOK_URL` | Contact form | [Make.com](https://www.make.com) webhook |

---

## 📚 Detailed Setup Guides

### 1. Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Get API Key"**
3. Create new API key or use existing
4. Copy the key → paste in `.env.local`

### 2. Supabase Setup

**Get Credentials:**
1. Create project at [Supabase](https://supabase.com/dashboard)
2. Go to **Settings** → **API**
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

**Create Database:**
1. **SQL Editor** → Run `supabase-schema.sql`
2. **SQL Editor** → Run `supabase-schema-extended.sql`
3. Verify tables created in **Table Editor**

**Create Storage:**
1. **Storage** → **New bucket**: `project-images`
2. Make it **Public**
3. Done!

### 3. Google reCAPTCHA

1. Go to [reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Register a new site:
   - **Label:** Orbact Admin
   - **Type:** reCAPTCHA v2 (checkbox)
   - **Domains:** `localhost`, your-domain.com
3. Copy **Site Key** → `VITE_RECAPTCHA_SITE_KEY`

### 4. Admin Password

Choose a strong password and add to `.env.local`:
```env
VITE_ADMIN_PASSWORD=YourSecurePassword123!
```

**Security Note:** This is suitable for personal/small business use. For enterprise, consider Supabase Auth.

---

## 🎨 Features

- ✅ **AI Chatbot** - Powered by Google Gemini
- ✅ **Project Portfolio** - Admin-managed with CRUD
- ✅ **Admin Panel** - Hidden keyboard shortcut (Ctrl+Alt+O)
- ✅ **Dark/Light Mode** - Theme toggle
- ✅ **Contact Form** - Integrates with Make.com
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Glassmorphism UI** - Modern aesthetic
- 🚧 **Full CMS** - Services, Pricing, Team (infrastructure ready)

---

## 🔍 Troubleshooting

### "Blank page after npm run dev"
- Check browser console for errors
- Verify `.env.local` has all required variables
- Restart dev server after env changes

### "Chatbot not responding"
- Check `VITE_GEMINI_API_KEY` is valid
- Verify API key has no usage limits reached

### "Admin login not working"
- Verify `VITE_ADMIN_PASSWORD` matches your input
- Check `VITE_RECAPTCHA_SITE_KEY` is correct
- Complete reCAPTCHA checkbox before login

### "Projects not loading"
- Check Supabase credentials are correct
- Verify `projects` table exists
- Check browser console for errors

---

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 🚢 Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Set environment variables in your hosting platform:**
   - Vercel, Netlify, etc. have environment variable settings
   - Add all `VITE_*` variables from `.env.local`

3. **Deploy:**
   - Upload `dist/` folder
   - Or connect Git repository for auto-deploy

---



## 🤝 Support

For issues or questions:
- Check the documentation files
- Review environment setup carefully
- Ensure all API keys are valid

---

## 📄 License

Private project - All rights reserved.
