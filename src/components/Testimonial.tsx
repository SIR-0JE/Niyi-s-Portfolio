import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'

export default function Testimonial() {
  const { data } = usePortfolio()
  const ts = data.testimonials
  const [idx, setIdx] = useState(0)
  const n = ts.length || 1
  const current = ts[idx] || { name: '', role: '', quote: '' }
  const A = 'rgb(255,128,74)'
  const M = 'rgb(203,203,203)'

  return (
    <section style={{ padding: '64px clamp(24px,5vw,100px)', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 20, color: M }}>✸</span>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 40, color: '#fff' }}>What they say</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 48, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center', minWidth: 220 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', flexShrink: 0, background: 'repeating-linear-gradient(45deg,rgba(255,255,255,0.1),rgba(255,255,255,0.1) 6px,rgba(255,255,255,0.03) 6px,rgba(255,255,255,0.03) 12px)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <AnimatePresence mode="wait">
                <motion.span key={`name-${idx}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}
                  style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 24, color: '#fff', display: 'block' }}>{current.name}</motion.span>
              </AnimatePresence>
              <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 16, color: M }}>{current.role}</span>
            </div>
          </div>
          <div style={{ flex: '1 1 480px', position: 'relative', paddingTop: 24 }}>
            <span style={{ position: 'absolute', top: -24, left: 0, fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 64, color: 'rgba(203,203,203,0.35)', lineHeight: 1 }}>"</span>
            <AnimatePresence mode="wait">
              <motion.span key={`quote-${idx}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.35 }}
                style={{ display: 'block', fontFamily: 'Syne,sans-serif', fontWeight: 500, fontSize: 28, lineHeight: 1.4, color: '#fff' }}>{current.quote}</motion.span>
            </AnimatePresence>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'flex-end' }}>
          <button onClick={() => setIdx((idx - 1 + n) % n)} aria-label="Previous" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <button onClick={() => setIdx((idx + 1) % n)} aria-label="Next" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: A, color: 'rgb(1,2,8)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>→</button>
        </div>
      </div>
    </section>
  )
}
