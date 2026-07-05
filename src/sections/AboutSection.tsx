import { motion } from 'framer-motion';

const stack = [
  'Figma', 'FigJam', 'Prototyping', 'Design Systems',
  'User Research', 'Usability Testing', 'Notion'
];

export default function AboutSection() {
  return (
    <section className="py-[clamp(52px,9vh,96px)]" id="about">
      <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,60px)]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-6%" }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
          className="p-[clamp(28px,5vw,56px)] bg-glass border border-brd rounded-[20px] backdrop-blur-[22px] saturate-150 shadow-[0_1px_0_rgba(255,255,255,0.09)_inset,0_30px_60px_-30px_rgba(0,0,0,0.6)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-[clamp(32px,5vw,64px)] items-start">
            <div>
              <p className="font-display font-medium text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.45] tracking-[-0.01em] max-w-[32ch] mb-5">
                I start with the people a product forgets. I've founded two products used on my campus, designed a health-insurance experience end-to-end, and led product design for a developer community.
              </p>
              <p className="font-display font-medium text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.45] tracking-[-0.01em] max-w-[32ch] mb-5">
                I care less about the prettiest screen and more about <span className="text-iris">the moment a user finally gets through.</span>
              </p>
            </div>
            
            <div>
              <div className="mb-4 text-faint font-mono text-[0.72rem] tracking-[0.12em] uppercase">
                Stack & methods
              </div>
              <div className="flex flex-wrap gap-[9px]">
                {stack.map((item, idx) => (
                  <span 
                    key={idx}
                    className="font-mono text-[0.7rem] tracking-[0.05em] uppercase px-[13px] py-[9px] border border-brd rounded-[9px] bg-glass text-text"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
