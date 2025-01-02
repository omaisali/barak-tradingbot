// Environment configuration with fallbacks
export const ENV = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
} as const;

// Validate required environment variables
export function validateEnv() {
  const missing = [];
  
  if (!ENV.SUPABASE_URL) missing.push('VITE_SUPABASE_URL');
  if (!ENV.SUPABASE_ANON_KEY) missing.push('VITE_SUPABASE_ANON_KEY');
  
  return missing;
}