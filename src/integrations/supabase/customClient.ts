// Custom supabase client with proper Database types
import { createClient } from '@supabase/supabase-js';
import type { Database } from './db-types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const isServer = typeof globalThis.localStorage === 'undefined';

export const supabase = createClient<Database>(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_PUBLISHABLE_KEY || 'placeholder',
  {
    auth: {
      storage: isServer ? undefined : globalThis.localStorage,
      persistSession: !isServer,
      autoRefreshToken: true,
    }
  }
);
