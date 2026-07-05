import { useState, useEffect } from 'react'
import { PortfolioProvider } from './context/PortfolioContext'
import AdminPanel from './components/AdminPanel'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'
import { CaseStudyMindvox, CaseStudyVoterix, CaseStudyHealth4Moni, CaseStudyGaffer } from './pages/CaseStudies'

import { motion, useMotionValue, useSpring } from 'framer-motion'

/* ── Custom cursor ── */
function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const smoothX = useSpring(cursorX, springConfig)
  const smoothY = useSpring(cursorY, springConfig)

  const [hovered, setHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
      if (!isVisible) setIsVisible(true)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setHovered(!!(t.closest('a') || t.closest('button')))
    }
    const leave = () => setIsVisible(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    document.body.addEventListener('mouseleave', leave)
    
    return () => { 
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      document.body.removeEventListener('mouseleave', leave)
    }
  }, [cursorX, cursorY, isVisible])

  if (!isVisible && typeof window !== 'undefined' && window.innerWidth > 768) return null

  return (
    <>
      <motion.div
        style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 9999,
          width: hovered ? 0 : 8, height: hovered ? 0 : 8,
          background: 'rgb(255,128,74)', borderRadius: '50%',
          x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%',
          display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'block'
        }}
      />
      <motion.div
        style={{
          position: 'fixed', pointerEvents: 'none', zIndex: 9998,
          width: hovered ? 44 : 28, height: hovered ? 44 : 28,
          border: '1px solid rgb(255,128,74)', borderRadius: '50%',
          x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%',
          opacity: hovered ? 0.5 : 1,
          display: typeof window !== 'undefined' && window.innerWidth < 768 ? 'none' : 'block'
        }}
      />
    </>
  )
}

/* ── Router ── */
function MainContent() {
  const [route, setRoute] = useState(() => window.location.hash || '#/')

  useEffect(() => {
    // If a user types /admin instead of /#/admin, redirect them to the hash version
    if (window.location.pathname !== '/' && !window.location.hash) {
      window.location.replace(`/#${window.location.pathname}`)
      return
    }

    const onChange = () => { setRoute(window.location.hash || '#/'); window.scrollTo({ top: 0, behavior: 'instant' }) }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const isAdmin = route === '#/admin'

  const renderPage = () => {
    if (isAdmin)                        return <AdminPanel />
    if (route === '#/about')            return <AboutPage />
    if (route === '#/projects')         return <ProjectsPage />
    if (route === '#/contact')          return <ContactPage />
    if (route === '#/case/mindvox')     return <CaseStudyMindvox />
    if (route === '#/case/voterix')     return <CaseStudyVoterix />
    if (route === '#/case/health4moni') return <CaseStudyHealth4Moni />
    if (route === '#/case/gaffer')      return <CaseStudyGaffer />
    return <HomePage />
  }

  const activeLabel = route === '#/about' ? 'About' : route === '#/projects' ? 'Projects' : route === '#/contact' ? 'Contact' : 'Home'

  return (
    // On admin: restore native cursor so the panel is fully usable
    <div style={{ background: 'rgb(1,2,8)', minHeight: '100vh', display: 'flex', flexDirection: 'column', cursor: isAdmin ? 'auto' : undefined }}>
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <Navbar active={activeLabel} />}
      <main style={{ flex: 1 }}>{renderPage()}</main>
    </div>
  )
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainContent />
    </PortfolioProvider>
  )
}
