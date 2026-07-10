import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Footer from '../components/Footer'
import LiveProjectButton from '../components/LiveProjectButton'
import { usePortfolio } from '../context/PortfolioContext'
import type { Project } from '../context/PortfolioContext'

const A = 'rgb(255,128,74)'
const M = 'rgb(203,203,203)'
const STRIPES = 'repeating-linear-gradient(135deg,rgba(255,128,74,0.14),rgba(255,128,74,0.14) 12px,rgba(255,255,255,0.03) 12px,rgba(255,255,255,0.03) 24px)'

/* Full-width, no-crop hero/process image — falls back to a striped placeholder
   (same motif used elsewhere on the site for "no image yet") instead of an empty box. */
function DetailImage({ url, alt }: { url: string; alt: string }) {
  if (url) return <img src={url} alt={alt} style={{ maxWidth: 1240, width: '100%', margin: '0 auto', display: 'block', height: 'auto', borderRadius: 20, border: '1px solid rgba(255,128,74,0.2)' }} />
  return (
    <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', height: 360, borderRadius: 20, background: STRIPES, border: '1px solid rgba(255,128,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 14, color: 'rgba(255,255,255,0.55)', textAlign: 'center', padding: '0 24px' }}>Cover image needed — add in Admin → Projects</span>
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

const sectionTitle: React.CSSProperties = { fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 32, color: '#fff' }
const bodyText: React.CSSProperties = { fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 16, lineHeight: 1.7, color: M, maxWidth: 720, margin: 0 }

function ProjectDetailPage({ p }: { p: Project }) {
  const s = p.sections
  const tools = p.tools.split(',').map(t => t.trim()).filter(Boolean)

  return (
    <div style={{ background: 'rgb(1,2,8)', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 88 }}>
      {/* Sticky Back Button */}
      <div className="fixed z-40 pointer-events-none" style={{ top: 110, left: 0, right: 0, padding: '0 clamp(24px,5vw,100px)', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex' }}>
          <a href="#/projects" className="pointer-events-auto inline-flex items-center gap-2 font-['Poppins',sans-serif] font-medium text-[13px] text-[rgb(203,203,203)] bg-[rgba(1,2,8,0.5)] backdrop-blur-md px-4 py-2 rounded-full border border-[rgba(255,255,255,0.1)] hover:text-[#fff] hover:border-[rgba(255,128,74,0.5)] transition-all duration-200 no-underline shadow-lg" style={{ textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </a>
        </div>
      </div>

      {/* Hero cover */}
      <div style={{ padding: '64px clamp(24px,5vw,100px)', boxSizing: 'border-box' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <DetailImage url={p.coverImageUrl} alt={p.name} />
        </motion.div>
      </div>

      {/* Headline + hero stats */}
      <div style={{ padding: '96px clamp(24px,5vw,100px) 64px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {p.category && <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 500, fontSize: 16, letterSpacing: '0.08em', color: A, textTransform: 'uppercase' }}>{p.category}</span>}
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(36px,5vw,56px)', lineHeight: 1.15, color: '#fff', margin: 0 }}>{p.headline || p.name}</h1>
          </motion.div>
          {p.stats.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              style={{ display: 'flex', flexDirection: 'row', gap: 48, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
              {p.stats.map((st, i) => (
                <div key={i} style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 32, color: A }}>{st.val}</span>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 14, color: M }}>{st.label}</span>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Meta row: role / year / category / tools */}
      <Sec>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 48 }}>
          {[
            { label: 'Role', val: p.role },
            { label: 'Year', val: p.year },
            { label: 'Category', val: p.categoryTag },
            { label: 'Tools', val: tools.join(' · ') },
          ].filter(c => c.val).map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.08em', color: M, textTransform: 'uppercase' }}>{c.label}</span>
              <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 18, color: '#fff' }}>{c.val}</span>
            </div>
          ))}
        </div>
      </Sec>

      {/* Problem */}
      {s.problem && p.problem && (
        <Sec>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <span style={sectionTitle}>The Problem</span>
            <p style={bodyText}>{p.problem}</p>
          </div>
        </Sec>
      )}

      {/* Process / wireframes image */}
      {p.processImageUrl && (
        <div style={{ padding: '0 clamp(24px,5vw,100px) 64px', boxSizing: 'border-box' }}>
          <DetailImage url={p.processImageUrl} alt={`${p.name} process`} />
        </div>
      )}

      {/* Research */}
      {s.research && p.research && (
        <Sec>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <span style={sectionTitle}>The Research</span>
            <p style={bodyText}>{p.research}</p>
          </div>
        </Sec>
      )}

      {/* Process */}
      {s.process && p.process.length > 0 && (
        <Sec>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <span style={sectionTitle}>The Process</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {p.process.map((step, i) => (
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
      )}

      {/* Outcome */}
      {s.outcome && p.outcomes.length > 0 && (
        <Sec>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <span style={sectionTitle}>The Outcome</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 32 }}>
              {p.outcomes.map((o, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 24, borderRadius: 16, background: 'rgba(255,128,74,0.1)', border: '1px solid rgba(255,128,74,0.2)' }}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 28, color: A }}>{o.val}</span>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 14, color: M }}>{o.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Sec>
      )}

      {/* Reflection */}
      {s.reflection && p.reflection && (
        <Sec>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <span style={sectionTitle}>Reflection</span>
            <p style={bodyText}>{p.reflection}</p>
          </div>
        </Sec>
      )}

      {/* Closing CTA */}
      <Sec>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 28, color: '#fff' }}>See the full project</span>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {p.liveUrl && <LiveProjectButton href={p.liveUrl} />}
            <a href={p.behanceUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', borderRadius: 100, background: A, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'rgb(1,2,8)', textDecoration: 'none' }}>
              View on Behance ↗
            </a>
          </div>
        </div>
      </Sec>

      <div style={{ marginTop: 'auto' }}><Footer /></div>
    </div>
  )
}

function NotFound({ slug }: { slug: string }) {
  return (
    <div style={{ paddingTop: 120, paddingBottom: 120, textAlign: 'center', color: 'white', fontFamily: 'Syne,sans-serif' }}>
      <p>Project <code>{slug}</code> not found in Admin.</p>
      <a href="#/projects" style={{ color: A }}>← All projects</a>
    </div>
  )
}

export default function ProjectDetail({ slug }: { slug: string }) {
  const { data } = usePortfolio()
  const project = data.projects.find(p => p.slug === slug)
  return project ? <ProjectDetailPage p={project} /> : <NotFound slug={slug} />
}
