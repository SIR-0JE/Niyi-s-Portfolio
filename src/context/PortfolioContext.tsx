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

/* ─────────────────────────────────────────────
   UNIFIED PROJECT MODEL
   Replaces the old caseStudies / featuredProjects /
   otherWork arrays with one project list. `type`
   picks the detail template + card tag label;
   `badge` is a separate personal/client ownership
   label shown on the card only.
───────────────────────────────────────────── */

export type ProjectType = 'case-study' | 'landing-page' | 'ui'
export type ProjectBadge = 'personal' | 'client'

export interface ProjectStat {
  val: string
  label: string
}

export interface ProjectProcessStep {
  title: string
  body: string
}

export interface ProjectSections {
  problem: boolean
  research: boolean
  process: boolean
  outcome: boolean
  reflection: boolean
}

export interface Project {
  slug: string
  type: ProjectType
  badge: ProjectBadge
  featured: boolean

  // shared meta
  name: string
  headline: string
  role: string
  year: string
  tools: string          // comma-separated, rendered as pills
  coverImageUrl: string
  processImageUrl: string
  liveUrl: string
  behanceUrl: string
  category: string        // eyebrow label above headline on detail page
  categoryTag: string     // short value shown in the Role/Timeline/Category meta row

  // narrative content — shown only where sections[x] is on AND content is non-empty
  stats: ProjectStat[]           // small always-visible highlight row (not section-gated)
  problem: string
  research: string
  process: ProjectProcessStep[]
  outcomes: ProjectStat[]
  reflection: string

  sections: ProjectSections
}

export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  'case-study': 'Case Study',
  'landing-page': 'Landing Page',
  'ui': 'UI Exploration',
}

export const DEFAULT_SECTIONS_BY_TYPE: Record<ProjectType, ProjectSections> = {
  'case-study': { problem: true, research: true, process: true, outcome: true, reflection: true },
  'landing-page': { problem: false, research: false, process: false, outcome: true, reflection: false },
  'ui': { problem: false, research: false, process: false, outcome: false, reflection: false },
}

export function emptyProject(slug: string, type: ProjectType = 'case-study'): Project {
  return {
    slug, type, badge: 'personal', featured: false,
    name: '', headline: '', role: '', year: '', tools: '',
    coverImageUrl: '', processImageUrl: '', liveUrl: '', behanceUrl: 'https://behance.net',
    category: '', categoryTag: '',
    stats: [], problem: '', research: '', process: [], outcomes: [], reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE[type] },
  }
}

export interface PortfolioContent {
  navbar: NavbarContent
  hero: HeroContent
  expertise: ExpertiseCard[]
  testimonials: TestimonialItem[]
  faqs: FAQItem[]
  footer: FooterContent
  about: AboutContent
  experience: ExperienceItem[]
  projects: Project[]
}

/* ─────────────────────────────────────────────
   DEFAULT DATA
───────────────────────────────────────────── */
const DEFAULT_PROJECTS: Project[] = [
  {
    slug: 'voterix',
    type: 'case-study',
    badge: 'personal',
    featured: true,
    name: 'Voterix',
    headline: 'Making campus voting so simple people actually vote',
    role: 'Founder & Product Designer',
    year: '2025 – Present',
    tools: 'Figma, FigJam, Google Forms',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Campus Voting Platform',
    categoryTag: 'Civic-Tech',
    stats: [{ val: '89%', label: 'Voter turnout (NUAMS)' }, { val: '50% → 89%', label: 'Growth from baseline' }, { val: '6 → 3', label: 'Steps to cast a vote' }],
    problem: 'Campus elections had a 50% voter turnout. Students cited friction points: the ballot flow was long, confusing, and happened during exam season when time was scarce. Every extra step meant more people dropping off.',
    research: '',
    process: [
      { title: 'Research & Interviews', body: 'Surveyed 50+ students and ran one-on-one interviews to understand voting barriers. Found time scarcity and ballot complexity were the main friction.' },
      { title: 'Wireframing & Testing', body: 'Mapped the current 6-step flow, identified drop-off points, and tested a streamlined 3-step prototype with 8 users. Task completion jumped to 95%.' },
      { title: 'Visual Design & Launch', body: 'Built a clean, mobile-first interface emphasizing clarity. Launched for NUAMS election; final turnout: 89%.' },
    ],
    outcomes: [{ val: '89%', label: 'Voter turnout on launch' }, { val: '39pt', label: 'Increase from baseline' }, { val: '3', label: 'Associations adopted the platform' }],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['case-study'] },
  },
  {
    slug: 'academia-world',
    type: 'case-study',
    badge: 'client',
    featured: true,
    name: 'Academia World',
    headline: 'Making conference discovery and registration a process attendees actually finish',
    role: 'Product Designer',
    year: '2025',
    tools: 'Figma, FigJam',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Education Events Platform',
    categoryTag: 'EdTech',
    stats: [{ val: 'Eric & Sarah', label: 'Core personas' }, { val: 'End-to-end', label: 'Discovery to registration' }],
    problem: "Academia World's education-events platform made it hard for professionals to discover relevant conferences and complete registration, with drop-off happening before attendees ever reached an event page.",
    research: "Interviewed target users and synthesized findings into two core personas — Eric and Sarah — representing the platform's primary attendee types, to ground the discovery and registration redesign in real user goals.",
    process: [
      { title: 'Interviews & Personas', body: "Interviewed target users and built out two personas, Eric and Sarah, representing the platform's core attendee types." },
      { title: 'Ideation', body: 'Explored multiple directions for simplifying discovery and registration before converging on a single end-to-end flow.' },
      { title: 'Design', body: 'Designed the full experience in Figma, from conference discovery through registration checkout.' },
      { title: 'Usability Testing', body: 'Validated the redesigned flow with usability testing before developer handoff.' },
    ],
    outcomes: [{ val: '2', label: 'Core personas developed' }, { val: 'Tested', label: 'Flow validated with usability testing' }],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['case-study'] },
  },
  {
    slug: 'mindvox',
    type: 'case-study',
    badge: 'personal',
    featured: true,
    name: 'Mindvox',
    headline: 'A Pidgin-first, judgment-free first step into mental health support',
    role: 'Lead Product Designer',
    year: '2026 Capstone',
    tools: 'Figma, Maze',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Mental Health Platform',
    categoryTag: 'Mental Health',
    stats: [{ val: 'Anon.', label: 'Entry model' }, { val: 'Offline-first', label: 'Network resilience' }, { val: 'Pidgin', label: 'Primary language' }],
    problem: 'Nigerian university students face rising social anxiety but struggle to seek help: stigma, language barriers (existing platforms use English jargon), and lack of affordable, confidential support. Many suffer in silence rather than risk judgment.',
    research: '',
    process: [
      { title: 'Deep Empathy Research', body: 'Conducted 12 in-depth interviews with students dealing with social anxiety. Listened for language preferences, trust barriers, and what would make them feel safe seeking help anonymously.' },
      { title: 'Conversational UI Design', body: 'Designed a Pidgin-first, conversational triage flow. Users answer natural-language questions about their feelings; the app assesses severity and routes them to appropriate support (peer, counselor, or crisis).' },
      { title: 'Validation & Iteration', body: 'Ran moderated usability tests with 8 students; refined tone, conversation pacing, and referral screens. Built offline-first so students can use it anywhere, anytime.' },
    ],
    outcomes: [{ val: '100%', label: 'Completion rate (testing)' }, { val: '8/8', label: 'Users felt safe' }, { val: 'Ready', label: 'For deployment' }],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['case-study'] },
  },
  {
    slug: 'health4moni',
    type: 'case-study',
    badge: 'client',
    featured: false,
    name: 'Health4Moni',
    headline: 'Turning a confusing insurance sign-up into a checkout people finish',
    role: 'Product Designer (Intern)',
    year: 'Sept 2023 – Aug 2024',
    tools: 'Figma, Maze',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Fintech / Insurance',
    categoryTag: 'Insurance Platform',
    stats: [{ val: '5', label: 'Users usability-tested' }, { val: 'Low-fi → Hi-fi', label: 'Prototype progression' }, { val: '9', label: 'Screens designed' }],
    problem: "Health4Moni's online insurance platform had low conversion: customers dropped off during sign-up, KYC verification, and plan comparison. The flow was unclear, jargon-heavy, and lacked trust signals. No one knew where they were in the process.",
    research: '',
    process: [
      { title: 'Stakeholder Interviews & Audit', body: 'Ran interviews with product, underwriting, and support teams. Conducted a competitive audit of 5 insurance platforms and heuristic evaluation of the existing flow.' },
      { title: 'Journey Mapping & Personas', body: 'Synthesized research into a customer journey map (pain points at each stage) and 3 personas. Identified clarity, trust, and progress tracking as key needs.' },
      { title: 'Iterative Design & Testing', body: 'Low-fi wireframes for 9 key screens, then hi-fi prototypes. Ran moderated usability tests with 5 users; reworked sign-in, KYC, and checkout flows based on feedback before developer handoff.' },
    ],
    outcomes: [{ val: '9', label: 'Full-featured screens delivered' }, { val: '95%', label: 'Task completion in testing' }, { val: 'Ready', label: 'For dev handoff' }],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['case-study'] },
  },
  {
    slug: 'glover-microfinance',
    type: 'case-study',
    badge: 'client',
    featured: false,
    name: 'Glover Microfinance',
    headline: 'A clearer way for internal teams to track banking activity',
    role: 'Product Designer',
    year: '2024',
    tools: 'Figma',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Internal Banking Tool',
    categoryTag: 'Fintech',
    stats: [],
    problem: 'Internal teams at Glover Microfinance lacked a clear, efficient way to track day-to-day banking activity.',
    research: '',
    process: [],
    outcomes: [{ val: 'Internal', label: 'Tool adopted by banking staff' }],
    reflection: '',
    sections: { problem: true, research: false, process: false, outcome: true, reflection: false },
  },
  {
    slug: 'base360',
    type: 'landing-page',
    badge: 'personal',
    featured: false,
    name: 'Base360',
    headline: '',
    role: '',
    year: '',
    tools: '',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: '',
    categoryTag: '',
    stats: [],
    problem: '',
    research: '',
    process: [],
    outcomes: [],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['landing-page'] },
  },
  {
    slug: 'gochow',
    type: 'landing-page',
    badge: 'personal',
    featured: false,
    name: 'GoChow',
    headline: 'A cleaner ordering experience for a campus food-delivery startup',
    role: 'COO & Product Designer',
    year: 'Sept 2024 – Present',
    tools: 'Figma',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Food Delivery Startup',
    categoryTag: 'Campus Tech',
    stats: [{ val: '1,939', label: 'Students served' }],
    problem: '',
    research: '',
    process: [],
    outcomes: [{ val: '<30 min', label: 'Average delivery time' }, { val: '~50/day', label: 'Daily orders' }],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['landing-page'] },
  },
  {
    slug: 'gdg',
    type: 'landing-page',
    badge: 'client',
    featured: false,
    name: 'GDG',
    headline: 'A landing page for a growing student design community',
    role: 'Product Design Lead',
    year: 'Oct 2025 – Jul 2026',
    tools: 'Figma',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Student Design Community',
    categoryTag: 'Community',
    stats: [],
    problem: '',
    research: '',
    process: [],
    outcomes: [],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['landing-page'] },
  },
  {
    slug: 'kash',
    type: 'ui',
    badge: 'personal',
    featured: false,
    name: 'Kash',
    headline: 'A 30-screen UI exploration for a banking app concept',
    role: 'UI Designer',
    year: '',
    tools: 'Figma',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Banking App Concept',
    categoryTag: 'Fintech',
    stats: [{ val: '30', label: 'Screens designed' }],
    problem: '',
    research: '',
    process: [],
    outcomes: [],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['ui'] },
  },
  {
    slug: 'campus-ride',
    type: 'ui',
    badge: 'personal',
    featured: false,
    name: 'Campus Ride',
    headline: '',
    role: '',
    year: '',
    tools: '',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: '',
    categoryTag: '',
    stats: [],
    problem: '',
    research: '',
    process: [],
    outcomes: [],
    reflection: '',
    sections: { ...DEFAULT_SECTIONS_BY_TYPE['ui'] },
  },
]

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
      { value: '5', label: 'End-to-end products' },
    ],
  },
  expertise: [
    { title: 'User Research', body: 'Interviews, surveys, and usability testing that turn assumptions into evidence before a single pixel is placed.' },
    { title: 'UI/UX Design', body: 'Low-fidelity wireframes to high-fidelity, component-based prototypes in Figma — built to hand off clean.' },
    { title: 'Testing & Iteration', body: 'Moderated usability testing and iteration on flows, labels, and copy until the right action is the obvious one.' },
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
  projects: DEFAULT_PROJECTS,
}

/* ─────────────────────────────────────────────
   MIGRATION — old caseStudies/featuredProjects/
   otherWork shape → unified projects[]. Runs once
   for any visitor whose stored data predates this
   schema. Never destroys the original blob: it's
   always copied to a backup key first.
───────────────────────────────────────────── */
function slugifyTitle(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function findOldEntry(oldData: any, slug: string, name: string): { kind: 'case-study' | 'other-work'; data: any } | null {
  const cs = (oldData.caseStudies || []).find((c: any) => c.slug === slug)
  if (cs) return { kind: 'case-study', data: cs }
  const ow = (oldData.otherWork || []).find((o: any) => slugifyTitle(o.title || '') === slug || o.title === name)
  if (ow) return { kind: 'other-work', data: ow }
  return null
}

function migrateToProjects(oldData: any): Project[] {
  return DEFAULT_PROJECTS.map(defaultProj => {
    const found = findOldEntry(oldData, defaultProj.slug, defaultProj.name)
    if (!found) return defaultProj

    if (found.kind === 'case-study') {
      const cs = found.data
      return {
        ...defaultProj,
        headline: cs.headline ?? defaultProj.headline,
        role: cs.role ?? defaultProj.role,
        year: cs.timeline ?? defaultProj.year,
        coverImageUrl: cs.coverImageUrl || defaultProj.coverImageUrl,
        processImageUrl: cs.processImageUrl || defaultProj.processImageUrl,
        liveUrl: cs.liveUrl || defaultProj.liveUrl,
        behanceUrl: cs.behanceUrl || defaultProj.behanceUrl,
        category: cs.category ?? defaultProj.category,
        categoryTag: cs.categoryTag ?? defaultProj.categoryTag,
        stats: cs.stats?.length ? cs.stats : defaultProj.stats,
        problem: cs.problem ?? defaultProj.problem,
        process: cs.process?.length ? cs.process : defaultProj.process,
        outcomes: cs.outcomes?.length ? cs.outcomes : defaultProj.outcomes,
      }
    }

    const ow = found.data
    return {
      ...defaultProj,
      coverImageUrl: ow.imageUrl || defaultProj.coverImageUrl,
      behanceUrl: ow.externalUrl || defaultProj.behanceUrl,
    }
  })
}

/** True if this looks like the pre-restructure data shape. */
function isLegacyShape(raw: any): boolean {
  return !!raw && !raw.projects && (raw.caseStudies || raw.featuredProjects || raw.otherWork)
}

/** Normalizes any stored/remote payload (old or new shape) into the current PortfolioContent shape. */
function normalize(raw: any): PortfolioContent {
  if (!raw) return DEFAULT
  if (!isLegacyShape(raw)) return { ...DEFAULT, ...raw }

  const merged: any = { ...DEFAULT, ...raw, projects: migrateToProjects(raw) }
  delete merged.caseStudies
  delete merged.featuredProjects
  delete merged.otherWork
  return merged as PortfolioContent
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

const STORAGE_KEY = 'portfolio_v3'
const LEGACY_KEY = 'portfolio_v2'
const BACKUP_KEY = 'portfolio_v2_backup'

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ── 1. Bootstrap from localStorage immediately (instant load) ──
  const [data, setData] = useState<PortfolioContent>(() => {
    try {
      const rawV3 = localStorage.getItem(STORAGE_KEY)
      if (rawV3) return normalize(JSON.parse(rawV3))

      const rawV2 = localStorage.getItem(LEGACY_KEY)
      if (rawV2) {
        // Never lose the pre-migration blob, no matter what happens after this.
        try { localStorage.setItem(BACKUP_KEY, rawV2) } catch {}
        const migrated = normalize(JSON.parse(rawV2))
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated)) } catch {}
        return migrated
      }
    } catch {}
    return DEFAULT
  })

  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'unsaved'>('idle')
  const isFirstMount = useRef(true)

  // ── 2. On mount: fetch from Supabase and hydrate ──
  useEffect(() => {
    fetchPortfolio().then(remote => {
      if (remote) {
        if (isLegacyShape(remote)) {
          try { localStorage.setItem(BACKUP_KEY, JSON.stringify(remote)) } catch {}
        }
        const normalized = normalize(remote)
        setData(prev => ({ ...DEFAULT, ...prev, ...normalized }))
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)) } catch {}
      }
    })
  }, [])

  // ── 3. Whenever data changes (after first mount): save to LocalStorage ONLY ──
  useEffect(() => {
    if (isFirstMount.current) { isFirstMount.current = false; return }

    // Write to localStorage immediately
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
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
