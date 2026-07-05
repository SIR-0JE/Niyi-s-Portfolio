import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Footer from '../components/Footer'
import { usePortfolio } from '../context/PortfolioContext'
import type { CaseStudyContent } from '../context/PortfolioContext'

const A = 'rgb(255,128,74)'
const M = 'rgb(203,203,203)'

function ImagePlaceholder({ caption, url }: { caption: string; url?: string }) {
  if (url) return <img src={url} alt={caption} style={{ maxWidth: 1240, width: '100%', margin: '0 auto', display: 'block', height: 400, objectFit: 'cover', borderRadius: 20, border: '1px solid rgba(255,128,74,0.2)' }} />
  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', height: 400, borderRadius: 20, background: 'linear-gradient(135deg,rgba(255,128,74,0.2),rgba(255,128,74,0.05))', border: '1px solid rgba(255,128,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 16, color: M }}>{caption}</span>
    </div>
  )
}

function Sec({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
      style={{ padding: '64px clamp(24px,5vw,100px)', boxSizing: 'border-box', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%' }}>{children}</div>
    </motion.div>
  )
}

function CaseStudyPage({ cs }: { cs: CaseStudyContent }) {
  return (
    <div style={{ background: 'rgb(1,2,8)', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 88 }}>
      <div style={{ padding: '64px clamp(24px,5vw,100px)', boxSizing: 'border-box' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <ImagePlaceholder caption="Hero image — add in Admin → Case Studies → Images" url={cs.coverImageUrl} />
        </motion.div>
      </div>

      <div style={{ padding: '96px clamp(24px,5vw,100px) 64px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.08em', color: A, textTransform: 'uppercase' }}>{cs.category}</span>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(36px,5vw,56px)', lineHeight: 1.15, color: '#fff', margin: 0 }}>{cs.headline}</h1>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'row', gap: 48, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
            {cs.stats.map((s, i) => (
              <div key={i} style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 32, color: A }}>{s.val}</span>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 14, color: M }}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <Sec>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 48 }}>
          {[{ label: 'Role', val: cs.role }, { label: 'Timeline', val: cs.timeline }, { label: 'Category', val: cs.categoryTag }].map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em', color: M, textTransform: 'uppercase' }}>{c.label}</span>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 18, color: '#fff' }}>{c.val}</span>
            </div>
          ))}
        </div>
      </Sec>

      <Sec>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 32, color: '#fff' }}>The Problem</span>
          <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: 1.7, color: M, maxWidth: 720, margin: 0 }}>{cs.problem}</p>
        </div>
      </Sec>

      <div style={{ padding: '0 clamp(24px,5vw,100px) 64px', boxSizing: 'border-box' }}>
        <ImagePlaceholder caption="Process / wireframes — add in Admin → Case Studies → Images" url={cs.processImageUrl} />
      </div>

      <Sec>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 32, color: '#fff' }}>The Process</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {cs.process.map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 20, color: A, flexShrink: 0 }}>{i + 1}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 18, color: '#fff' }}>{step.title}</span>
                  <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 15, lineHeight: 1.6, color: M, margin: 0 }}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      <Sec>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 32, color: '#fff' }}>The Outcome</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 32 }}>
            {cs.outcomes.map((o, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24, borderRadius: 16, background: 'rgba(255,128,74,0.1)', border: '1px solid rgba(255,128,74,0.2)' }}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 28, color: A }}>{o.val}</span>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 14, color: M }}>{o.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Sec>

      <Sec>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 28, color: '#fff' }}>See the full project</span>
          <a href={cs.behanceUrl} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', borderRadius: 100, background: A, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'rgb(1,2,8)', textDecoration: 'none' }}>
            View on Behance ↗
          </a>
        </div>
      </Sec>

      <div style={{ marginTop: 'auto' }}><Footer /></div>
    </div>
  )
}

/* ── One file exports all 4 case studies, each reading its own context entry ── */
function useCaseStudy(slug: string): CaseStudyContent | null {
  const { data } = usePortfolio()
  return data.caseStudies.find(c => c.slug === slug) ?? null
}

function NotFound({ slug }: { slug: string }) {
  return (
    <div style={{ paddingTop: 120, textAlign: 'center', color: 'white', fontFamily: 'Syne,sans-serif' }}>
      <p>Case study <code>{slug}</code> not found in Admin.</p>
      <a href="#/projects" style={{ color: A }}>← All projects</a>
    </div>
  )
}

export function CaseStudyMindvox() {
  const cs = useCaseStudy('mindvox')
  return cs ? <CaseStudyPage cs={cs} /> : <NotFound slug="mindvox" />
}
export function CaseStudyVoterix() {
  const cs = useCaseStudy('voterix')
  return cs ? <CaseStudyPage cs={cs} /> : <NotFound slug="voterix" />
}
export function CaseStudyHealth4Moni() {
  const cs = useCaseStudy('health4moni')
  return cs ? <CaseStudyPage cs={cs} /> : <NotFound slug="health4moni" />
}
export function CaseStudyGaffer() {
  const cs = useCaseStudy('gaffer')
  return cs ? <CaseStudyPage cs={cs} /> : <NotFound slug="gaffer" />
}
