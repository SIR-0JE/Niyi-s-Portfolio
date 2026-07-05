import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Testimonial from '../components/Testimonial'
import Footer from '../components/Footer'
import { usePortfolio } from '../context/PortfolioContext'

const ACCENT = 'rgb(255,128,74)'
const MUTED = 'rgb(203,203,203)'
const BG = 'rgb(1,2,8)'

/* ── Project card ── */
function ProjectCard({ proj, i }: { proj: ReturnType<typeof usePortfolio>['data']['featuredProjects'][0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const ghostY = useTransform(scrollYProgress, [0, 1], [24, -24])
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.12 }}
      whileHover={{ y: -8, borderColor: 'rgba(255,128,74,0.3)' }}
      style={{ display: 'flex', flexDirection: 'column', borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', transition: 'border-color 0.3s ease' }}>
      <div style={{ margin: 20, minHeight: proj.imageUrl ? 'auto' : 400, borderRadius: 16, background: 'rgb(6,8,14)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        {proj.imageUrl ? (
          <img src={proj.imageUrl} alt={proj.name} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(28px,4vw,44px)', color: 'rgba(255,255,255,0.14)', userSelect: 'none' }}>
            Placeholder
          </span>
        )}
      </div>
      <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '0.1em', color: ACCENT, textTransform: 'uppercase' }}>{proj.name}</span>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 'clamp(20px,2.4vw,26px)', lineHeight: 1.3, color: '#fff', maxWidth: 560 }}>{proj.headline}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 48, flexWrap: 'wrap' }}>
          {proj.stats.map((s, si) => (
            <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 24, color: '#fff' }}>{s.before}</span>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 400, fontSize: 18, color: MUTED }}>→</span>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 24, color: ACCENT }}>{s.after}</span>
              </div>
              <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 11, letterSpacing: '0.08em', color: MUTED, textTransform: 'uppercase' }}>{s.label}</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em', color: MUTED, textTransform: 'uppercase' }}>{proj.role}</span>
          <a href={proj.href} style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '0.04em', color: ACCENT, textDecoration: 'none' }}>Case Study ↗</a>
        </div>
      </div>
    </motion.div>
  )
}

function SecHead({ title }: { title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5 }}
      style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: ACCENT, display: 'inline-block', flexShrink: 0 }} />
      <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 40, color: '#fff' }}>{title}</span>
    </motion.div>
  )
}

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: i * 0.07 }}
      onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 20, color: '#fff' }}>{q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}
          style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 24, color: ACCENT, flexShrink: 0 }}>+</motion.span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ display: 'block', overflow: 'hidden', fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: MUTED, maxWidth: 800 }}>
            {a}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function HomePage() {
  const { data } = usePortfolio()
  const h = data.hero
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, -60])
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 })

  return (
    <div style={{ background: BG, display: 'flex', flexDirection: 'column' }}>
      {/* HERO */}
      <section style={{ padding: '160px clamp(24px,5vw,100px) 64px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 80 }}>
          {/* Animated Headline */}
          <motion.div style={{ y: heroY }}>
            <div ref={heroRef}>
              <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(36px, 5.5vw, 72px)', lineHeight: 1.15, letterSpacing: '-0.01em', color: '#fff', margin: 0, textTransform: 'uppercase' }}>
                {[{ text: h.headline1, orange: false }, { text: h.headline2, orange: false }, { text: h.headline3, orange: true }, { text: h.headline4, orange: true }].map((p, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 50 }} animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    style={{ display: 'block', color: p.orange ? ACCENT : '#fff' }}>
                    {p.text}
                  </motion.span>
                ))}
              </h1>
            </div>
          </motion.div>

          {/* Subtext and CTA */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }}
            style={{ display: 'flex', flexDirection: 'row', gap: 40, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 18, lineHeight: 1.6, color: MUTED, maxWidth: 440 }}>{h.subtext}</span>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href={h.cta1Href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', borderRadius: 100, background: ACCENT, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: BG, textDecoration: 'none', whiteSpace: 'nowrap', transition: 'opacity 0.2s' }} onMouseEnter={e => (e.target as HTMLElement).style.opacity = '0.9'} onMouseLeave={e => (e.target as HTMLElement).style.opacity = '1'}>{h.cta1Label}</a>
              <a href={h.cta2Href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 16, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 0.2s' }} onMouseEnter={e => (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'} onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'}>{h.cta2Label}</a>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.85 }}
            style={{ display: 'flex', flexDirection: 'row', gap: 0, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 40 }}>
            {h.stats.map((s, i) => (
              <div key={i} style={{ flex: '1 1 160px', display: 'flex', flexDirection: 'column', gap: 8, padding: i === 0 ? '0 32px 0 0' : '0 32px', borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 36, color: '#fff' }}>{s.value}</span>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 13, color: MUTED }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section style={{ padding: '64px clamp(24px,5vw,100px)', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 40 }}>
          <SecHead title="Expertise" />
          <div style={{ display: 'flex', flexDirection: 'row', gap: 24, flexWrap: 'wrap' }}>
            {data.expertise.map((card, i) => {
              const ref = useRef<HTMLDivElement>(null)
              const inView = useInView(ref, { once: true, amount: 0.2 })
              return (
                <motion.div key={i} ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: i * 0.1 }}
                  style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 16, padding: 32, borderRadius: 16, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 24, color: '#fff' }}>{card.title}</span>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: 1.6, color: MUTED }}>{card.body}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      <section style={{ padding: '64px clamp(24px,5vw,100px)', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <SecHead title="Featured Work" />
            <a href="#/projects" style={{ fontFamily: 'Syne,sans-serif', fontWeight: 500, fontSize: 18, color: '#fff', textDecoration: 'underline' }}>view all</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {data.featuredProjects.map((p, i) => <ProjectCard key={i} proj={p} i={i} />)}
          </div>
        </div>
      </section>

      <Testimonial />

      {/* FAQ */}
      <section style={{ padding: '64px clamp(24px,5vw,100px) 96px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <SecHead title="Frequently Asked Questions" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {data.faqs.map((f, i) => <FAQItem key={i} q={f.question} a={f.answer} i={i} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
