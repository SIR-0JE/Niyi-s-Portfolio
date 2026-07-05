import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'

/* ─── Word-by-word animated headline ──────────────────────────────────── */
function AnimatedHeadline() {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  // Words and which ones are orange
  const parts = [
    { word: "I'M",         orange: false },
    { word: 'A',           orange: false },
    { word: 'UI/UX',       orange: false },
    { word: 'DESIGNER',    orange: false },
    { word: 'WHO',         orange: false },
    { word: 'DESIGNS',     orange: false },
    { word: 'USER-',       orange: true  },
    { word: 'CENTERED',    orange: true  },
    { word: 'EXPERIENCES', orange: true  },
  ]

  return (
    <h1
      ref={ref}
      className="font-display font-black uppercase leading-[0.9] tracking-tight"
      style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
    >
      {parts.map((p, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 80 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block mr-[0.2em] ${p.orange ? 'text-orange' : 'text-text'}`}
        >
          {p.word}
        </motion.span>
      ))}
    </h1>
  )
}

/* ─── Stats ────────────────────────────────────────────────────────────── */
const stats = [
  { val: '5+',    label: 'Client Projects' },
  { val: '89%',   label: 'Client Satisfaction' },
  { val: '1,939', label: 'Total Users Reached' },
  { val: '4',     label: 'Launched Products' },
]

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, -100])

  return (
    <section className="relative pt-28 pb-20 overflow-hidden" id="top">
      <div className="wrap relative z-10">
        <motion.div style={{ y }}>
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-2 mb-7"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
            <span className="font-mono text-[0.62rem] tracking-[0.18em] uppercase text-muted">
              Available for new projects
            </span>
          </motion.div>

          {/* BIG HEADLINE */}
          <AnimatedHeadline />

          {/* Sub-text + CTAs — same row, left text / right buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <p className="text-muted text-sm leading-relaxed max-w-[38ch]">
              Over 5 years crafting interfaces that reduce friction and move the numbers — from voter turnout to first-time access to care.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <a
                href="#work"
                className="font-mono text-[0.65rem] tracking-[0.12em] uppercase bg-orange text-white px-6 py-3 hover:opacity-90 transition-opacity"
              >
                View Work
              </a>
              <a
                href="mailto:olaniyiojedokun24@gmail.com"
                className="font-mono text-[0.65rem] tracking-[0.12em] uppercase border border-white/20 text-text px-6 py-3 hover:border-orange hover:text-orange transition-all duration-200"
              >
                Get In Touch
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Stats row ── no outer border, just dividers between items ── */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="mt-20 border-t border-brd grid grid-cols-2 sm:grid-cols-4"
        >
          {stats.map((s, i) => (
            <div
              key={i}
              className={`py-7 px-6 ${i < stats.length - 1 ? 'border-r border-brd' : ''}`}
            >
              <div className="font-display font-black text-3xl sm:text-4xl text-text mb-1.5">
                {s.val}
              </div>
              <div className="font-mono text-[0.58rem] tracking-[0.14em] uppercase text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
