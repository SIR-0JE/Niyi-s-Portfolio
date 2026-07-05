import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const projects = [
  {
    id: 'voterix',
    name: 'Voterix',
    title: 'Making campus voting so simple people actually vote',
    metrics: [
      { before: '50%', after: '89%', lab: 'Voter turnout · NUAMS' },
      { before: '500', after: '596', lab: 'Total voters · NACOS' },
    ],
    role: 'Founder & Product Designer',
    year: '2025',
    tags: ['UX Research', 'Interaction Design', 'Usability Testing'],
    href: '#/project/1',
  },
  {
    id: 'health',
    name: 'Health4Moni',
    title: 'Turning a confusing insurance sign-up into a checkout people finish',
    metrics: [
      { before: 'End‑to‑End', after: '', lab: 'Research → Hi-fi prototype' },
      { before: 'Every', after: 'Screen', lab: 'Onboarding · KYC · Checkout' },
    ],
    role: 'Product Designer (Intern)',
    year: '2024',
    tags: ['Wireframing', 'Prototyping', 'Design Systems'],
    href: '#/project/4',
  },
]

function ProjectCard({ proj, i }: { proj: typeof projects[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  // Parallax: ghost text moves at different speed
  const ghostY = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#0e0e0e] border border-white/[0.06] group hover:border-white/[0.12] transition-colors duration-300"
    >
      {/* Cover with ghost text */}
      <div className="relative h-52 sm:h-64 overflow-hidden flex items-center justify-center border-b border-white/[0.06]">
        <motion.span
          style={{ y: ghostY }}
          className="font-display font-black text-[5rem] sm:text-[7rem] tracking-tighter select-none pointer-events-none"
          style={{ y: ghostY, color: 'rgba(255,255,255,0.04)' } as React.CSSProperties}
        >
          {proj.name}
        </motion.span>

        {/* Hover arrow */}
        <a
          href={proj.href}
          className="absolute bottom-4 right-4 w-9 h-9 bg-orange flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M17 7H8M17 7V16" />
          </svg>
        </a>

        <span className="absolute top-4 left-4 font-mono text-[0.55rem] tracking-[0.16em] uppercase text-orange/70">
          {proj.year}
        </span>
      </div>

      {/* Card body */}
      <div className="p-6 sm:p-8">
        <h3 className="font-display font-bold text-xl sm:text-2xl leading-tight text-text mb-6 group-hover:text-orange transition-colors duration-300">
          {proj.title}
        </h3>

        {/* Metrics */}
        <div className="flex gap-8 sm:gap-14 mb-6 flex-wrap">
          {proj.metrics.map((m, idx) => (
            <div key={idx}>
              <div className="font-display font-black text-2xl sm:text-3xl text-text leading-none">
                {m.before}
                {m.before && m.after && (
                  <span className="text-white/30 font-normal mx-2 text-xl">→</span>
                )}
                {m.after && <span className="text-orange">{m.after}</span>}
              </div>
              <div className="font-mono text-[0.56rem] tracking-[0.14em] uppercase text-muted mt-1.5">{m.lab}</div>
            </div>
          ))}
        </div>

        {/* Footer: role + tags + case study link */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 border-t border-white/[0.06]">
          <span className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted">{proj.role}</span>
          <div className="flex gap-2 flex-wrap">
            {proj.tags.slice(0, 2).map((t, idx) => (
              <span key={idx} className="font-mono text-[0.55rem] tracking-[0.1em] uppercase text-white/25 border border-white/10 px-2.5 py-1">
                {t}
              </span>
            ))}
          </div>
          <a
            href={proj.href}
            className="ml-auto font-mono text-[0.6rem] tracking-[0.12em] uppercase text-orange flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-200"
          >
            Case study
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H8M17 7V16" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section className="py-20 border-t border-brd" id="work">
      <div className="wrap">
        {/* Header row */}
        <div className="flex items-center justify-between mb-12">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <span className="text-orange text-[0.55rem]">◆</span>
            <span className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-orange">Featured Work</span>
          </motion.div>
          <motion.a
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            href="#/projects"
            className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-muted hover:text-orange transition-colors duration-200 flex items-center gap-1"
          >
            View all
            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H8M17 7V16" />
            </svg>
          </motion.a>
        </div>

        <div className="flex flex-col gap-4">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} proj={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
