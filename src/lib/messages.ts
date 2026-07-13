// src/lib/messages.ts
// Contact form submissions, mirrored into Supabase so they show up in Admin →
// Messages in addition to the Web3Forms email notification.

import { supabase } from './supabase'

export interface ContactMessage {
  id: number
  name: string
  email: string
  message: string
  created_at: string
  read: boolean
}

/** Best-effort save — failures here should never block the contact form's own send flow. */
export async function submitMessage(name: string, email: string, message: string): Promise<void> {
  try {
    await supabase.from('contact_messages').insert({ name, email, message })
  } catch {}
}

export async function getMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    if (error || !data) return []
    return data as ContactMessage[]
  } catch {
    return []
  }
}

export async function markMessageRead(id: number, read = true): Promise<void> {
  try {
    await supabase.from('contact_messages').update({ read }).eq('id', id)
  } catch {}
}

export async function deleteMessage(id: number): Promise<void> {
  try {
    await supabase.from('contact_messages').delete().eq('id', id)
  } catch {}
}
