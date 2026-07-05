// src/lib/supabase.ts
// Replace the placeholder values below with your actual Supabase credentials.
// These MUST also be set as environment variables on Vercel:
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn(
    '[Supabase] Missing env vars VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
    'The app will fall back to localStorage only.'
  )
}

export const supabase = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_ANON_KEY || 'placeholder'
)
