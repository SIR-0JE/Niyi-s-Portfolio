import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    name: 'Placeholder Name',
    title: 'Job Title, Company',
    quote: 'Placeholder testimonial — swap in a real quote from a community client or user once you have one.',
  },
  {
    name: 'Temidayo Adewale',
    title: 'Product Manager, Voterix',
    quote: 'Olaniyi has a rare ability to translate messy user pain into clean, purposeful design. The voting flow went from confusing to delightful — the numbers proved it.',
  },
  {
    name: 'Aisha Bello',
    title: 'Clinical Coordinator, Triage Health',
    quote: 'The offline-first, Pidgin-friendly approach was exactly what our users needed. Olaniyi listened before he designed — and it showed.',
  },
]

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const [active, setActive] = useState(0)

  return (
    <section className="py-20 border-t border-brd" id="testimonials">
      <div className="wrap">
        {/* Label */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 mb-10"
        >
          <span className="text-orange text-[0.55rem]">◆</span>
          <span className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-orange">What they say</span>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-[#0e0e0e] border border-white/[0.06] grid grid-cols-1 sm:grid-cols-[220px_1fr]"
        >
          {/* Left: person info */}
          <div className="flex sm:flex-col justify-between sm:justify-start gap-4 p-6 border-b sm:border-b-0 sm:border-r border-white/[0.06]">
            {/* Avatar placeholder */}
            <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
            <div>
              <div className="font-display font-bold text-sm text-text">{testimonials[active].name}</div>
              <div className="font-mono text-[0.55rem] tracking-[0.12em] uppercase text-muted mt-0.5">{testimonials[active].title}</div>
            </div>
          </div>

          {/* Right: quote */}
          <div className="p-6 sm:p-10 relative">
            {/* Big quote mark */}
            <span className="text-orange font-serif text-5xl leading-none absolute top-6 left-6 sm:top-8 sm:left-10 select-none">"</span>

            <AnimatePresence mode="wait">
              <motion.p
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: [0.2, 0.85, 0.2, 1] }}
                className="font-display font-medium text-base sm:text-lg leading-relaxed text-text mt-8 sm:mt-10"
              >
                {testimonials[active].quote}
              </motion.p>
            </AnimatePresence>

            {/* Navigation arrows — bottom right, orange */}
            <div className="flex items-center gap-2 mt-8 justify-end">
              <button
                onClick={() => setActive(a => (a - 1 + testimonials.length) % testimonials.length)}
                className="w-8 h-8 border border-white/10 flex items-center justify-center hover:border-orange hover:text-orange text-muted transition-all duration-200 cursor-pointer"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={() => setActive(a => (a + 1) % testimonials.length)}
                className="w-8 h-8 border border-orange bg-orange text-white flex items-center justify-center hover:bg-orange/80 transition-all duration-200 cursor-pointer"
              >
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
