import React, { useEffect } from 'react'
import { usePortfolio, type CaseStudyProject, type VisualSnackProject } from '../context/PortfolioContext'
import FadeIn from './FadeIn'
import { ArrowLeft, ExternalLink, ShieldAlert, Award, Hammer, Compass, CheckCircle2, Sliders, Layers } from 'lucide-react'

interface ProjectDetailPageProps {
  projectNum: string
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectNum }) => {
  const { data } = usePortfolio()

  // Find current project
  const projectIndex = data.projects.findIndex((p) => p.num === projectNum)
  const project = data.projects[projectIndex]

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any })
  }, [projectNum])

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex flex-col items-center justify-center p-6">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Project Not Found</h2>
        <p className="text-neutral-500 mb-6 text-center max-w-sm">
          The case study you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => { window.location.hash = '#/' }}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-700 hover:border-white transition-all text-sm font-semibold uppercase tracking-wider bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} />
          Go back home
        </button>
      </div>
    )
  }

  // Prev / Next links
  const nextProject = data.projects[(projectIndex + 1) % data.projects.length]
  const prevProject = data.projects[(projectIndex - 1 + data.projects.length) % data.projects.length]

  const handleNavigate = (num: string) => {
    window.location.hash = `#/project/${num}`
  }

  // --- RENDER TEMPLATE A: CASE STUDY ---
  if (project.template_type === 'casestudy') {
    const cs = project as CaseStudyProject

    return (
      <div className="min-h-screen bg-[#0C0C0C] text-white pt-28 pb-36 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
        {/* Navigation Header */}
        <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 sm:mb-12">
          <button
            onClick={() => { window.history.back() }}
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Back to list
          </button>
          <span className="text-neutral-600 font-mono text-sm tracking-widest">
            CASE STUDY {project.num} / {data.projects.length.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Title Block */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 sm:mb-16">
          <div className="lg:col-span-8 flex flex-col gap-4">
            <FadeIn delay={0} y={30}>
              <span className="text-purple-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
                Deep Product Outcomes
              </span>
            </FadeIn>
            <FadeIn delay={0.1} y={40}>
              <h1
                className="hero-heading font-black uppercase leading-none tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}
              >
                {project.name}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2} y={30}>
              <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-2xl mt-2">
                {project.description}
              </p>
            </FadeIn>
          </div>

          {/* Quick Meta */}
          <div className="lg:col-span-4 bg-neutral-900/30 border border-neutral-800/80 p-6 sm:p-8 rounded-[30px] flex flex-col gap-6 self-start z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1">
                  <Award size={10} />
                  Role
                </span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-300 uppercase tracking-wide">
                  {project.role || 'UI/UX Designer'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1">
                  <Compass size={10} />
                  Category
                </span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-300 uppercase tracking-wide">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-neutral-800/80 pt-4">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1">
                <Hammer size={10} />
                Tools Used
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(project.tools || []).map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-[10px] rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase tracking-widest font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 border border-purple-500 hover:bg-purple-700 text-white font-bold uppercase tracking-widest text-xs rounded-full transition-all cursor-pointer mt-2"
              >
                Launch Project
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Tall Visual Banner */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-24 rounded-[40px] overflow-hidden border border-neutral-800">
          {project.col2img && (
            <img src={project.col2img} alt={project.name} className="w-full h-auto object-cover max-h-[60vh]" />
          )}
        </div>

        {/* Narrative columns */}
        <div className="max-w-4xl mx-auto flex flex-col gap-16 sm:gap-24 mb-20">
          
          {/* Problem Statement */}
          {cs.problem_statement && (
            <FadeIn delay={0.1} y={20} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-b border-neutral-900 pb-12">
              <h2 className="md:col-span-4 text-[#D7E2EA] text-sm uppercase tracking-widest font-black">
                The Problem
              </h2>
              <div className="md:col-span-8 text-neutral-300 font-light text-sm sm:text-base leading-relaxed">
                {cs.problem_statement}
              </div>
            </FadeIn>
          )}

          {/* Research & insights */}
          {cs.research_insights && cs.research_insights.length > 0 && (
            <FadeIn delay={0.1} y={20} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-b border-neutral-900 pb-12">
              <h2 className="md:col-span-4 text-[#D7E2EA] text-sm uppercase tracking-widest font-black">
                Insights & IA
              </h2>
              <div className="md:col-span-8 flex flex-col gap-3">
                {(cs.research_insights || []).map((insight, idx) => (
                  <div key={idx} className="flex gap-2 text-neutral-300 text-sm sm:text-base font-light">
                    <span className="text-purple-400 font-bold">&bull;</span>
                    <p>{insight}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}

          {/* Wireframes process gallery */}
          {cs.process_gallery && cs.process_gallery.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full my-4">
              {(cs.process_gallery || []).map((img, i) => (
                <FadeIn key={i} delay={0.1 * i} y={30} className="w-full">
                  <div className="rounded-[30px] overflow-hidden border border-neutral-800/40 h-[220px] sm:h-[320px]">
                    <img src={img} alt="Process visual highlights" className="w-full h-full object-cover" />
                  </div>
                </FadeIn>
              ))}
            </div>
          )}

          {/* Solution features lists */}
          {cs.solution_features && cs.solution_features.length > 0 && (
            <div className="flex flex-col gap-12 border-b border-neutral-900 pb-16">
              <h2 className="text-[#D7E2EA] text-sm uppercase tracking-widest font-black">
                Key Features & High-Fi
              </h2>
              <div className="grid grid-cols-1 gap-12">
                {(cs.solution_features || []).map((feature, idx) => (
                  <FadeIn key={idx} delay={0.1 * idx} y={30} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 items-center">
                    <div className="md:col-span-6 flex flex-col gap-3">
                      <h3 className="text-white text-lg font-bold uppercase tracking-tight">{feature.title}</h3>
                      <p className="text-neutral-400 text-sm font-light leading-relaxed">{feature.description}</p>
                    </div>
                    <div className="md:col-span-6 rounded-[20px] overflow-hidden border border-neutral-800/40 h-[180px] sm:h-[230px]">
                      {feature.image_url && <img src={feature.image_url} alt={feature.title} className="w-full h-full object-cover" />}
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}

          {/* Success metrics */}
          {cs.success_metrics && cs.success_metrics.length > 0 && (
            <FadeIn delay={0.1} y={20} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10">
              <h2 className="md:col-span-4 text-[#D7E2EA] text-sm uppercase tracking-widest font-black">
                The Outcome
              </h2>
              <div className="md:col-span-8 flex flex-col gap-3">
                {(cs.success_metrics || []).map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-sm sm:text-base text-green-400 font-bold uppercase tracking-wider font-mono">
                    <CheckCircle2 size={16} />
                    {metric}
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>

        {/* Case Study Bottom Navigation Footer */}
        <div className="max-w-6xl mx-auto border-t border-neutral-900 pt-10 flex flex-col sm:flex-row gap-6 justify-between items-center text-center">
          <button onClick={() => handleNavigate(prevProject.num)} className="group flex flex-col items-center sm:items-start gap-1 bg-transparent border-none cursor-pointer">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Previous</span>
            <span className="text-[#D7E2EA] font-bold text-sm sm:text-base group-hover:text-purple-400 transition-colors uppercase">&larr; {prevProject.name}</span>
          </button>
          <button onClick={() => handleNavigate(nextProject.num)} className="group flex flex-col items-center sm:items-end gap-1 bg-transparent border-none cursor-pointer">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Next</span>
            <span className="text-[#D7E2EA] font-bold text-sm sm:text-base group-hover:text-purple-400 transition-colors uppercase">{nextProject.name} &arr;</span>
          </button>
        </div>
      </div>
    )
  }

  // --- RENDER TEMPLATE B: VISUAL SNACK ---
  const vs = project as VisualSnackProject

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pt-28 pb-36 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 sm:mb-12">
        <button
          onClick={() => { window.history.back() }}
          className="group flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to list
        </button>
        <span className="text-neutral-600 font-mono text-sm tracking-widest">
          VISUAL PLAYGROUND {project.num} / {data.projects.length.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Main visual panel layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left tall screen mock */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <FadeIn delay={0.1} y={40}>
            <div className="w-full rounded-[40px] overflow-hidden border border-neutral-800 bg-neutral-950">
              <img
                src={vs.media_url || vs.col2img}
                alt={vs.name}
                className="w-full h-auto object-cover max-h-[75vh]"
              />
            </div>
          </FadeIn>
        </div>

        {/* Right HUD info specs */}
        <div className="lg:col-span-4 flex flex-col gap-8 self-start bg-neutral-900/10 border border-neutral-800/40 p-6 sm:p-8 rounded-[40px] z-10">
          <div className="flex flex-col gap-3">
            <span className="text-purple-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
              {vs.category} Spec
            </span>
            <h1 className="text-2xl sm:text-3xl font-black uppercase leading-none tracking-tight">
              {vs.name}
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm font-light mt-2 leading-relaxed">
              {vs.brief_context || vs.description}
            </p>
          </div>

          <div className="flex flex-col gap-2 border-t border-neutral-800/80 pt-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1">
              <Layers size={10} />
              Role & Tools
            </span>
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wide">
              {vs.role || 'UI Designer'}
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(vs.tools || []).map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 text-[10px] rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase tracking-widest font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Design System Swatches */}
          {vs.design_system && (
            <div className="flex flex-col gap-4 border-t border-neutral-800/80 pt-4">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <Sliders size={12} />
                Design Tokens
              </span>
              
              {/* Color swatches */}
              {vs.design_system.colors && vs.design_system.colors.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Colors</span>
                  <div className="flex flex-wrap gap-2">
                    {(vs.design_system.colors || []).map((color, cIdx) => (
                      <div key={cIdx} className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-md">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/10"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-[9px] text-neutral-400 font-mono tracking-wider">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Typography specs */}
              {vs.design_system.typography && vs.design_system.typography.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Typography</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(vs.design_system.typography || []).map((font, fIdx) => (
                      <span key={fIdx} className="px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[9px] text-neutral-300 font-mono tracking-wider">
                        {font}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Visit link button */}
          {vs.liveUrl && (
            <div className="border-t border-neutral-800/80 pt-4 mt-2">
              <a
                href={vs.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-purple-600 border border-purple-500 hover:bg-purple-700 text-white font-bold uppercase tracking-widest text-xs rounded-full transition-all cursor-pointer"
              >
                Visit Live Site
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
