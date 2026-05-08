/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_GEMINI_API_KEY: string
    readonly VITE_ADMIN_PASSWORD: string
    readonly VITE_RECAPTCHA_SITE_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
