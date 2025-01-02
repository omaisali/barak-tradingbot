import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { ENV, validateEnv } from '../config/env';

// Check for missing environment variables
const missingEnv = validateEnv();

if (missingEnv.length > 0) {
  console.error(
    `Missing required environment variables:\n${missingEnv.join('\n')}\n` +
    'Please click the "Connect to Supabase" button to set up your project.'
  );
}

export const supabase = createClient<Database>(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY
);