// src/lib/db.ts
// Thin wrapper around Supabase for reading and writing portfolio content.

import { supabase } from './supabase'
import type { PortfolioContent } from '../context/PortfolioContext'

const ROW_ID = 'main'
const TABLE = 'portfolio_content'

/** Fetch the portfolio data from Supabase. Returns null on error. */
export async function fetchPortfolio(): Promise<PortfolioContent | null> {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select('data')
      .eq('id', ROW_ID)
      .single()

    if (error || !data) return null
    return data.data as PortfolioContent
  } catch {
    return null
  }
}

/** Upsert the full portfolio data to Supabase. */
export async function savePortfolio(content: PortfolioContent): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, data: content, updated_at: new Date().toISOString() })

    return !error
  } catch {
    return false
  }
}
