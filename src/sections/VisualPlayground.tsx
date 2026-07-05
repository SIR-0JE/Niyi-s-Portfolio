import React, { useState } from 'react'
import { usePortfolio, type VisualSnackProject } from '../context/PortfolioContext'
import FadeIn from '../components/FadeIn'
import { X, ExternalLink, Sliders } from 'lucide-react'

const VisualPlayground: React.FC = () => {
  const { data } = usePortfolio()
  
  // Filter only visual projects for playground
  const visualProjects = data.projects.filter(
    (p) => p.template_type === 'visual'
  ) as VisualSnackProject[]

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<VisualSnackProject | null>(null)

  if (visualProjects.length === 0) return null

  return (
    <section
      id="visual-playground"
      className="bg-[#0C0C0C] text-[#D7E2EA] px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32 border-t border-neutral-900"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* Section Heading */}
        <FadeIn delay={0} y={35} className="flex flex-col items-center text-center">
          <span className="text-purple-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
            Quick Creative Bytes
          </span>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight mt-2"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
          >
            Visual Playground
          </h2>
        </FadeIn>

        {/* Masonry CSS Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visualProjects.map((project, index) => {
            const isHovered = hoveredIdx === index
            const isAnyHovered = hoveredIdx !== null
            const opacityClass = isAnyHovered && !isHovered ? 'opacity-30' : 'opacity-100'
            const scaleClass = isHovered ? 'scale-[1.02]' : 'scale-100'

            return (
              <FadeIn
                key={project.num}
                delay={index * 0.1}
                y={30}
                className="w-full"
              >
                <div
                  onMouseEnter={() => setHoveredIdx(index)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => setSelectedProject(project)}
                  className={`relative rounded-[30px] overflow-hidden border border-neutral-800 bg-neutral-950/40 h-[280px] sm:h-[350px] cursor-pointer transition-all duration-300 ${opacityClass} ${scaleClass} z-10`}
                >
                  <img
                    src={project.media_url || project.col2img}
                    alt={project.name}
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                  />
                  
                  {/* Subtle info label visible on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col gap-1 justify-end h-1/2">
                    <span className="text-purple-400 text-[10px] font-bold uppercase tracking-widest">
                      {project.category}
                    </span>
                    <h3 className="text-white text-base font-bold uppercase tracking-tight">
                      {project.name}
                    </h3>
                  </div>
                </div>
              </FadeIn>
            )
          })}
        </div>
      </div>

      {/* Minimalist Details Overlay Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-[#0C0C0C]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="w-full max-w-2xl bg-[#0E0E0E] border border-neutral-800 rounded-[40px] p-6 sm:p-8 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Media */}
            <div className="w-full h-[240px] sm:h-[320px] rounded-[24px] overflow-hidden border border-neutral-800 bg-neutral-950">
              <img
                src={selectedProject.media_url || selectedProject.col2img}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info header */}
            <div className="flex flex-col gap-2">
              <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">
                {selectedProject.category} HUD
              </span>
              <h3 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tight leading-none">
                {selectedProject.name}
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm font-light mt-1 leading-relaxed">
                {selectedProject.brief_context || selectedProject.description}
              </p>
            </div>

            {/* Design System swatches if present */}
            {selectedProject.design_system && (
              <div className="flex flex-col gap-3 border-t border-neutral-900 pt-4">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sliders size={12} />
                  Design Tokens
                </span>
                
                {/* Color swatches */}
                {selectedProject.design_system.colors && selectedProject.design_system.colors.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Colors</span>
                    <div className="flex flex-wrap gap-2.5">
                      {(selectedProject.design_system.colors || []).map((color, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5 bg-neutral-900/60 border border-neutral-800/40 px-2.5 py-1.5 rounded-full">
                          <span 
                            className="w-3.5 h-3.5 rounded-full border border-white/10"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-[10px] text-neutral-400 font-mono tracking-wider">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Typography specs */}
                {selectedProject.design_system.typography && selectedProject.design_system.typography.length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-2">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Typography</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedProject.design_system.typography || []).map((font, fIdx) => (
                        <span key={fIdx} className="px-3 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono tracking-wider">
                          {font}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Visit link button */}
            {selectedProject.liveUrl && (
              <div className="flex justify-end border-t border-neutral-900 pt-4 mt-2">
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 border border-purple-500 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-purple-700 transition-all duration-300"
                >
                  Visit Live
                  <ExternalLink size={12} />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default VisualPlayground
