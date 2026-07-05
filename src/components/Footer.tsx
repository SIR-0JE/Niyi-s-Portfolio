import { motion } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'

export default function Footer() {
  const { data } = usePortfolio()
  const f = data.footer
  return (
    <footer style={{ width: '100%', background: 'rgb(1,2,8)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 56, paddingBottom: 40, paddingLeft: 'clamp(24px,5vw,100px)', paddingRight: 'clamp(24px,5vw,100px)', boxSizing: 'border-box', fontFamily: 'Poppins,sans-serif' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, textAlign: 'center' }}>
          <motion.span initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(36px,5vw,64px)', lineHeight: 1.1, color: '#fff', display: 'block' }}>{f.cta}</motion.span>
          <motion.a initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            href={`mailto:${f.email}`}
            style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 18, color: '#fff', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.4)', paddingBottom: 2 }}>{f.email}</motion.a>
        </div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24 }}>
          <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 400, fontSize: 14, color: 'rgb(203,203,203)' }}>{f.copyright}</span>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 28, flexWrap: 'wrap' }}>
            {f.links.map((l, i) => (
              <a key={i} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ fontFamily: 'Syne,sans-serif', fontWeight: 500, fontSize: 14, color: 'rgb(203,203,203)', textDecoration: 'none' }}>{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
