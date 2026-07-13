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

export interface VisitorStats {
  totalVisitors: number
  returningVisitors: number
  newToday: number
  last24h: number
  totalVisits: number
}

function getSessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    // localStorage unavailable (private browsing edge cases) — fall back to a
    // per-load id, which just means this visit won't be recognized as a return next time.
    return crypto.randomUUID()
  }
}

/** Skip tracking entirely once this browser has ever logged into Admin — avoids the site owner inflating their own numbers. */
export function shouldTrack(): boolean {
  try {
    return sessionStorage.getItem('admin_v2') !== 'true'
  } catch {
    return true
  }
}

/** Call once per app load. Registers/updates this browser's visitor row. */
export async function trackVisit(): Promise<void> {
  if (!shouldTrack()) return
  try {
    await supabase.rpc('track_visit', { p_session_id: getSessionId() })
  } catch {
    // Analytics failures should never affect the visitor's experience.
  }
}

/** Call on every route change. Logs one page view for this browser. */
export async function trackPageView(path: string): Promise<void> {
  if (!shouldTrack()) return
  try {
    await supabase.from('page_views').insert({ session_id: getSessionId(), path })
  } catch {}
}

/**
 * Aggregate visitor counts for the Admin dashboard.
 * @param since  Optional ISO timestamp — if supplied, stats are scoped to visitors
 *               whose `last_seen` is on or after this value.
 * Returns null on error.
 */
export async function getVisitorStats(since?: string): Promise<VisitorStats | null> {
  try {
    let query = supabase.from('visitors').select('session_id, first_seen, last_seen, visit_count')
    if (since) query = query.gte('last_seen', since)
    const { data, error } = await query
    if (error || !data) return null

    const todayStr = new Date().toISOString().slice(0, 10)
    const last24hCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    return {
      totalVisitors: data.length,
      returningVisitors: data.filter(v => v.visit_count > 1).length,
      newToday: data.filter(v => v.first_seen.slice(0, 10) === todayStr).length,
      last24h: data.filter(v => v.last_seen >= last24hCutoff).length,
      totalVisits: data.reduce((sum, v) => sum + v.visit_count, 0),
    }
  } catch {
    return null
  }
}

/**
 * Most-viewed paths, aggregated client-side.
 * @param since  Optional ISO timestamp — only page_views recorded after this are counted.
 */
export async function getMostViewedPaths(limit = 20, since?: string): Promise<PathViews[]> {
  try {
    let query = supabase.from('page_views').select('path, viewed_at').limit(5000)
    if (since) query = query.gte('viewed_at', since)
    const { data, error } = await query
    if (error || !data) return []
    const counts = new Map<string, number>()
    for (const row of data) counts.set(row.path, (counts.get(row.path) || 0) + 1)
    return [...counts.entries()]
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
  } catch {
    return []
  }
}

/**
 * Most recent visitors, newest last-seen first.
 * @param since  Optional ISO timestamp — only visitors last seen after this are returned.
 */
export async function getRecentVisitors(limit = 50, since?: string): Promise<Visitor[]> {
  try {
    let query = supabase.from('visitors').select('*').order('last_seen', { ascending: false }).limit(limit)
    if (since) query = query.gte('last_seen', since)
    const { data, error } = await query
    if (error || !data) return []
    return data as Visitor[]
  } catch {
    return []
  }
}

/** Full page-view history for one visitor, oldest first — "what they checked". */
export async function getVisitorPageViews(sessionId: string): Promise<{ path: string; viewed_at: string }[]> {
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('path, viewed_at')
      .eq('session_id', sessionId)
      .order('viewed_at', { ascending: true })
    if (error || !data) return []
    return data
  } catch {
    return []
  }
}

/** Convenience helper — returns an ISO string for N hours ago. */
export function hoursAgo(n: number): string {
  return new Date(Date.now() - n * 60 * 60 * 1000).toISOString()
}

/** Convenience helper — returns an ISO string for N days ago. */
export function daysAgo(n: number): string {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()
}
