// src/lib/analytics.ts
// Lightweight, anonymous visit tracking backed by Supabase.
// No names, no IP addresses, no cross-site cookies — just a random id kept in this
// browser's localStorage so we can tell "same browser came back" from "new browser".

import { supabase } from './supabase'

const SESSION_KEY = 'visitor_session_id'

export interface Visitor {
  session_id: string
  first_seen: string
  last_seen: string
  visit_count: number
}

export interface PathViews {
  path: string
  views: number
}

