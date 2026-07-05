import React, { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import type {
  HeroContent, ExpertiseCard, FeaturedProject, Stat,
  FAQItem, TestimonialItem, ExperienceItem, CaseStudyContent, ProcessStep, OutcomeCard, CaseStudyStat
} from '../context/PortfolioContext'

/* ── Design tokens ── */
const T = {
  bg: '#08090D',
  surface: '#0F1015',
  card: '#13151C',
  border: 'rgba(255,255,255,0.07)',
  accent: 'rgb(255,128,74)',
  accentFaint: 'rgba(255,128,74,0.12)',
  accentBorder: 'rgba(255,128,74,0.3)',
  text: '#ffffff',
  muted: '#9399a6',
  success: '#22c55e',
  danger: '#ef4444',
}

/* ── Shared UI primitives ── */
const inp: React.CSSProperties = { fontFamily: 'Poppins,sans-serif', fontSize: 13, color: T.text, background: 'rgba(255,255,255,0.04)', border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', outline: 'none', width: '100%', boxSizing: 'border-box' }
const ta: React.CSSProperties = { ...inp, resize: 'vertical' as const }
const label: React.CSSProperties = { fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', color: T.muted, display: 'block', marginBottom: 6 }
const card: React.CSSProperties = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24 }
const row: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center' }

function Field({ label: lbl, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}><span style={label}>{lbl}</span>{children}</div>
}
function Inp({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inp} />
}
function Ta({ value, onChange, rows = 3, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; placeholder?: string }) {
  return <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} placeholder={placeholder} style={ta} />
}
function Btn({ children, onClick, color = T.accent, textColor = '#000', style: s }: { children: React.ReactNode; onClick?: () => void; color?: string; textColor?: string; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', background: color, color: textColor, border: 'none', borderRadius: 100, padding: '10px 20px', cursor: 'pointer', whiteSpace: 'nowrap', ...s }}>
      {children}
    </button>
  )
}
function Ghost({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 500, fontSize: 12, background: 'none', border: `1px solid rgba(239,68,68,0.4)`, color: T.danger, borderRadius: 8, padding: '6px 14px', cursor: 'pointer' }}>
      {children}
    </button>
  )
}
function SecHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 22, color: T.text, margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: T.muted, margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )
}
function Divider() { return <div style={{ height: 1, background: T.border, margin: '24px 0' }} /> }

/* ── Image upload + URL input ── */
function ImgField({ label: lbl, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = ev => {
      if (ev.target?.result) {
        // Resize image to prevent localStorage QuotaExceededError
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX = 1200
          let w = img.width
          let h = img.height
          if (w > MAX || h > MAX) {
            if (w > h) { h *= MAX / w; w = MAX }
            else { w *= MAX / h; h = MAX }
          }
          canvas.width = w
          canvas.height = h
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, w, h)
          onChange(canvas.toDataURL('image/jpeg', 0.8)) // 80% quality JPEG saves massive space
        }
        img.src = ev.target.result as string
      }
    }
    r.readAsDataURL(f)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={label}>{lbl}</span>
      {value && <img src={value} alt={lbl} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, border: `1px solid ${T.border}` }} />}
      <Inp value={value.startsWith('data:') ? '' : value} onChange={onChange} placeholder="Paste image URL..." />
      <label style={{ ...label, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: `1px dashed ${T.border}` }}>
        📎 Upload local file
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      </label>
    </div>
  )
}

/* ─────────────────────────────────────────────
   SECTION EDITORS
───────────────────────────────────────────── */

function NavbarEditor() {
  const { data, setNested } = usePortfolio()
  const n = data.navbar
  const upd = (patch: Partial<typeof n>) => setNested('navbar', { ...n, ...patch })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SecHead title="Navbar" sub="Logo text and Hire Me button link" />
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Logo Text"><Inp value={n.logoText} onChange={v => upd({ logoText: v })} /></Field>
          <Field label="Hire Me link (email or URL)"><Inp value={n.hireMeHref} onChange={v => upd({ hireMeHref: v })} /></Field>
        </div>
      </div>
    </div>
  )
}

function HeroEditor() {
  const { data, setNested } = usePortfolio()
  const h = data.hero
  const upd = (patch: Partial<HeroContent>) => setNested('hero', { ...h, ...patch })
  const updStat = (i: number, patch: Partial<typeof h.stats[0]>) => {
    const s = [...h.stats]; s[i] = { ...s[i], ...patch }; upd({ stats: s })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SecHead title="Hero Section" sub="The big headline, subtext, CTA buttons and stat counters" />
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Field label="Headline line 1 (white)"><Inp value={h.headline1} onChange={v => upd({ headline1: v })} /></Field>
          <Field label="Headline line 2 (white)"><Inp value={h.headline2} onChange={v => upd({ headline2: v })} /></Field>
          <Field label="Headline line 3 (orange)"><Inp value={h.headline3} onChange={v => upd({ headline3: v })} /></Field>
          <Field label="Headline line 4 (orange)"><Inp value={h.headline4} onChange={v => upd({ headline4: v })} /></Field>
          <Field label="Sub-text paragraph"><Ta value={h.subtext} onChange={v => upd({ subtext: v })} rows={2} /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="CTA Button 1 label"><Inp value={h.cta1Label} onChange={v => upd({ cta1Label: v })} /></Field>
            <Field label="CTA Button 1 href"><Inp value={h.cta1Href} onChange={v => upd({ cta1Href: v })} /></Field>
            <Field label="CTA Button 2 label"><Inp value={h.cta2Label} onChange={v => upd({ cta2Label: v })} /></Field>
            <Field label="CTA Button 2 href"><Inp value={h.cta2Href} onChange={v => upd({ cta2Href: v })} /></Field>
          </div>
        </div>
      </div>

      {/* Stats */}
      <SecHead title="Hero Stats" sub="The 4 number chips below the headline" />
      {h.stats.map((s, i) => (
        <div key={i} style={{ ...card, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 80px' }}><Field label="Value"><Inp value={s.value} onChange={v => updStat(i, { value: v })} /></Field></div>
          <div style={{ flex: 1 }}><Field label="Label"><Inp value={s.label} onChange={v => updStat(i, { label: v })} /></Field></div>
          <Ghost onClick={() => upd({ stats: h.stats.filter((_, j) => j !== i) })}>Remove</Ghost>
        </div>
      ))}
      <Btn onClick={() => upd({ stats: [...h.stats, { value: '', label: '' }] })}>+ Add Stat</Btn>
    </div>
  )
}

function ExpertiseEditor() {
  const { data, setNested } = usePortfolio()
  const cards = data.expertise
  const upd = (i: number, patch: Partial<ExpertiseCard>) => {
    const c = [...cards]; c[i] = { ...c[i], ...patch }; setNested('expertise', c)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SecHead title="Expertise Cards" sub="The 3 skill cards on the home page" />
      {cards.map((c, i) => (
        <div key={i} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={row}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: T.accent }}>{i + 1}</span>
            <Ghost onClick={() => setNested('expertise', cards.filter((_, j) => j !== i))}>Remove Card</Ghost>
          </div>
          <Field label="Title"><Inp value={c.title} onChange={v => upd(i, { title: v })} /></Field>
          <Field label="Body text"><Ta value={c.body} onChange={v => upd(i, { body: v })} rows={2} /></Field>
        </div>
      ))}
      <Btn onClick={() => setNested('expertise', [...cards, { title: '', body: '' }])}>+ Add Card</Btn>
    </div>
  )
}

function MagicAIBox({ onResult }: { onResult: (data: Partial<FeaturedProject>) => void }) {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (!prompt) return
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      onResult(data)
      setPrompt('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 16, background: 'rgba(255, 128, 74, 0.05)', border: `1px solid ${T.accentBorder}`, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>✨</span>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: T.accent }}>Magic AI Form Filler (Claude)</span>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: T.muted }}>Paste your messy notes, Slack messages, or raw thoughts below. Claude will parse it and fill out the fields automatically.</p>
      <Ta value={prompt} onChange={setPrompt} rows={3} placeholder="e.g. I worked on a fintech app called Health4Monii as a UI intern..." />
      {error && <span style={{ color: T.danger, fontSize: 12 }}>{error}</span>}
      <button onClick={handleGenerate} disabled={loading || !prompt} style={{ background: T.accent, color: T.bg, border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'Poppins,sans-serif', cursor: loading || !prompt ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', opacity: loading || !prompt ? 0.5 : 1 }}>
        {loading ? '⟳ Claude is thinking...' : '✨ Auto-Fill Fields'}
      </button>
    </div>
  )
}

function FeaturedProjectsEditor() {
  const { data, setNested } = usePortfolio()
  const projs = data.featuredProjects

  const updProj = (i: number, patch: Partial<FeaturedProject>) => {
    const p = [...projs]; p[i] = { ...p[i], ...patch }; setNested('featuredProjects', p)
  }
  const updStat = (pi: number, si: number, patch: Partial<Stat>) => {
    const p = [...projs]
    const stats = [...p[pi].stats]; stats[si] = { ...stats[si], ...patch }
    p[pi] = { ...p[pi], stats }; setNested('featuredProjects', p)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SecHead title="Featured Projects (Home)" sub="The project cards shown on the home page" />
      {projs.map((proj, i) => (
        <div key={i} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={row}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: T.text, flex: 1 }}>{proj.name || `Project ${i + 1}`}</span>
            <Ghost onClick={() => setNested('featuredProjects', projs.filter((_, j) => j !== i))}>Remove</Ghost>
          </div>
          <MagicAIBox onResult={data => updProj(i, data)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Project name"><Inp value={proj.name} onChange={v => updProj(i, { name: v })} /></Field>
            <Field label="Route / href"><Inp value={proj.href} onChange={v => updProj(i, { href: v })} /></Field>
          </div>
          <ImgField label="Project Cover Image" value={proj.imageUrl || ''} onChange={v => updProj(i, { imageUrl: v })} />
          <Field label="Card headline"><Ta value={proj.headline} onChange={v => updProj(i, { headline: v })} rows={2} /></Field>
          <Field label="Role badge"><Inp value={proj.role} onChange={v => updProj(i, { role: v })} /></Field>
          <Divider />
          <span style={label}>Stats</span>
          {proj.stats.map((s, si) => (
            <div key={si} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: 10, alignItems: 'end' }}>
              <Field label="Before"><Inp value={s.before} onChange={v => updStat(i, si, { before: v })} /></Field>
              <Field label="After (orange)"><Inp value={s.after} onChange={v => updStat(i, si, { after: v })} /></Field>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <Field label="Label"><Inp value={s.label} onChange={v => updStat(i, si, { label: v })} /></Field>
                <Ghost onClick={() => { const stats = proj.stats.filter((_, j) => j !== si); updProj(i, { stats }) }}>×</Ghost>
              </div>
            </div>
          ))}
          <Btn onClick={() => updProj(i, { stats: [...proj.stats, { before: '', after: '', label: '' }] })}>+ Stat</Btn>
        </div>
      ))}
      <Btn onClick={() => setNested('featuredProjects', [...projs, { name: '', href: '#/projects', headline: '', role: '', stats: [] }])}>+ Add Project Card</Btn>
    </div>
  )
}

function TestimonialsEditor() {
  const { data, setNested } = usePortfolio()
  const ts = data.testimonials
  const upd = (i: number, patch: Partial<TestimonialItem>) => {
    const a = [...ts]; a[i] = { ...a[i], ...patch }; setNested('testimonials', a)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SecHead title="Testimonials" sub="The quotes slider shown on Home and About pages" />
      {ts.map((t, i) => (
        <div key={i} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={row}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: T.accent, flex: 1 }}>Testimonial {i + 1}</span>
            <Ghost onClick={() => setNested('testimonials', ts.filter((_, j) => j !== i))}>Remove</Ghost>
          </div>
          <Field label="Name"><Inp value={t.name} onChange={v => upd(i, { name: v })} /></Field>
          <Field label="Role / Company"><Inp value={t.role} onChange={v => upd(i, { role: v })} /></Field>
          <Field label="Quote text"><Ta value={t.quote} onChange={v => upd(i, { quote: v })} rows={3} /></Field>
        </div>
      ))}
      <Btn onClick={() => setNested('testimonials', [...ts, { name: '', role: '', quote: '' }])}>+ Add Testimonial</Btn>
    </div>
  )
}

function FAQEditor() {
  const { data, setNested } = usePortfolio()
  const faqs = data.faqs
  const upd = (i: number, patch: Partial<FAQItem>) => {
    const a = [...faqs]; a[i] = { ...a[i], ...patch }; setNested('faqs', a)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SecHead title="FAQ" sub="Accordion questions on the Home page" />
      {faqs.map((f, i) => (
        <div key={i} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={row}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: T.accent, flex: 1 }}>Q{i + 1}</span>
            <Ghost onClick={() => setNested('faqs', faqs.filter((_, j) => j !== i))}>Remove</Ghost>
          </div>
          <Field label="Question"><Inp value={f.question} onChange={v => upd(i, { question: v })} /></Field>
          <Field label="Answer"><Ta value={f.answer} onChange={v => upd(i, { answer: v })} rows={3} /></Field>
        </div>
      ))}
      <Btn onClick={() => setNested('faqs', [...faqs, { question: '', answer: '' }])}>+ Add FAQ</Btn>
    </div>
  )
}

function FooterEditor() {
  const { data, setNested } = usePortfolio()
  const f = data.footer
  const upd = (patch: Partial<typeof f>) => setNested('footer', { ...f, ...patch })
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SecHead title="Footer" sub="CTA headline, email, copyright and social links" />
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="CTA headline text"><Inp value={f.cta} onChange={v => upd({ cta: v })} /></Field>
          <Field label="Email (shown + mailto link)"><Inp value={f.email} onChange={v => upd({ email: v })} /></Field>
          <Field label="Copyright text"><Inp value={f.copyright} onChange={v => upd({ copyright: v })} /></Field>
        </div>
      </div>
      <SecHead title="Footer Links" />
      {f.links.map((l, i) => (
        <div key={i} style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, alignItems: 'end' }}>
          <Field label="Label"><Inp value={l.label} onChange={v => { const ls = [...f.links]; ls[i] = { ...ls[i], label: v }; upd({ links: ls }) }} /></Field>
          <div style={{ display: 'flex', gap: 8 }}>
            <Field label="Href"><Inp value={l.href} onChange={v => { const ls = [...f.links]; ls[i] = { ...ls[i], href: v }; upd({ links: ls }) }} /></Field>
            <Ghost onClick={() => upd({ links: f.links.filter((_, j) => j !== i) })}>×</Ghost>
          </div>
        </div>
      ))}
      <Btn onClick={() => upd({ links: [...f.links, { label: '', href: '' }] })}>+ Add Link</Btn>
    </div>
  )
}

function AboutEditor() {
  const { data, setNested } = usePortfolio()
  const a = data.about
  const upd = (patch: Partial<typeof a>) => setNested('about', { ...a, ...patch })
  const exp = data.experience
  const updExp = (i: number, patch: Partial<ExperienceItem>) => {
    const e = [...exp]; e[i] = { ...e[i], ...patch }; setNested('experience', e)
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <SecHead title="About — Intro" sub="Headline, bio paragraph and portrait photo" />
      <div style={card}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label="Intro headline (each line separated by \\n)">
            <Ta value={a.introHeadline} onChange={v => upd({ introHeadline: v })} rows={4} />
          </Field>
          <Field label="Bio paragraph">
            <Ta value={a.bio} onChange={v => upd({ bio: v })} rows={5} />
          </Field>
          <ImgField label="Portrait photo" value={a.portraitUrl} onChange={v => upd({ portraitUrl: v })} />
        </div>
      </div>

      <SecHead title="Experience Items" sub="Work history shown on the About page" />
      {exp.map((e, i) => (
        <div key={i} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={row}>
            <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: T.accent, flex: 1 }}>{e.role || `Job ${i + 1}`}</span>
            <Ghost onClick={() => setNested('experience', exp.filter((_, j) => j !== i))}>Remove</Ghost>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <Field label="Role title"><Inp value={e.role} onChange={v => updExp(i, { role: v })} /></Field>
            <Field label="Dates"><Inp value={e.dates} onChange={v => updExp(i, { dates: v })} /></Field>
          </div>
          <Field label="Organisation"><Inp value={e.org} onChange={v => updExp(i, { org: v })} /></Field>
          <Field label="Description"><Ta value={e.blurb} onChange={v => updExp(i, { blurb: v })} rows={2} /></Field>
        </div>
      ))}
      <Btn onClick={() => setNested('experience', [...exp, { role: '', org: '', dates: '', blurb: '' }])}>+ Add Experience</Btn>
    </div>
  )
}

function CaseStudyEditor() {
  const { data, setNested } = usePortfolio()
  const studies = data.caseStudies
  const [active, setActive] = useState<number | null>(null)
  const [subTab, setSubTab] = useState<'meta' | 'problem' | 'process' | 'outcomes' | 'images'>('meta')

  const upd = (i: number, patch: Partial<CaseStudyContent>) => {
    const a = [...studies]; a[i] = { ...a[i], ...patch }; setNested('caseStudies', a)
  }
  const updStat = (ci: number, si: number, patch: Partial<CaseStudyStat>) => {
    const a = [...studies[ci].stats]; a[si] = { ...a[si], ...patch }; upd(ci, { stats: a })
  }
  const updStep = (ci: number, pi: number, patch: Partial<ProcessStep>) => {
    const a = [...studies[ci].process]; a[pi] = { ...a[pi], ...patch }; upd(ci, { process: a })
  }
  const updOutcome = (ci: number, oi: number, patch: Partial<OutcomeCard>) => {
    const a = [...studies[ci].outcomes]; a[oi] = { ...a[oi], ...patch }; upd(ci, { outcomes: a })
  }

  if (active === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SecHead title="Case Studies" sub="Edit all content for each case study page" />
        {studies.map((s, i) => (
          <div key={i} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: T.text }}>{s.headline.slice(0, 60)}…</div>
              <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: T.accent, marginTop: 4 }}>{s.category} · /{s.slug}</div>
            </div>
            <Btn onClick={() => { setActive(i); setSubTab('meta') }}>Edit →</Btn>
          </div>
        ))}
        <Btn onClick={() => setNested('caseStudies', [...studies, {
          slug: 'new-project', category: 'New Category', headline: 'New project headline', stats: [], role: '', timeline: '', categoryTag: '', problem: '', process: [], outcomes: [], behanceUrl: 'https://behance.net', coverImageUrl: '', processImageUrl: ''
        }])}>+ Add Case Study</Btn>
      </div>
    )
  }

  const cs = studies[active]
  const TABS = ['meta', 'problem', 'process', 'outcomes', 'images'] as const
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: T.muted, fontFamily: 'Poppins,sans-serif', fontSize: 13, cursor: 'pointer' }}>← Back</button>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: T.text }}>{cs.category}</span>
        <Ghost onClick={() => { setNested('caseStudies', studies.filter((_, j) => j !== active)); setActive(null) }}>Delete Case Study</Ghost>
      </div>
      {/* Sub-tabs */}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: `1px solid ${T.border}`, paddingBottom: 12 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setSubTab(t)} style={{ background: subTab === t ? T.accentFaint : 'none', border: subTab === t ? `1px solid ${T.accentBorder}` : '1px solid transparent', borderRadius: 100, padding: '6px 18px', fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 12, letterSpacing: '0.04em', textTransform: 'uppercase', color: subTab === t ? T.accent : T.muted, cursor: 'pointer' }}>
            {t}
          </button>
        ))}
      </div>

      {/* META */}
      {subTab === 'meta' && (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="URL slug (no spaces)"><Inp value={cs.slug} onChange={v => upd(active, { slug: v })} /></Field>
            <Field label="Category label (orange)"><Inp value={cs.category} onChange={v => upd(active, { category: v })} /></Field>
            <Field label="Role"><Inp value={cs.role} onChange={v => upd(active, { role: v })} /></Field>
            <Field label="Timeline"><Inp value={cs.timeline} onChange={v => upd(active, { timeline: v })} /></Field>
            <Field label="Context tag (grid)"><Inp value={cs.categoryTag} onChange={v => upd(active, { categoryTag: v })} /></Field>
            <Field label="Behance URL"><Inp value={cs.behanceUrl} onChange={v => upd(active, { behanceUrl: v })} /></Field>
          </div>
          <Field label="Main headline"><Ta value={cs.headline} onChange={v => upd(active, { headline: v })} rows={2} /></Field>
          <Divider />
          <span style={label}>Hero Stats (the 3 big numbers)</span>
          {cs.stats.map((s, si) => (
            <div key={si} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, alignItems: 'end' }}>
              <Field label="Value"><Inp value={s.val} onChange={v => updStat(active, si, { val: v })} /></Field>
              <div style={{ display: 'flex', gap: 8 }}>
                <Field label="Label"><Inp value={s.label} onChange={v => updStat(active, si, { label: v })} /></Field>
                <Ghost onClick={() => upd(active, { stats: cs.stats.filter((_, j) => j !== si) })}>×</Ghost>
              </div>
            </div>
          ))}
          <Btn onClick={() => upd(active, { stats: [...cs.stats, { val: '', label: '' }] })}>+ Stat</Btn>
        </div>
      )}

      {/* PROBLEM */}
      {subTab === 'problem' && (
        <div style={card}>
          <Field label="The Problem text"><Ta value={cs.problem} onChange={v => upd(active, { problem: v })} rows={6} /></Field>
        </div>
      )}

      {/* PROCESS */}
      {subTab === 'process' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cs.process.map((step, pi) => (
            <div key={pi} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={row}>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: T.accent, flex: 1 }}>Step {pi + 1}</span>
                <Ghost onClick={() => upd(active, { process: cs.process.filter((_, j) => j !== pi) })}>Remove</Ghost>
              </div>
              <Field label="Step title"><Inp value={step.title} onChange={v => updStep(active, pi, { title: v })} /></Field>
              <Field label="Step description"><Ta value={step.body} onChange={v => updStep(active, pi, { body: v })} rows={3} /></Field>
            </div>
          ))}
          <Btn onClick={() => upd(active, { process: [...cs.process, { title: '', body: '' }] })}>+ Add Step</Btn>
        </div>
      )}

      {/* OUTCOMES */}
      {subTab === 'outcomes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {cs.outcomes.map((o, oi) => (
            <div key={oi} style={{ ...card, display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12, alignItems: 'end' }}>
              <Field label="Value (large orange)"><Inp value={o.val} onChange={v => updOutcome(active, oi, { val: v })} /></Field>
              <div style={{ display: 'flex', gap: 8 }}>
                <Field label="Label"><Inp value={o.label} onChange={v => updOutcome(active, oi, { label: v })} /></Field>
                <Ghost onClick={() => upd(active, { outcomes: cs.outcomes.filter((_, j) => j !== oi) })}>×</Ghost>
              </div>
            </div>
          ))}
          <Btn onClick={() => upd(active, { outcomes: [...cs.outcomes, { val: '', label: '' }] })}>+ Add Outcome</Btn>
        </div>
      )}

      {/* IMAGES */}
      {subTab === 'images' && (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ImgField label="Hero cover image (top of case study)" value={cs.coverImageUrl} onChange={v => upd(active, { coverImageUrl: v })} />
          <Divider />
          <ImgField label="Process / wireframes image (mid-page)" value={cs.processImageUrl} onChange={v => upd(active, { processImageUrl: v })} />
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   SIDEBAR TABS CONFIG
───────────────────────────────────────────── */
type TabKey = 'navbar' | 'hero' | 'expertise' | 'featured' | 'testimonials' | 'faq' | 'footer' | 'about' | 'casestudies'
const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'navbar',       label: 'Navbar',          icon: '⚓' },
  { key: 'hero',        label: 'Hero',             icon: '🏠' },
  { key: 'expertise',   label: 'Expertise',        icon: '🔧' },
  { key: 'featured',    label: 'Featured Work',    icon: '💼' },
  { key: 'testimonials',label: 'Testimonials',     icon: '💬' },
  { key: 'faq',         label: 'FAQ',              icon: '❓' },
  { key: 'footer',      label: 'Footer',           icon: '🔗' },
  { key: 'about',       label: 'About + Exp.',     icon: '👤' },
  { key: 'casestudies', label: 'Case Studies',     icon: '📋' },
]

/* ─────────────────────────────────────────────
   ROOT ADMIN PANEL
───────────────────────────────────────────── */
const ADMIN_USER = 'admin'
const ADMIN_PASS = '1234'

export default function AdminPanel() {
  const { reset } = usePortfolio()

  /* Auth */
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('admin_v2') === 'true')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  /* Tab */
  const [tab, setTab] = useState<TabKey>('hero')
  const { syncStatus, pushToCloud } = usePortfolio()

  /* Sync status display helpers */
  const syncLabel = syncStatus === 'saving' ? '⟳ Syncing to cloud…'
    : syncStatus === 'saved' ? '✓ Saved to cloud'
    : syncStatus === 'unsaved' ? 'Unsaved changes'
    : syncStatus === 'error' ? '⚠ Cloud sync failed (saved locally)'
    : '● Ready'
  const syncColor = syncStatus === 'saving' ? T.accent
    : syncStatus === 'saved' ? T.success
    : syncStatus === 'unsaved' ? '#f59e0b'
    : syncStatus === 'error' ? T.danger
    : T.muted

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Poppins,sans-serif' }}>
        <form onSubmit={e => { e.preventDefault(); if (user === ADMIN_USER && pass === ADMIN_PASS) { setAuthed(true); sessionStorage.setItem('admin_v2', 'true') } else setErr('Wrong credentials.') }}
          style={{ width: 400, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, background: T.accentFaint, border: `1px solid ${T.accentBorder}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px' }}>🔐</div>
            <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 20, color: T.text, margin: 0 }}>Admin Dashboard</h1>
            <p style={{ color: T.muted, fontSize: 13, margin: '6px 0 0' }}>Enter your credentials to edit the portfolio</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Field label="Username"><input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="admin" style={inp} required /></Field>
            <Field label="Password"><input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••" style={inp} required /></Field>
          </div>
          {err && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 16px', color: T.danger, fontSize: 13, textAlign: 'center' }}>{err}</div>}
          <Btn>Access Dashboard</Btn>
          <button type="button" onClick={() => { window.location.hash = '' }} style={{ background: 'none', border: 'none', color: T.muted, fontSize: 13, cursor: 'pointer' }}>← Back to site</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', fontFamily: 'Poppins,sans-serif' }}>

      {/* Header bar */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60, background: T.surface, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 24px', gap: 20 }}>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 16, color: T.text }}>🎨 Portfolio Admin</span>
        <div style={{ flex: 1 }} />
        {/* Sync status & Push Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: syncColor, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: syncColor, display: 'inline-block', animation: syncStatus === 'saving' ? 'pulse 1s infinite' : 'none' }} />
            {syncLabel}
          </span>
          {syncStatus === 'unsaved' && (
            <button onClick={pushToCloud} style={{ background: T.accent, color: T.bg, border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins,sans-serif', cursor: 'pointer' }}>
              Push to Live Site
            </button>
          )}
        </div>
        <Btn onClick={() => { window.location.hash = '' }} color="rgba(255,255,255,0.06)" textColor={T.text}>View Site →</Btn>
        <Btn onClick={() => { sessionStorage.removeItem('admin_v2'); setAuthed(false) }} color="rgba(239,68,68,0.15)" textColor={T.danger}>Log out</Btn>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', marginTop: 60, flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: T.surface, borderRight: `1px solid ${T.border}`, position: 'fixed', top: 60, bottom: 0, overflowY: 'auto', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, padding: '4px 12px', marginBottom: 8 }}>Sections</span>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: tab === t.key ? T.accentFaint : 'transparent', border: tab === t.key ? `1px solid ${T.accentBorder}` : '1px solid transparent', color: tab === t.key ? T.accent : T.muted, fontFamily: 'Poppins,sans-serif', fontWeight: tab === t.key ? 600 : 400, fontSize: 13, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
            <button onClick={() => { if (window.confirm('Reset ALL content to defaults?')) { reset() } }}
              style={{ background: 'none', border: 'none', color: T.danger, fontSize: 12, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', padding: '8px 14px' }}>
              ⚠️ Reset to defaults
            </button>
          </div>
        </aside>

        {/* Main panel */}
        <main style={{ marginLeft: 220, flex: 1, padding: '32px 40px', overflowY: 'auto', maxWidth: 900 }}>
          {tab === 'navbar'       && <NavbarEditor />}
          {tab === 'hero'        && <HeroEditor />}
          {tab === 'expertise'   && <ExpertiseEditor />}
          {tab === 'featured'    && <FeaturedProjectsEditor />}
          {tab === 'testimonials' && <TestimonialsEditor />}
          {tab === 'faq'         && <FAQEditor />}
          {tab === 'footer'      && <FooterEditor />}
          {tab === 'about'       && <AboutEditor />}
          {tab === 'casestudies' && <CaseStudyEditor />}
        </main>
      </div>
    </div>
  )
}
