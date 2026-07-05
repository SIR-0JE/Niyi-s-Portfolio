import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'

const NAV_ITEMS = [
  { label: 'Home',     href: '#/' },
  { label: 'About',    href: '#/about' },
  { label: 'Projects', href: '#/projects' },
  { label: 'Contact',  href: '#/contact' },
]

export default function Navbar({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { data } = usePortfolio()
  const nav = data.navbar

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(1,2,8,0.92)' : 'rgb(1,2,8)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div className="wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '28px clamp(24px,5vw,100px)', gap: 24 }}>
        {/* Logo */}
        <a href="#/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <svg width="34" height="24" viewBox="0 0 46 32">
            <rect x="0" y="0" width="9.5" height="32" rx="0" fill="white" />
            <rect x="23.7" y="0" width="9.5" height="32" rx="0" fill="white" />
            <circle cx="16.6" cy="7.1" r="5.9" fill="rgb(255,128,74)" />
            <circle cx="40.3" cy="24.9" r="5.9" fill="rgb(255,128,74)" />
          </svg>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: '#fff', whiteSpace: 'nowrap' }}>{nav.logoText}</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ gap: 40, alignItems: 'center' }}>
          {NAV_ITEMS.map(it => (
            <a key={it.label} href={it.href} style={{
              fontFamily: 'Syne,sans-serif',
              fontWeight: it.label === active ? 700 : 500,
              fontSize: 18,
              color: it.label === active ? 'rgb(255,128,74)' : 'rgb(203,203,203)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}>
              {it.label}
            </a>
          ))}
        </nav>

        {/* Hire Me pill */}
        <a href={nav.hireMeHref} className="hidden md:flex" style={{
          flexShrink: 0, alignItems: 'center', justifyContent: 'center',
          padding: '10px 24px', borderRadius: 100,
          border: '1.5px solid #fff',
          fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 14, letterSpacing: '0.04em',
          color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap',
          transition: 'background 0.2s, color 0.2s',
        }}
          onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgb(255,128,74)'; (e.target as HTMLElement).style.borderColor = 'rgb(255,128,74)'; (e.target as HTMLElement).style.color = 'rgb(1,2,8)' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.borderColor = '#fff'; (e.target as HTMLElement).style.color = '#fff' }}
        >
          HIRE ME
        </a>

        {/* Mobile burger */}
        <button onClick={() => setOpen(o => !o)} className="md:hidden" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ display: 'block', width: 24, height: 1.5, background: '#fff', transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none', transition: 'transform 0.25s' }} />
          <span style={{ display: 'block', width: open ? 24 : 16, height: 1.5, background: '#fff', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none', transition: 'all 0.25s' }} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="wrap" style={{ paddingTop: 20, paddingBottom: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
              {NAV_ITEMS.map(it => (
                <a key={it.label} href={it.href} onClick={() => setOpen(false)} style={{ fontFamily: 'Syne,sans-serif', fontWeight: it.label === active ? 700 : 500, fontSize: 18, color: it.label === active ? 'rgb(255,128,74)' : 'rgb(203,203,203)', textDecoration: 'none' }}>
                  {it.label}
                </a>
              ))}
              <a href={nav.hireMeHref} style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 14, color: '#fff', border: '1.5px solid #fff', borderRadius: 100, padding: '10px 24px', textDecoration: 'none', textAlign: 'center' }}>
                HIRE ME
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
