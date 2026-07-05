import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const expertise = [
  {
    title: 'User Research',
    desc: 'In-depth user interviews, journey mapping, and IA to drive product decisions backed by real insight.',
  },
  {
    title: 'UI/UX Design',
    desc: 'On Figma, delivering pixel-perfect wireframes, high-fidelity visuals, and scalable component libraries.',
  },
  {
    title: 'Testing & Iteration',
    desc: 'Usability testing, A/B frameworks, and rapid design cycles to validate every decision with real data.',
  },
]

export default function ExpertiseSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <section className="py-20 border-t border-brd" id="services">
      <div className="wrap">
        {/* Section label */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-10"
        >
          <span className="text-orange text-[0.55rem]">◆</span>
          <span className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-orange">Expertise</span>
        </motion.div>

        {/* Cards grid — dark bg with subtle border */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expertise.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.2, 0.85, 0.2, 1] }}
              className="bg-[#0e0e0e] border border-white/[0.06] p-7 group hover:border-orange/30 transition-colors duration-300"
            >
              {/* Orange line accent */}
              <div className="w-6 h-[2px] bg-orange mb-6 group-hover:w-12 transition-all duration-400" />
              <h3 className="font-display font-bold text-base text-text mb-3">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
