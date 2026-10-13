import {cp,mkdir,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
await mkdir(new URL('dist',root),{recursive:true});
await cp(new URL('app/',root),new URL('dist/',root),{recursive:true});
// Public sign-in settings from the environment (see app/config.js). The service-role key is never read here.
const config={supabaseUrl:process.env.SUPABASE_URL||'',supabaseAnonKey:process.env.SUPABASE_ANON_KEY||'',xProvider:process.env.SUPABASE_X_PROVIDER||'',providers:process.env.SUPABASE_PROVIDERS||''};
await writeFile(new URL('dist/config.js',root),`window.FEM_CONFIG = ${JSON.stringify(config)};\n`);
console.log(`Static app copied to dist. Sign-in ${config.supabaseUrl&&config.supabaseAnonKey?'configured':'not configured'}. No user answers or research source files are packaged.`);
