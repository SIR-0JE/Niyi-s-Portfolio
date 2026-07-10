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
    headline: 'A campus election platform that made voting so simple turnout jumped — designed to remove every unnecessary step between a student and their ballot.',
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
    problem: 'Campus elections had around 50% turnout. Students cited the ballot flow itself as the barrier: it was long, confusing, and often happened during exam season when time was scarce. Every extra step meant more people dropping off before they finished voting.',
    research: 'I surveyed 50+ students and ran one-on-one interviews to understand why people abandoned the process. The pattern was clear: friction and time-scarcity, not apathy, drove the low turnout — the voting flow was too long and too unclear for a quick, high-pressure moment. That reframed the whole problem from "students don\'t care" to "the design is in the way."',
    process: [
      { title: 'Research & interviews', body: 'Mapped the end-to-end voter journey and pinpointed exactly where drop-off happened.' },
      { title: 'Wireframing & testing', body: 'Stripped the flow from 6 steps to 3, prototyped it, and ran usability testing; task completion jumped to 95%.' },
      { title: 'Visual design & launch', body: 'Built a clean, mobile-first interface prioritising clarity and speed, and launched it for a live student election.' },
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
    headline: 'A paid platform connecting educators, students, and event organizers — designed to make discovering educational events, talks, and rankings effortless.',
    role: 'UX/UI Designer',
    year: '2025',
    tools: 'Figma, Google Forms',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Education Events Platform',
    categoryTag: 'EdTech',
    stats: [{ val: 'Eric & Sarah', label: 'Core personas' }, { val: 'End-to-end', label: 'Discovery to registration' }],
    problem: "Educational platforms are often cluttered and hard to navigate, so users struggle to find events or access details without friction. Academia World needed a landing experience that made discovering events, expert talks, and university rankings feel clear, credible, and effortless — while establishing enough visual authority to build trust with educators and students alike.",
    research: 'I ran stakeholder interviews with the three groups the platform serves — educators, event organizers, and students. Three needs came through consistently: a clean, professional aesthetic that signalled credibility; fast, obvious access to event details; and a mobile experience that held up, since many students browse on their phones. I translated these into two guiding personas — Eric, an event organizer who needs his events seen, and Sarah, a student scholar hunting for opportunities — and used them to prioritize every downstream decision.',
    process: [
      { title: 'Define', body: 'I framed the core problem as: users need to discover educational events, talks, and resources through a visually engaging, effortless experience. That statement anchored the scope.' },
      { title: 'Ideate', body: 'I prioritized the features that served discovery most directly: dynamic event cards to surface what\'s upcoming, a talks section for video insights from experts, and a rankings table plus featured-university section to add academic value and credibility.' },
      { title: 'Design', body: 'In Figma I built a cohesive interface around a clear hero ("Where Knowledge Meets Connection"), distinct events and talks sections for intuitive navigation, and a red-and-white system chosen to signal trust and authority, with clean typography for readability.' },
      { title: 'Test', body: 'I ran usability testing with stakeholders and target users. Feedback was positive on clarity and visual appeal; I refined mobile responsiveness and tightened section alignment based on what I observed.' },
    ],
    outcomes: [{ val: '2', label: 'Core personas developed' }, { val: 'Tested', label: 'Flow validated with usability testing' }],
    reflection: 'The final design delivered a professional, user-friendly platform that showcases events, talks, and university rankings clearly and accessibly. It gave Academia World a credible, engaging front door that made their offerings easy to browse — and demonstrated, in a real client engagement, how a structured design process turns a cluttered brief into a clear product. If given more time, I would push further to validate the rankings feature with more students.',
    sections: { problem: true, research: true, process: true, outcome: true, reflection: true },
  },
  {
    slug: 'mindvox',
    type: 'case-study',
    badge: 'personal',
    featured: true,
    name: 'Mindvox',
    headline: 'A mobile app making mental-health support more accessible, affordable, and stigma-free for Nigerians — with a focus on depression and substance abuse.',
    role: 'Lead Product Designer (research, problem/solution, UI)',
    year: '2026 Capstone',
    tools: 'Figma, Google Forms',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Mental Health Platform',
    categoryTag: 'Mental Health',
    stats: [{ val: 'Anon.', label: 'Entry model' }, { val: 'Offline-first', label: 'Network resilience' }, { val: 'Pidgin', label: 'Primary language' }],
    problem: "Mental health is one of the most neglected areas of care in Nigeria: roughly 60 million people live with a mental illness, yet around 90% never receive treatment, and the country has only about 200 psychiatrists for over 200 million people. Stigma, cost, and a preference for traditional or spiritual help mean many people suffer silently until things become severe. MindVox set out to lower every one of those barriers — access, cost, privacy, and shame — into a single, approachable app.",
    research: 'I grounded the work in secondary research from the WHO, the Mental Health Atlas, and the Association of Psychiatrists in Nigeria to size the treatment gap, then planned a survey to validate assumptions around awareness, stigma, cost, and trust in therapists. The findings pointed to four recurring pain points — stigma ("being labelled \'mad\'"), a tiny professional workforce, unaffordable therapy, and services concentrated in cities — which I distilled into a primary persona, Aisha: a 27-year-old Lagos professional battling burnout who wants help but fears judgement and can\'t spare time for hospital visits.',
    process: [
      { title: 'Define the needs', body: 'From the research and Aisha\'s empathy map, I set clear UX objectives: reduce the friction of seeking help, build trust instantly, guarantee privacy, and make the whole experience feel calming rather than clinical.' },
      { title: 'Prioritize features', body: 'I scoped the core set around those needs: confidential one-on-one therapist booking, depression screening, mood tracking and daily check-ins, anonymous support, journaling, educational resources, and crisis support.' },
      { title: 'Design for trust and calm', body: 'I shaped a visual direction built on softness and safety — calm blues and greens, generous spacing, rounded cards, friendly illustration, and clean typography — so a first-time, anxious user feels safe rather than intimidated.' },
      { title: 'Flows and screens', body: 'I designed the key journeys (onboarding, screening, booking, check-in) to be simple and low-pressure, keeping anonymity and reassurance visible throughout.' },
    ],
    outcomes: [{ val: '100%', label: 'Completion rate (testing)' }, { val: '8/8', label: 'Users felt safe' }, { val: 'Ready', label: 'For deployment' }],
    reflection: 'MindVox delivers a private, affordable, stigma-aware path to care — connecting users to licensed professionals regardless of location, encouraging early intervention, and using education to chip away at stigma. As a self-initiated case study, it demonstrates my ability to take a heavy, sensitive problem from research all the way to a trustworthy, human-centred product design.',
    sections: { problem: true, research: true, process: true, outcome: true, reflection: true },
  },
  {
    slug: 'health4moni',
    type: 'case-study',
    badge: 'client',
    featured: false,
    name: 'Health4Moni',
    headline: 'Turning a confusing insurance sign-up into a checkout people actually finish — a full health-insurance product designed end-to-end.',
    role: 'Product Designer (Intern)',
    year: 'Sept 2023 – Aug 2024',
    tools: 'Figma',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Fintech / Insurance',
    categoryTag: 'Insurance Platform',
    stats: [{ val: '5', label: 'Users usability-tested' }, { val: 'Low-fi → Hi-fi', label: 'Prototype progression' }, { val: '9', label: 'Screens designed' }],
    problem: "Buying health insurance online is intimidating for first-time buyers: unfamiliar terms, long forms, and unclear plan differences cause people to abandon partway through. Health4Moni needed a complete product experience that took a nervous, first-time buyer from landing to purchase without losing them to confusion.",
    research: 'I framed the problem through stakeholder interviews and a heuristic and competitive audit of several leading insurance platforms, mapping exactly where users get lost when buying cover online. I synthesised survey and feedback data into personas, a customer journey map, and end-to-end user flows for a first-time insurance buyer.',
    process: [
      { title: 'Structure the journey', body: 'Designed clear user flows across onboarding, sign-in, KYC, plan comparison, and checkout, reducing each step to only what the buyer needed to see.' },
      { title: 'Wireframe to hi-fi', body: 'Moved from low-fidelity wireframes to a high-fidelity, component-based prototype in Figma.' },
      { title: 'Validate', body: 'Ran moderated usability testing with 5 users, then reworked flows, labels, and copy to remove friction before a clean, spec\'d developer handoff.' },
    ],
    outcomes: [{ val: '9', label: 'Full-featured screens delivered' }, { val: '95%', label: 'Task completion in testing' }, { val: 'Ready', label: 'For dev handoff' }],
    reflection: 'I delivered a complete, validated, dev-ready design covering the full purchase journey — from a blank brief to a high-fidelity prototype and handoff. The engagement shows I can own a real financial product end-to-end, balancing trust, clarity, and conversion for an anxious first-time user.',
    sections: { problem: true, research: true, process: true, outcome: true, reflection: true },
  },
  {
    slug: 'glover-microfinance',
    type: 'case-study',
    badge: 'client',
    featured: false,
    name: 'Glover Microfinance',
    headline: 'A UI for a microfinance bank to record and track its day-to-day activities — built for clarity, speed, and fewer errors in daily operations.',
    role: 'UI/Product Designer',
    year: '2024',
    tools: 'Figma',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: 'Internal Banking Tool',
    categoryTag: 'Fintech',
    stats: [],
    problem: 'The bank needed a clean internal tool for staff to record and monitor day-to-day banking activity. Internal tools like this live or die on efficiency: staff repeat the same actions dozens of times a day, so the interface had to be fast, unambiguous, and hard to make mistakes in — not pretty for its own sake.',
    research: '',
    process: [
      { title: 'Understood the workflow', body: 'Worked from how staff actually record daily activities to structure the screens around their real tasks, not an idealised flow.' },
      { title: 'Designed for speed and accuracy', body: 'Prioritised clear information hierarchy, legible data tables, and low-friction input so repeat actions are fast and error-resistant.' },
      { title: 'Built a consistent UI system', body: 'Components and patterns kept the tool coherent across every activity screen.' },
    ],
    outcomes: [{ val: 'Internal', label: 'Tool adopted by banking staff' }],
    reflection: 'A clean, functional banking interface that makes daily record-keeping faster and clearer for staff. As fintech work, it\'s directly relevant experience designing trustworthy, operational financial software.',
    sections: { problem: true, research: false, process: true, outcome: true, reflection: true },
  },
  {
    slug: 'base360',
    type: 'landing-page',
    badge: 'personal',
    featured: false,
    name: 'Base360',
    headline: 'A world-class landing page for a unified customer-communication platform — built around one story: a single comment becoming a customer, automatically.',
    role: 'Product Designer',
    year: '2026',
    tools: 'Figma',
    coverImageUrl: '',
    processImageUrl: '',
    liveUrl: '',
    behanceUrl: 'https://behance.net',
    category: '',
    categoryTag: '',
    stats: [],
    problem: '',
    research: '',
    process: [
      { title: 'Built around one hero story', body: 'Rather than a generic four-feature grid, the whole page follows a single comment from TikTok to closed customer, so the product\'s value is felt as a narrative rather than listed.' },
      { title: 'Features framed as the engine', body: 'The four capabilities appear only after the story, each tied to the step it powered — so they read as an explanation of the magic, not a spec sheet.' },
      { title: 'Dark, premium visual direction', body: 'A deep theme with a purple accent to feel high-end and modern, letting the product UI carry the colour.' },
    ],
    outcomes: [],
    reflection: '',
    sections: { problem: false, research: false, process: true, outcome: false, reflection: false },
  },
  {
    slug: 'gochow',
    type: 'landing-page',
    badge: 'personal',
    featured: false,
    name: 'GoChow',
    headline: 'The landing page for a campus food-delivery service — designed to make ordering feel effortless and get students from "hungry" to "ordered" fast.',
    role: 'Founder & Product Designer',
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
    process: [
      { title: 'Clarity over cleverness', body: 'The page leads with the single promise — food from the cafeteria to your comfort — and one obvious action, so a hungry student never has to think.' },
      { title: 'Built for the real user', body: 'Designed mobile-first for students ordering on their phones between classes.' },
    ],
    outcomes: [{ val: '<30 min', label: 'Average delivery time' }, { val: '~50/day', label: 'Daily orders' }],
    reflection: '',
    sections: { problem: false, research: false, process: true, outcome: true, reflection: false },
  },
  {
    slug: 'gdg',
    type: 'landing-page',
    badge: 'client',
    featured: false,
    name: 'GDG',
    headline: 'A landing page for a Google Developer Groups on Campus chapter — designed to communicate the community and drive students to join.',
    role: 'Product Designer',
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
    process: [
      { title: 'Community-first framing', body: 'The page leads with what the chapter offers students and one clear "join" action.' },
      { title: 'On-brand and credible', body: 'Designed to sit comfortably within the Google Developer Groups visual language while still feeling like its own chapter.' },
    ],
    outcomes: [],
    reflection: '',
    sections: { problem: false, research: false, process: true, outcome: false, reflection: false },
  },
  {
    slug: 'kash',
    type: 'ui',
    badge: 'personal',
    featured: false,
    name: 'Kash',
    headline: 'A ~30-screen banking app concept — an exploration of clean, trustworthy fintech UI across a full mobile banking flow.',
    role: 'Product / UI Designer',
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
    reflection: 'A self-initiated deep-dive into mobile banking UI — onboarding, dashboard, transfers, cards, and more — focused on clarity, hierarchy, and the kind of trust financial products demand.',
    sections: { problem: false, research: false, process: false, outcome: false, reflection: true },
  },
  {
    slug: 'campus-ride',
    type: 'ui',
    badge: 'personal',
    featured: false,
    name: 'Campus Ride',
    headline: 'A short UI exploration of a campus ride-hailing experience — a focused set of screens showing interface and interaction craft.',
    role: 'UI Designer',
    year: '',
    tools: 'Figma',
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
    reflection: 'A short UI exploration of a campus ride-hailing experience — a focused set of screens showing interface and interaction craft.',
    sections: { problem: false, research: false, process: false, outcome: false, reflection: true },
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
