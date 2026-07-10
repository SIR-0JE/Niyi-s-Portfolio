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

/**
 * Uploads an image file to the "portfolio-images" bucket and returns the public URL.
 */
export async function uploadImage(file: File): Promise<string | null> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[Supabase] Cannot upload image: credentials missing.')
    return null
  }

  // Generate a unique filename to prevent collisions
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
  const filePath = `${fileName}`

  try {
    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      console.error('[Supabase] Upload error:', uploadError.message)
      return null
    }

    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath)
      
    return data.publicUrl
  } catch (err) {
    console.error('[Supabase] Unexpected upload error:', err)
    return null
  }
}
