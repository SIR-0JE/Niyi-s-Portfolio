import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { fetchPortfolio, savePortfolio } from '../lib/db'

/* ─────────────────────────────────────────────
   DATA TYPES — matches every editable field
   visible across all pages of the new site.
───────────────────────────────────────────── */

export interface HeroContent {
  headline1: string     // "I'M A UI/UX DESIGNER"
  headline2: string     // "WHO DESIGNS"
  headline3: string     // "USER-CENTERED"
  headline4: string     // "EXPERIENCES"
  subtext: string
  cta1Label: string
  cta1Href: string
  cta2Label: string
  cta2Href: string
  stats: { value: string; label: string }[]
}

export interface ExpertiseCard {
  title: string
  body: string
}

export interface Stat {
  before: string
  after: string
  label: string
}

export interface FeaturedProject {
  name: string
  href: string
  headline: string
  role: string
  imageUrl?: string // Added for homepage placeholders
  stats: Stat[]
}

export interface FAQItem {
  question: string
  answer: string
}

export interface TestimonialItem {
  name: string
  role: string
  quote: string
}

export interface NavbarContent {
  logoText: string
  hireMeHref: string
}

export interface FooterContent {
  cta: string
  email: string
  copyright: string
  links: { label: string; href: string }[]
}

export interface AboutContent {
  introHeadline: string
  bio: string
  portraitUrl: string   // leave empty = show striped placeholder
}

export interface ExperienceItem {
  role: string
  org: string
  dates: string
  blurb: string
}

export interface CaseStudyStat {
  val: string
  label: string
}

export interface ProcessStep {
  title: string
  body: string
}

export interface OutcomeCard {
  val: string
  label: string
}

export interface CaseStudyContent {
  slug: string   // 'mindvox' | 'voterix' | 'health4moni' | 'gaffer'
  category: string
  headline: string
  stats: CaseStudyStat[]
  role: string
  timeline: string
  categoryTag: string
  problem: string
  process: ProcessStep[]
  outcomes: OutcomeCard[]
  behanceUrl: string
  coverImageUrl: string
  processImageUrl: string
}

export interface PortfolioContent {
  navbar: NavbarContent
  hero: HeroContent
  expertise: ExpertiseCard[]
  featuredProjects: FeaturedProject[]
  testimonials: TestimonialItem[]
  faqs: FAQItem[]
  footer: FooterContent
  about: AboutContent
  experience: ExperienceItem[]
  caseStudies: CaseStudyContent[]
}

/* ─────────────────────────────────────────────
   DEFAULT DATA — pre-filled from dc.html files
───────────────────────────────────────────── */
const DEFAULT: PortfolioContent = {
  navbar: {
    logoText: 'OJEDOKUN',
    hireMeHref: 'mailto:olaniyiojedokun24@gmail.com',
  },
  hero: {
    headline1: "I'M A UI/UX DESIGNER",
    headline2: 'WHO DESIGNS ',
    headline3: 'USER-CENTERED',
    headline4: 'EXPERIENCES',
    subtext: 'Over 5 years turning user research into interfaces that move real numbers — across civic-tech, fintech and mental health.',
    cta1Label: 'View My Work',
    cta1Href: '#/projects',
    cta2Label: 'Get In Touch',
    cta2Href: '#/contact',
    stats: [
      { value: '5+', label: 'Years of experience' },
      { value: '89%', label: 'Voter turnout lifted at Voterix' },
      { value: '1,939', label: 'Students served via GoChow' },
      { value: '4', label: 'End-to-end product case studies' },
    ],
  },
  expertise: [
    { title: 'User Research', body: 'Interviews, surveys, and usability testing that turn assumptions into evidence before a single pixel is placed.' },
    { title: 'UI/UX Design', body: 'Low-fidelity wireframes to high-fidelity, component-based prototypes in Figma — built to hand off clean.' },
    { title: 'Testing & Iteration', body: 'Moderated usability testing and iteration on flows, labels, and copy until the right action is the obvious one.' },
  ],
  featuredProjects: [
    {
      name: 'Voterix',
      href: '#/case/voterix',
      headline: 'Making campus voting so simple people actually vote',
      role: 'Founder & Product Designer',
      stats: [
        { before: '50%', after: '89%', label: 'Voter turnout · NUAMS' },
        { before: '500', after: '596', label: 'Voters · NACOS' },
      ],
    },
    {
      name: 'Health4Moni',
      href: '#/case/health4moni',
      headline: 'Turning a confusing insurance sign-up into a checkout people finish',
      role: 'Product Designer (Intern)',
      stats: [
        { before: 'Low-fi', after: 'Hi-fi', label: 'Prototype fidelity' },
        { before: '0', after: '5', label: 'Users usability-tested' },
      ],
    },
  ],
  testimonials: [
    {
      name: 'Placeholder Name',
      role: 'Role, Company',
      quote: '"Placeholder testimonial — swap in a real quote from a teammate, client, or user once you have one."',
    },
    {
      name: 'Placeholder Name',
      role: 'Role, Company',
      quote: '"Another placeholder — add a second testimonial here once you have feedback to share."',
    },
  ],
  faqs: [
    { question: 'What does your design process look like?', answer: "I start by framing the problem — stakeholder interviews, heuristic and competitive audits — before touching a wireframe. Then personas, journey maps, and user flows ground the design in real needs, and I validate every version with moderated usability testing before handoff." },
    { question: 'What tools do you design with?', answer: 'Figma and FigJam for design and collaboration, with Maze and Google Forms for testing and surveys.' },
    { question: 'Do you only design, or do you also think about the business side?', answer: "Both — as a startup COO I've owned product and operations end to end, so I design with an eye on the metric a screen is meant to move, not just how it looks." },
    { question: 'Are you open to freelance or full-time roles?', answer: "Yes to both. Reach out on the Contact page and I'll get back to you quickly." },
  ],
  footer: {
    cta: "LET'S TALK!",
    email: 'olaniyiojedokun24@gmail.com',
    copyright: '© Ojedokun Olaniyi — 2026',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/olaniyi-ojedokun' },
      { label: 'Email', href: 'mailto:olaniyiojedokun24@gmail.com' },
      { label: 'Phone', href: 'tel:+2349135382861' },
    ],
  },
  about: {
    introHeadline: 'HI THERE,\nthis is me\nOjedokun\nOlaniyi',
    bio: "UI/UX designer who starts with the user and ends with the metric. I turn user interviews, usability tests, and survey data into clean, accessible interfaces, then test with real people and iterate until the right action becomes the obvious one. I've designed end-to-end in Figma across health-insurance, civic-tech, and mental-health products, and as a startup COO I've watched good design move real numbers. I care most about designing for the users everyone else leaves out.",
    portraitUrl: '',
  },
  experience: [
    { role: 'Chief Operating Officer', org: 'GoChow', dates: 'Sept 2024 – Present', blurb: 'Own the product experience for a campus food-delivery startup serving 1,939 students. Redesigned the ordering flow, cutting average delivery time to under 30 minutes and growing daily orders to ~50/day.' },
    { role: 'Product Design Lead', org: 'Google Developer Groups on Campus, Bowen University', dates: 'Oct 2025 – Jul 2026', blurb: "Lead product design for the campus chapter — running seminars, webinars, and workshops that grow members' UX research and UI skills, and mentoring designers through real-world briefs." },
    { role: 'Product Design Co-Lead', org: 'GDGoC, Bowen University', dates: 'Oct 2024 – Jul 2025', blurb: 'Co-taught and mentored the design committee and helped shape its training curriculum from the ground up.' },
    { role: 'Product Designer (Intern)', org: 'Health4Moni', dates: 'Sept 2023 – Aug 2024', blurb: 'End-to-end product design engagement for a health-insurance company — from stakeholder interviews and audits to a high-fidelity prototype, validated with usability testing.' },
  ],
  caseStudies: [
    {
      slug: 'mindvox',
      category: 'Mental Health Platform',
      headline: 'A Pidgin-first, judgment-free first step into mental health support',
      stats: [{ val: 'Anon.', label: 'Entry model' }, { val: 'Offline-first', label: 'Network resilience' }, { val: 'Pidgin', label: 'Primary language' }],
      role: 'Lead Product Designer',
      timeline: '2026 Capstone',
      categoryTag: 'Mental Health',
      problem: 'Nigerian university students face rising social anxiety but struggle to seek help: stigma, language barriers (existing platforms use English jargon), and lack of affordable, confidential support. Many suffer in silence rather than risk judgment.',
      process: [
        { title: 'Deep Empathy Research', body: 'Conducted 12 in-depth interviews with students dealing with social anxiety. Listened for language preferences, trust barriers, and what would make them feel safe seeking help anonymously.' },
        { title: 'Conversational UI Design', body: 'Designed a Pidgin-first, conversational triage flow. Users answer natural-language questions about their feelings; the app assesses severity and routes them to appropriate support (peer, counselor, or crisis).' },
        { title: 'Validation & Iteration', body: 'Ran moderated usability tests with 8 students; refined tone, conversation pacing, and referral screens. Built offline-first so students can use it anywhere, anytime.' },
      ],
      outcomes: [{ val: '100%', label: 'Completion rate (testing)' }, { val: '8/8', label: 'Users felt safe' }, { val: 'Ready', label: 'For deployment' }],
      behanceUrl: 'https://behance.net',
      coverImageUrl: '',
      processImageUrl: '',
    },
    {
      slug: 'voterix',
      category: 'Campus Voting Platform',
      headline: 'Making campus voting so simple people actually vote',
      stats: [{ val: '89%', label: 'Voter turnout (NUAMS)' }, { val: '50% → 89%', label: 'Growth from baseline' }, { val: '6 → 3', label: 'Steps to cast a vote' }],
      role: 'Founder & Product Designer',
      timeline: '2025 – Present',
      categoryTag: 'Civic-Tech',
      problem: 'Campus elections had a 50% voter turnout. Students cited friction points: the ballot flow was long, confusing, and happened during exam season when time was scarce. Every extra step meant more people dropping off.',
      process: [
        { title: 'Research & Interviews', body: 'Surveyed 50+ students and ran one-on-one interviews to understand voting barriers. Found time scarcity and ballot complexity were the main friction.' },
        { title: 'Wireframing & Testing', body: 'Mapped the current 6-step flow, identified drop-off points, and tested a streamlined 3-step prototype with 8 users. Task completion jumped to 95%.' },
        { title: 'Visual Design & Launch', body: 'Built a clean, mobile-first interface emphasizing clarity. Launched for NUAMS election; final turnout: 89%.' },
      ],
      outcomes: [{ val: '89%', label: 'Voter turnout on launch' }, { val: '39pt', label: 'Increase from baseline' }, { val: '3', label: 'Associations adopted the platform' }],
      behanceUrl: 'https://behance.net',
      coverImageUrl: '',
      processImageUrl: '',
    },
    {
      slug: 'health4moni',
      category: 'Fintech / Insurance',
      headline: 'Turning a confusing insurance sign-up into a checkout people finish',
      stats: [{ val: '5', label: 'Users usability-tested' }, { val: 'Low-fi → Hi-fi', label: 'Prototype progression' }, { val: '9', label: 'Screens designed' }],
      role: 'Product Designer (Intern)',
      timeline: 'Sept 2023 – Aug 2024',
      categoryTag: 'Insurance Platform',
      problem: "Health4Moni's online insurance platform had low conversion: customers dropped off during sign-up, KYC verification, and plan comparison. The flow was unclear, jargon-heavy, and lacked trust signals. No one knew where they were in the process.",
      process: [
        { title: 'Stakeholder Interviews & Audit', body: 'Ran interviews with product, underwriting, and support teams. Conducted a competitive audit of 5 insurance platforms and heuristic evaluation of the existing flow.' },
        { title: 'Journey Mapping & Personas', body: 'Synthesized research into a customer journey map (pain points at each stage) and 3 personas. Identified clarity, trust, and progress tracking as key needs.' },
        { title: 'Iterative Design & Testing', body: 'Low-fi wireframes for 9 key screens, then hi-fi prototypes. Ran moderated usability tests with 5 users; reworked sign-in, KYC, and checkout flows based on feedback before developer handoff.' },
      ],
      outcomes: [{ val: '9', label: 'Full-featured screens delivered' }, { val: '95%', label: 'Task completion in testing' }, { val: 'Ready', label: 'For dev handoff' }],
      behanceUrl: 'https://behance.net',
      coverImageUrl: '',
      processImageUrl: '',
    },
    {
      slug: 'gaffer',
      category: 'Sports-Tech Platform',
      headline: 'Giving local competitions the fixtures & fantasy experience big leagues get',
      stats: [{ val: '300+', label: 'Students onboarded' }, { val: '3 wks', label: 'Bowen Fans League pilot' }, { val: 'Mobile-first', label: 'Design approach' }],
      role: 'Founder & Product Designer',
      timeline: '2025 – Present',
      categoryTag: 'Fantasy Sports',
      problem: 'Local sports organizers had no platform to manage competitions or engage fans. Fixture info was scattered across WhatsApp; standings were manual; there was zero engagement or gamification. Players and fans had no reason to return.',
      process: [
        { title: 'User Research', body: 'Surveyed 20+ organizers and fans; identified that live updates, standings visibility, and a fantasy layer (pick players, earn points) were the top wants.' },
        { title: 'Mobile-First Design', body: 'Designed fixtures, live scores, player profiles, and fantasy gameplay for mobile. All core flows tested for clarity and speed on low-end devices.' },
        { title: 'Iterate & Launch', body: 'Piloted with 300+ students in the Bowen Fans League. Observed onboarding drop-off and refined the signup flow; refined fantasy mechanics based on user feedback.' },
      ],
      outcomes: [{ val: '300+', label: 'Active users in pilot' }, { val: '85%', label: 'Return rate (week 2)' }, { val: 'Live', label: 'Ready to scale' }],
      behanceUrl: 'https://behance.net',
      coverImageUrl: '',
      processImageUrl: '',
    },
  ],
}

/* ─────────────────────────────────────────────
   CONTEXT
───────────────────────────────────────────── */
interface CtxType {
  data: PortfolioContent
  set: (patch: Partial<PortfolioContent>) => void
  setNested: <K extends keyof PortfolioContent>(key: K, val: PortfolioContent[K]) => void
  reset: () => void
  /** 'idle' | 'saving' | 'saved' | 'error' | 'unsaved' */
  syncStatus: 'idle' | 'saving' | 'saved' | 'error' | 'unsaved'
  pushToCloud: () => Promise<void>
}

const Ctx = createContext<CtxType | undefined>(undefined)

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ── 1. Bootstrap from localStorage immediately (instant load) ──
  const [data, setData] = useState<PortfolioContent>(() => {
    try {
      const raw = localStorage.getItem('portfolio_v2')
      if (raw) return { ...DEFAULT, ...JSON.parse(raw) }
    } catch {}
    return DEFAULT
  })

  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const isFirstMount = useRef(true)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── 2. On mount: fetch from Supabase and hydrate ──
  useEffect(() => {
    fetchPortfolio().then(remote => {
      if (remote) {
        setData(prev => ({ ...DEFAULT, ...prev, ...remote }))
        // Also update local cache
        try { localStorage.setItem('portfolio_v2', JSON.stringify({ ...DEFAULT, ...remote })) } catch {}
      }
    })
  }, [])

  // ── 3. Whenever data changes (after first mount): save to LocalStorage ONLY ──
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return }

    // Write to localStorage immediately
    try {
      localStorage.setItem('portfolio_v2', JSON.stringify(data))
    } catch (e) {
      console.error('LocalStorage quota exceeded', e)
      alert('Image may be too large for storage. Try a smaller image.')
    }

    // Mark as unsaved so admin knows to push
    if (syncStatus !== 'unsaved' && syncStatus !== 'saving') {
      setSyncStatus('unsaved')
    }
  }, [data])

  const pushToCloud = useCallback(async () => {
    setSyncStatus('saving')
    const ok = await savePortfolio(data)
    setSyncStatus(ok ? 'saved' : 'error')
    if (ok) setTimeout(() => setSyncStatus('idle'), 3000)
  }, [data])

  const set = useCallback((patch: Partial<PortfolioContent>) =>
    setData(prev => ({ ...prev, ...patch })), [])

  const setNested = useCallback(<K extends keyof PortfolioContent>(key: K, val: PortfolioContent[K]) =>
    setData(prev => ({ ...prev, [key]: val })), [])

  const reset = useCallback(() => setData(DEFAULT), [])

  return <Ctx.Provider value={{ data, set, setNested, reset, syncStatus, pushToCloud }}>{children}</Ctx.Provider>
}

export const usePortfolio = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('usePortfolio must be inside PortfolioProvider')
  return c
}

// Legacy stub for AdminPanel import compatibility
export type { PortfolioContent as PortfolioData }
