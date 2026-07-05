import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'What does your design process look like?',
    a: 'I begin with discovery — stakeholder conversations, user interviews, and competitive analysis. From there I move into wireframes, usability testing, and finally high-fidelity prototypes. Each step is validated with real users before moving forward.',
  },
  {
    q: 'What type of projects do you take on?',
    a: "I focus on digital products — mobile apps, web platforms, and design systems. I especially enjoy civic-tech, fintech, and health-tech problems where good design can meaningfully change someone's life.",
  },
  {
    q: "Do you sign up for projects you don't understand the domain in?",
    a: 'Yes — research is part of my process. I begin every project with deep domain learning, user interviews, and stakeholder workshops so I can design from a position of understanding rather than assumption.',
  },
  {
    q: 'Are you open to freelance or full-time roles?',
    a: 'Both. I work with startups, scale-ups, and agencies on a freelance basis, and I am also open to full-time positions with mission-driven companies building things that matter.',
  },
]

function FAQItem({ item, i }: { item: typeof faqs[0]; i: number }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: i * 0.06 }}
      className="border-b border-white/[0.06] last:border-none"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 gap-4 text-left cursor-pointer bg-transparent border-none group"
      >
        <span className={`font-display font-medium text-[0.95rem] sm:text-base transition-colors duration-200 ${open ? 'text-orange' : 'text-text group-hover:text-orange/80'}`}>
          {item.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={`shrink-0 text-lg leading-none font-light transition-colors duration-200 ${open ? 'text-orange' : 'text-muted'}`}
        >
          +
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.85, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-muted text-sm leading-relaxed pr-10">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <section className="py-20 border-t border-brd" id="faq">
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
          <span className="font-mono text-[0.65rem] tracking-[0.16em] uppercase text-orange">Frequently Asked Questions</span>
        </motion.div>

        {/* FAQ list — no card wrapper, just clean divider lines */}
        <div className="max-w-3xl border-t border-white/[0.06]">
          {faqs.map((item, i) => <FAQItem key={i} item={item} i={i} />)}
        </div>
      </div>
    </section>
  )
}
