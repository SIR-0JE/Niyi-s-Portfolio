import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { PROJECT_TYPE_LABELS } from '../context/PortfolioContext'
import type { Project } from '../context/PortfolioContext'

const A = 'rgb(255,128,74)'
const M = 'rgb(203,203,203)'
const STRIPES = 'repeating-linear-gradient(135deg,rgba(255,128,74,0.14),rgba(255,128,74,0.14) 12px,rgba(255,255,255,0.03) 12px,rgba(255,255,255,0.03) 24px)'

/** Shared card used on both Home ("Featured Work") and the Projects grid — one project, one card design. */
export default function ProjectCard({ p, i }: { p: Project; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', borderRadius: 24, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      {/* Cover — real image or a clean placeholder, never an empty box */}
      <div className="aspect-video" style={{ margin: 20, borderRadius: 16, background: 'rgb(6,8,14)', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
        {p.coverImageUrl ? (
          <img src={p.coverImageUrl} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: STRIPES, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center', padding: '0 16px' }}>{p.name || 'Untitled project'}</span>
          </div>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', color: A, textTransform: 'uppercase' }}>{PROJECT_TYPE_LABELS[p.type]}</span>
            <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 11, letterSpacing: '0.06em', color: M, textTransform: 'uppercase', padding: '3px 10px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.15)' }}>
              {p.badge === 'client' ? 'Client' : 'Personal'}
            </span>
          </div>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 'clamp(22px,2.6vw,28px)', lineHeight: 1.3, color: '#fff', maxWidth: 560 }}>{p.headline || p.name}</span>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 11, letterSpacing: '0.04em', color: M, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.06)' }}>
            {p.role || p.name}
          </span>
          <a href={`#/project/${p.slug}`} style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '0.04em', color: A, textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {PROJECT_TYPE_LABELS[p.type]} ↗
          </a>
        </div>
      </div>
    </motion.div>
  )
}
