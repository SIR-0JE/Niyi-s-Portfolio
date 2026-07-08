import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Footer from '../components/Footer'
import { usePortfolio } from '../context/PortfolioContext'

const A = 'rgb(255,128,74)'
const M = 'rgb(203,203,203)'

function ProjectCard({ proj, i }: { proj: ReturnType<typeof usePortfolio>['data']['caseStudies'][0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.08 })

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', flexDirection: 'column', borderRadius: 24, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      {/* Cover */}
      <div className="aspect-video" style={{ margin: 20, borderRadius: 16, background: 'rgb(6,8,14)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        {proj.coverImageUrl && <img src={proj.coverImageUrl} alt={proj.category} className="absolute inset-0 w-full h-full object-cover" />}
      </div>
      {/* Body */}
      <div style={{ padding: '0 32px 32px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="text-orange-500 font-bold uppercase text-xs tracking-widest">{proj.slug}</span>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 'clamp(22px,2.6vw,28px)', lineHeight: 1.3, color: '#fff', maxWidth: 560 }}>{proj.headline}</span>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 11, letterSpacing: '0.04em', color: M, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.06)' }}>
            {proj.role}
          </span>
          <a href={`#/case/${proj.slug}`} style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '0.04em', color: A, textTransform: 'uppercase', textDecoration: 'none', whiteSpace: 'nowrap' }}>Case Study ↗</a>
        </div>
      </div>
    </motion.div>
  )
}

function OtherWorkCard({ item, i }: { item: ReturnType<typeof usePortfolio>['data']['otherWork'][0]; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.a ref={ref} href={item.externalUrl} target="_blank" rel="noopener noreferrer"
      initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'block', textDecoration: 'none', borderRadius: 16, background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      <div className="aspect-video" style={{ background: 'rgb(6,8,14)', position: 'relative', overflow: 'hidden' }}>
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />}
      </div>
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 10, letterSpacing: '0.06em', color: A, textTransform: 'uppercase' }}>{item.tag}</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 15, color: '#fff' }}>{item.title}</span>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.04em', color: M, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Behance ↗</span>
        </div>
      </div>
    </motion.a>
  )
}

export default function ProjectsPage() {
  const hRef = useRef<HTMLDivElement>(null)
  const hInView = useInView(hRef, { once: true, amount: 0.2 })
  const owRef = useRef<HTMLDivElement>(null)
  const owInView = useInView(owRef, { once: true, amount: 0.2 })
  const { data } = usePortfolio()

  return (
    <div style={{ background: 'rgb(1,2,8)', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 88 }}>
      {/* Header */}
      <div style={{ padding: '96px clamp(24px,5vw,100px) 40px', boxSizing: 'border-box' }}>
        <div ref={hRef} style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={hInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', color: '#fff', margin: 0 }}>
            Selected Projects
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={hInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 18, color: M, maxWidth: 640, lineHeight: 1.6, margin: 0 }}>
            Four case studies where research led the design, and the design moved a real number.
          </motion.p>
        </div>
      </div>

      {/* Projects */}
      <div style={{ padding: '24px clamp(24px,5vw,100px) 96px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {data.caseStudies.map((p, i) => <ProjectCard key={p.slug} proj={p} i={i} />)}
        </div>
      </div>

      {/* Other Work */}
      {data.otherWork.length > 0 && (
        <div style={{ padding: '0 clamp(24px,5vw,100px) 96px', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div ref={owRef} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <motion.h2 initial={{ opacity: 0, y: 20 }} animate={owInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }}
                style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 'clamp(24px,3vw,32px)', color: '#fff', margin: 0 }}>
                More Explorations
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={owInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55, delay: 0.08 }}
                style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 15, color: M, maxWidth: 560, lineHeight: 1.6, margin: 0 }}>
                Landing pages, screens, and visual work — full shots live on Behance.
              </motion.p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {data.otherWork.map((item, i) => <OtherWorkCard key={i} item={item} i={i} />)}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
