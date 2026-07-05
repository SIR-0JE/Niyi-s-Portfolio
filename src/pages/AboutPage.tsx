import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Footer from '../components/Footer'
import Testimonial from '../components/Testimonial'
import { usePortfolio } from '../context/PortfolioContext'

const A = 'rgb(255,128,74)'
const M = 'rgb(203,203,203)'
const BRD = 'rgba(255,255,255,0.1)'

export default function AboutPage() {
  const { data } = usePortfolio()
  const a = data.about
  const exp = data.experience
  const introRef = useRef<HTMLDivElement>(null)
  const introInView = useInView(introRef, { once: true, amount: 0.15 })

  return (
    <div style={{ background: 'rgb(1,2,8)', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 88 }}>
      {/* INTRO */}
      <div style={{ padding: '96px clamp(24px,5vw,100px) 64px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'row', gap: 48, alignItems: 'center', flexWrap: 'wrap' }}>
          <motion.div ref={introRef} initial={{ opacity: 0, x: -30 }} animate={introInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}
            style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1.15, color: '#fff', margin: 0, whiteSpace: 'pre-line' }}>
              {a.introHeadline}
            </h1>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 18, lineHeight: 1.7, color: M, maxWidth: 520, margin: 0 }}>{a.bio}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={introInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.7, delay: 0.15 }}
            style={{ flex: '1 1 340px', minHeight: 420, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: a.portraitUrl ? 'none' : 'repeating-linear-gradient(135deg,rgba(255,128,74,0.12),rgba(255,128,74,0.12) 10px,rgba(255,255,255,0.03) 10px,rgba(255,255,255,0.03) 20px)' }}>
            {a.portraitUrl
              ? <img src={a.portraitUrl} alt="Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Add portrait in Admin → About</span>}
          </motion.div>
        </div>
      </div>

      {/* EXPERIENCE */}
      <div style={{ padding: '32px clamp(24px,5vw,100px) 64px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'row', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 32 }}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 40, color: '#fff' }}>Experience</span>
            <a download href="uploads/cv-1783182758801.docx"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', borderRadius: 100, background: A, fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'rgb(1,2,8)', textDecoration: 'none', width: 'fit-content' }}>
              Download CV
            </a>
          </div>
          <div style={{ flex: '1 1 480px', display: 'flex', flexDirection: 'column', gap: 28 }}>
            {exp.map((job, i) => {
              const ref = useRef<HTMLDivElement>(null)
              const inView = useInView(ref, { once: true, amount: 0.2 })
              return (
                <motion.div key={i} ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingBottom: 28, borderBottom: `1px solid ${BRD}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 22, color: '#fff' }}>{job.role}</span>
                    <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 14, color: M, whiteSpace: 'nowrap' }}>{job.dates}</span>
                  </div>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 16, color: A }}>{job.org}</span>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 15, lineHeight: 1.6, color: M }}>{job.blurb}</span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      <Testimonial />
      <Footer />
    </div>
  )
}
