// Custom supabase client with proper Database types
import { createClient } from '@supabase/supabase-js';
import type { Database } from './db-types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof localStorage !== 'undefined' ? localStorage : undefined,
    persistSession: typeof localStorage !== 'undefined',
    autoRefreshToken: true,
  }
});
