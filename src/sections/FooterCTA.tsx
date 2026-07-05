import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

/* ─── Letter-by-letter reveal for big CTA text ───────────────────────── */
function BigText({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <div ref={ref} className="overflow-hidden" aria-label={text}>
      <div className="flex flex-wrap justify-center">
        {text.split('').map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: '110%' }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block font-display font-black text-text"
            style={{
              fontSize: 'clamp(3.5rem, 11vw, 9rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.03em',
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export default function FooterCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const inView = useInView(footerRef, { once: true, amount: 0.2 })

  return (
    <>
      {/* ── CTA ── */}
      <section ref={sectionRef} className="py-32 border-t border-brd relative overflow-hidden text-center" id="contact">
        {/* Parallax glow */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange/[0.07] blur-[100px]" />
        </motion.div>

        <div className="wrap relative z-10">
          <BigText text="LET'S TALK!" />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-5 font-mono text-[0.62rem] tracking-[0.18em] uppercase text-muted"
          >
            olaniyiojedokun24@gmail.com
          </motion.p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-brd py-7" ref={footerRef}>
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-3">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-muted"
          >
            Olaniyi · Ibadan, NG
          </motion.span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex gap-6"
          >
            {[
              { label: 'LinkedIn', href: '#' },
              { label: 'Twitter', href: '#' },
              { label: 'Email', href: 'mailto:olaniyiojedokun24@gmail.com' },
            ].map(s => (
              <a
                key={s.label}
                href={s.href}
                className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-muted hover:text-orange transition-colors duration-200"
              >
                {s.label}
              </a>
            ))}
          </motion.div>
        </div>
      </footer>
    </>
  )
}
