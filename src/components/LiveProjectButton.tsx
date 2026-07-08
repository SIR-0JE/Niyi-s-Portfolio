import React from 'react'

interface LiveProjectButtonProps {
  href: string
  className?: string
}

const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({ href, className = '' }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest no-underline
        px-8 py-3 sm:px-10 sm:py-3.5
        text-sm sm:text-base
        transition-colors duration-200 hover:bg-[#D7E2EA]/10 cursor-pointer
        ${className}`}
    >
      Live Project ↗
    </a>
  )
}

export default LiveProjectButton
