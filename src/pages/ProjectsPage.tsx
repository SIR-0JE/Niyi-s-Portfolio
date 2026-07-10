import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Footer from '../components/Footer'
import ProjectCard from '../components/ProjectCard'
import { usePortfolio } from '../context/PortfolioContext'

const M = 'rgb(203,203,203)'

export default function ProjectsPage() {
  const hRef = useRef<HTMLDivElement>(null)
  const hInView = useInView(hRef, { once: true, amount: 0.2 })
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
            Case studies, landing pages, and UI explorations — where research led the design, and the work speaks for itself.
          </motion.p>
        </div>
      </div>

      {/* Projects */}
      <div style={{ padding: '24px clamp(24px,5vw,100px) 96px', boxSizing: 'border-box' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 32 }}>
          {data.projects.map((p, i) => <ProjectCard key={p.slug} p={p} i={i} />)}
        </div>
      </div>

      <Footer />
    </div>
  )
}
