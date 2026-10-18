// Public runtime settings. The build (scripts/build.js) replaces this file in dist/ with values from
// the Vercel environment (SUPABASE_URL, SUPABASE_ANON_KEY, optional SUPABASE_X_PROVIDER and SUPABASE_PROVIDERS; payments and vipps are on/off flags only). Both
// Supabase values are public by design; never put a service-role key here. Empty = sign-in hidden.
window.FEM_CONFIG = {supabaseUrl: '', supabaseAnonKey: '', xProvider: '', providers: '', payments: false, vipps: false};
