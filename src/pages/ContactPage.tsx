import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Footer from '../components/Footer'

const A = 'rgb(255,128,74)'
const M = 'rgb(203,203,203)'

const inputStyle: React.CSSProperties = {
  fontFamily: 'Poppins,sans-serif', fontSize: 16, color: '#fff',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 10, padding: '14px 16px', outline: 'none', boxSizing: 'border-box',
  width: '100%',
}

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <div style={{ background: 'rgb(1,2,8)', minHeight: '100vh', display: 'flex', flexDirection: 'column', paddingTop: 88 }}>
      <div style={{ flex: 1, padding: '96px clamp(24px,5vw,100px)', boxSizing: 'border-box' }}>
        <div ref={ref} style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'row', gap: 64, flexWrap: 'wrap' }}>

          {/* Left: headline + contacts */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }}
            style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1.15, color: '#fff', margin: 0 }}>
              Let&apos;s build<br />something<br /><span style={{ color: A }}>user-centered.</span>
            </h1>
            <p style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 400, fontSize: 18, lineHeight: 1.7, color: M, maxWidth: 440, margin: 0 }}>
              Open to freelance and full-time UI/UX roles. Tell me about your product and I&apos;ll get back to you quickly.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>
              {[
                { label: 'Email', val: 'olaniyiojedokun24@gmail.com', href: 'mailto:olaniyiojedokun24@gmail.com' },
                { label: 'Phone', val: '0913 538 2861', href: 'tel:+2349135382861' },
                { label: 'LinkedIn', val: 'linkedin.com/in/olaniyi-ojedokun', href: 'https://www.linkedin.com/in/olaniyi-ojedokun' },
                { label: 'Location', val: 'Akobo, Ibadan, Nigeria', href: undefined },
              ].map((item, i) => (
                <div key={i}>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      style={{ display: 'flex', flexDirection: 'column', gap: 4, textDecoration: 'none' }}>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 14, color: M, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
                      <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 20, color: '#fff' }}>{item.val}</span>
                    </a>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 14, color: M, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</span>
                      <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 600, fontSize: 20, color: '#fff' }}>{item.val}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay: 0.1 }}
            style={{ flex: '1 1 420px' }}>
            <form
              onSubmit={e => { e.preventDefault(); setSent(true) }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 40, borderRadius: 24, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 14, color: M }}>Name</label>
                <input type="text" placeholder="Your name" required style={inputStyle} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 14, color: M }}>Email</label>
                <input type="email" placeholder="you@email.com" required style={inputStyle} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 14, color: M }}>Message</label>
                <textarea placeholder="Tell me about your project" rows={5} required style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button type="submit"
                style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: 'rgb(1,2,8)', background: A, border: 'none', borderRadius: 100, padding: '16px 32px', cursor: 'pointer', marginTop: 8 }}>
                {sent ? 'Message sent — thank you!' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
