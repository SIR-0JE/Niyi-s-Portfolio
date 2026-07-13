import React, { useState, useEffect } from 'react'
import { usePortfolio, PROJECT_TYPE_LABELS, DEFAULT_SECTIONS_BY_TYPE, emptyProject } from '../context/PortfolioContext'
import type {
  HeroContent, ExpertiseCard,
  FAQItem, TestimonialItem, ExperienceItem, Project, ProjectType, ProjectBadge, ProjectStat, ProjectProcessStep
} from '../context/PortfolioContext'
import { uploadImage } from '../lib/supabase'
import { getVisitorStats, getMostViewedPaths, getRecentVisitors, getVisitorPageViews, hoursAgo, daysAgo } from '../lib/analytics'
import type { Visitor, VisitorStats, PathViews } from '../lib/analytics'

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
function Btn({ children, onClick, color = T.accent, textColor = '#000', style: s, className }: { children: React.ReactNode; onClick?: () => void; color?: string; textColor?: string; style?: React.CSSProperties; className?: string }) {
  return (
    <button onClick={onClick} className={className} style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', background: color, color: textColor, border: 'none', borderRadius: 100, padding: '10px 20px', cursor: 'pointer', whiteSpace: 'nowrap', ...s }}>
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
  const [isUploading, setIsUploading] = useState(false)
  
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setIsUploading(true)
    const url = await uploadImage(f)
    if (url) {
      onChange(url)
    } else {
      alert('Failed to upload image. Please ensure your Supabase credentials are correct and the bucket exists.')
    }
    setIsUploading(false)
  }
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={label}>{lbl}</span>
      {value && <img src={value} alt={lbl} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, border: `1px solid ${T.border}` }} />}
      <Inp value={value.startsWith('data:') ? '' : value} onChange={onChange} placeholder="Paste image URL..." />
      <label style={{ ...label, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, cursor: isUploading ? 'not-allowed' : 'pointer', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: `1px dashed ${T.border}`, opacity: isUploading ? 0.5 : 1 }}>
        {isUploading ? '⏳ Uploading to Cloud...' : '📎 Upload high-res file'}
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} disabled={isUploading} />
      </label>
    </div>
  )
}

/* ── Gallery Manager ── */
function GalleryManager({ 
  gallery = [], 
  layout = 'grid', 
  onChange 
}: { 
  gallery?: { url: string; caption: string }[]; 
  layout?: 'grid' | 'horizontal'; 
  onChange: (patch: { gallery?: { url: string; caption: string }[]; galleryLayout?: 'grid' | 'horizontal' }) => void 
}) {
  const [isUploading, setIsUploading] = useState(false)
  
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setIsUploading(true)
    const url = await uploadImage(f)
    if (url) {
      onChange({ gallery: [...gallery, { url, caption: '' }] })
    } else {
      alert('Failed to upload image. Please ensure your Supabase credentials are correct.')
    }
    setIsUploading(false)
  }

  const move = (i: number, dir: number) => {
    const newG = [...gallery]
    const tmp = newG[i]
    newG[i] = newG[i + dir]
    newG[i + dir] = tmp
    onChange({ gallery: newG })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={label}>Gallery Layout:</span>
        <select 
          value={layout} 
          onChange={e => onChange({ galleryLayout: e.target.value as 'grid' | 'horizontal' })}
          style={{ ...inp, width: 'auto', padding: '6px 12px' }}
        >
          <option value="grid">Grid (Web UIs)</option>
          <option value="horizontal">Horizontal (App UIs)</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {gallery.map((g, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, border: `1px solid ${T.border}`, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} style={{ background: 'none', border: 'none', color: i === 0 ? 'rgba(255,255,255,0.15)' : T.muted, cursor: i === 0 ? 'default' : 'pointer', fontSize: 12, padding: 2 }}>▲</button>
              <button onClick={() => move(i, 1)} disabled={i === gallery.length - 1} style={{ background: 'none', border: 'none', color: i === gallery.length - 1 ? 'rgba(255,255,255,0.15)' : T.muted, cursor: i === gallery.length - 1 ? 'default' : 'pointer', fontSize: 12, padding: 2 }}>▼</button>
            </div>
            <img src={g.url} alt="Gallery item" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8, background: '#000' }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Inp value={g.caption} onChange={v => { const newG = [...gallery]; newG[i].caption = v; onChange({ gallery: newG }) }} placeholder="Image caption..." />
            </div>
            <Ghost onClick={() => { const newG = gallery.filter((_, j) => j !== i); onChange({ gallery: newG }) }}>×</Ghost>
          </div>
        ))}
      </div>

      <label style={{ ...label, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 8, cursor: isUploading ? 'not-allowed' : 'pointer', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: `1px dashed ${T.border}`, opacity: isUploading ? 0.5 : 1, justifyContent: 'center' }}>
        {isUploading ? '⏳ Uploading to Cloud...' : '📎 Add Gallery Image'}
        <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} disabled={isUploading} />
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

function QuickFillParser({ onResult }: { onResult: (data: Partial<Project>) => void }) {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')

  const handleParse = () => {
    if (!text.trim()) return

    const lines = text.split('\n').map(l => l.trim())
    const result: Partial<Project> = {}
    
    let currentProcess: ProjectProcessStep[] = []
    let currentOutcomes: { val: string; label: string }[] = []
    let currentStats: { val: string; label: string }[] = []
    
    const headers = [
      'slug', 'name', 'title', 'type', 'badge', 'featured',
      'role', 'year', 'timeline', 'tools',
      'category', 'category tag', 'cover image url', 'live url', 'behance url',
      'headline', 'hero summary', 'summary', 'one-liner',
      'problem', 'challenge', 'the problem',
      'research', 'process', 'decision notes',
      'outcome', 'outcomes', 'the outcome', 'results',
      'reflection', 'stats'
    ]
    
    let activeField: string | null = null

    const handleValue = (field: string, val: string, append = false) => {
      let key: keyof Project | null = null
      
      if (['name', 'title'].includes(field)) key = 'name'
      if (['type'].includes(field)) key = 'type'
      if (['slug', 'badge', 'role', 'category', 'research', 'reflection'].includes(field)) key = field as any
      if (['featured'].includes(field)) {
         result.featured = val.toLowerCase() === 'yes' || val.toLowerCase() === 'true'
         return
      }
      if (['year', 'timeline'].includes(field)) key = 'year'
      if (['category tag'].includes(field)) key = 'categoryTag'
      if (['cover image url'].includes(field)) key = 'coverImageUrl'
      if (['live url'].includes(field)) key = 'liveUrl'
      if (['behance url'].includes(field)) key = 'behanceUrl'
      if (['headline', 'hero summary', 'summary', 'one-liner'].includes(field)) key = 'headline'
      if (['problem', 'challenge', 'the problem'].includes(field)) key = 'problem'
      
      if (key) {
        if (append && result[key]) {
           (result as any)[key] += '\n' + val
        } else {
           (result as any)[key] = val
        }
      } else if (['tools'].includes(field)) {
        const cleaned = val.replace(/\[.*\]/, '').trim()
        if (append && result.tools) result.tools += ', ' + cleaned
        else result.tools = cleaned
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (!line) continue

      const colonIdx = line.indexOf(':')
      let handledAsInline = false
      
      if (colonIdx !== -1) {
        const potentialLabel = line.slice(0, colonIdx).trim().toLowerCase()
        if (headers.includes(potentialLabel)) {
          const val = line.slice(colonIdx + 1).trim()
          activeField = potentialLabel
          if (val) handleValue(activeField, val)
          handledAsInline = true
          continue
        }
      }

      if (!handledAsInline) {
        const cleanLine = line.replace(/\(.*\)/, '').trim().toLowerCase()
        if (headers.includes(cleanLine)) {
          activeField = cleanLine
          continue
        }

        if (['process', 'decision notes'].includes(activeField || '') || /^\d+\.\s+/.test(line)) {
          const processMatch = line.match(/^\d+\.\s+([^—-]+)[—-]+(.*)$/)
          if (processMatch) {
            currentProcess.push({ title: processMatch[1].trim(), body: processMatch[2].trim() })
            activeField = 'process'
            continue
          }
        }
        
        if (['outcome', 'outcomes', 'the outcome', 'results', 'stats'].includes(activeField || '')) {
           if (line.includes('|')) {
             const [val, label] = line.split('|').map(s => s.trim())
             if (['stats'].includes(activeField!)) {
                currentStats.push({ val, label })
             } else {
                currentOutcomes.push({ val, label })
             }
             continue
           }
        }

        if (activeField && !['process', 'outcome', 'outcomes', 'the outcome', 'results', 'stats'].includes(activeField)) {
          handleValue(activeField, line, true)
        }
      }
    }

    if (currentProcess.length > 0) result.process = currentProcess
    if (currentOutcomes.length > 0) result.outcomes = currentOutcomes
    if (currentStats.length > 0) result.stats = currentStats

    const filledCount = Object.keys(result).filter(k => {
      const v = (result as any)[k]
      return Array.isArray(v) ? v.length > 0 : !!v
    }).length

    let expectedFields: string[] = []
    const type = result.type || 'case-study'
    
    if (type === 'case-study') {
      expectedFields = ['name', 'slug', 'headline', 'role', 'year', 'problem', 'research', 'process', 'outcomes']
    } else if (type === 'landing-page') {
      expectedFields = ['name', 'slug', 'headline', 'role', 'year', 'liveUrl', 'process']
    } else if (type === 'ui') {
      expectedFields = ['name', 'slug', 'role', 'year', 'tools', 'headline']
    }

    const missing = expectedFields.filter(f => {
      const v = (result as any)[f]
      return Array.isArray(v) ? v.length === 0 : !v
    }).map(f => {
      if (f === 'process' && type === 'landing-page') return 'decision notes'
      if (f === 'headline' && type === 'ui') return 'one-liner'
      if (f === 'coverImageUrl') return 'cover image url'
      if (f === 'liveUrl') return 'live url'
      if (f === 'behanceUrl') return 'behance url'
      return f
    })
    
    setSummary(`✅ Filled ${filledCount} fields. Missing: ${missing.join(', ') || 'None'}`)
    onResult(result)
  }

  return (
    <div style={{ padding: 16, background: 'rgba(255, 128, 74, 0.05)', border: `1px solid ${T.accentBorder}`, borderRadius: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>⚡</span>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: T.accent }}>Quick Fill Parser</span>
      </div>
      <p style={{ margin: 0, fontSize: 12, color: T.muted }}>Paste project text to auto-fill. Supports repeating fields ("1. Title — body" for Process, "val | label" for Outcomes).</p>
      <Ta value={text} onChange={setText} rows={4} placeholder="Paste project text here..." />
      
      <button onClick={handleParse} disabled={!text} style={{ background: T.accent, color: T.bg, border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, fontFamily: 'Poppins,sans-serif', cursor: !text ? 'not-allowed' : 'pointer', alignSelf: 'flex-start', opacity: !text ? 0.5 : 1 }}>
        Parse & Fill Fields
      </button>
      
      {summary && <span style={{ color: T.success, fontSize: 13, marginTop: 4, fontFamily: 'Poppins,sans-serif' }}>{summary}</span>}
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

const SECTION_KEYS = ['problem', 'research', 'process', 'outcome', 'reflection'] as const

function ProjectsEditor() {
  const { data, setNested } = usePortfolio()
  const projects = data.projects
  const [active, setActive] = useState<number | null>(null)
  const [subTab, setSubTab] = useState<'meta' | 'content' | 'sections' | 'images'>('meta')

  const upd = (i: number, patch: Partial<Project>) => {
    const a = [...projects]; a[i] = { ...a[i], ...patch }; setNested('projects', a)
  }
  const updListItem = (i: number, key: 'stats' | 'outcomes', si: number, patch: Partial<ProjectStat>) => {
    const a = [...projects[i][key]]; a[si] = { ...a[si], ...patch }; upd(i, { [key]: a } as Partial<Project>)
  }
  const updStep = (i: number, si: number, patch: Partial<ProjectProcessStep>) => {
    const a = [...projects[i].process]; a[si] = { ...a[si], ...patch }; upd(i, { process: a })
  }
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= projects.length) return
    const a = [...projects]
    const tmp = a[i]; a[i] = a[j]; a[j] = tmp
    setNested('projects', a)
  }
  const changeType = (i: number, type: ProjectType) => upd(i, { type, sections: { ...DEFAULT_SECTIONS_BY_TYPE[type] } })

  if (active === null) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <SecHead title="Projects" sub="One list drives everything — Home's Featured Work and the Projects grid both read from here. Reorder, add, remove, or edit any project below." />
        {projects.map((p, i) => (
          <div key={p.slug} style={{ ...card, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} style={{ background: 'none', border: 'none', color: i === 0 ? 'rgba(255,255,255,0.15)' : T.muted, cursor: i === 0 ? 'default' : 'pointer', fontSize: 12, padding: 2 }}>▲</button>
              <button onClick={() => move(i, 1)} disabled={i === projects.length - 1} style={{ background: 'none', border: 'none', color: i === projects.length - 1 ? 'rgba(255,255,255,0.15)' : T.muted, cursor: i === projects.length - 1 ? 'default' : 'pointer', fontSize: 12, padding: 2 }}>▼</button>
            </div>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 16, color: T.text }}>{p.name || p.slug}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, fontFamily: 'Poppins,sans-serif', fontWeight: 600, color: T.accent, border: `1px solid ${T.accentBorder}`, borderRadius: 100, padding: '2px 10px' }}>{PROJECT_TYPE_LABELS[p.type]}</span>
                <span style={{ fontSize: 11, fontFamily: 'Poppins,sans-serif', fontWeight: 600, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 100, padding: '2px 10px' }}>{p.badge === 'client' ? 'Client' : 'Personal'}</span>
                {p.featured && <span style={{ fontSize: 11, fontFamily: 'Poppins,sans-serif', fontWeight: 600, color: T.success, border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '2px 10px' }}>Featured</span>}
              </div>
            </div>
            <Btn onClick={() => { setActive(i); setSubTab('meta') }}>Edit →</Btn>
          </div>
        ))}
        <Btn onClick={() => setNested('projects', [...projects, emptyProject(`new-project-${projects.length + 1}`)])}>+ Add Project</Btn>
      </div>
    )
  }

  const p = projects[active]
  const TABS = ['meta', 'content', 'sections', 'images'] as const

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: T.muted, fontFamily: 'Poppins,sans-serif', fontSize: 13, cursor: 'pointer' }}>← Back</button>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 18, color: T.text }}>{p.name || p.slug}</span>
        <Ghost onClick={() => { setNested('projects', projects.filter((_, j) => j !== active)); setActive(null) }}>Delete Project</Ghost>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <QuickFillParser onResult={d => upd(active, d)} />
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="URL slug (no spaces)"><Inp value={p.slug} onChange={v => upd(active, { slug: v })} /></Field>
              <Field label="Project name"><Inp value={p.name} onChange={v => upd(active, { name: v })} /></Field>
              <Field label="Type (picks template + card tag)">
                <select value={p.type} onChange={e => changeType(active, e.target.value as ProjectType)} style={inp}>
                  <option value="case-study">Case Study</option>
                  <option value="landing-page">Landing Page</option>
                  <option value="ui">UI Exploration</option>
                </select>
              </Field>
              <Field label="Badge (ownership label, card only)">
                <select value={p.badge} onChange={e => upd(active, { badge: e.target.value as ProjectBadge })} style={inp}>
                  <option value="personal">Personal</option>
                  <option value="client">Client</option>
                </select>
              </Field>
              <Field label="Role"><Inp value={p.role} onChange={v => upd(active, { role: v })} /></Field>
              <Field label="Year / timeline"><Inp value={p.year} onChange={v => upd(active, { year: v })} /></Field>
              <Field label="Tools (comma-separated)"><Inp value={p.tools} onChange={v => upd(active, { tools: v })} /></Field>
              <Field label="Category (eyebrow above headline)"><Inp value={p.category} onChange={v => upd(active, { category: v })} /></Field>
              <Field label="Category tag (short, meta row)"><Inp value={p.categoryTag} onChange={v => upd(active, { categoryTag: v })} /></Field>
              <Field label="Behance URL"><Inp value={p.behanceUrl} onChange={v => upd(active, { behanceUrl: v })} /></Field>
              <Field label="Live site URL (leave empty to hide button)"><Inp value={p.liveUrl} onChange={v => upd(active, { liveUrl: v })} /></Field>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={p.featured} onChange={e => upd(active, { featured: e.target.checked })} />
              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: T.text }}>Featured on Home page</span>
            </label>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {subTab === 'content' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={card}>
            <Field label="Headline"><Ta value={p.headline} onChange={v => upd(active, { headline: v })} rows={2} /></Field>
          </div>

          <div style={card}>
            <span style={label}>Hero Stats (small row, always visible regardless of section toggles)</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {p.stats.map((s, si) => (
                <div key={si} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, alignItems: 'end' }}>
                  <Field label="Value"><Inp value={s.val} onChange={v => updListItem(active, 'stats', si, { val: v })} /></Field>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Field label="Label"><Inp value={s.label} onChange={v => updListItem(active, 'stats', si, { label: v })} /></Field>
                    <Ghost onClick={() => upd(active, { stats: p.stats.filter((_, j) => j !== si) })}>×</Ghost>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}><Btn onClick={() => upd(active, { stats: [...p.stats, { val: '', label: '' }] })}>+ Stat</Btn></div>
          </div>

          <div style={card}>
            <Field label="Problem"><Ta value={p.problem} onChange={v => upd(active, { problem: v })} rows={4} /></Field>
          </div>

          <div style={card}>
            <Field label="Research"><Ta value={p.research} onChange={v => upd(active, { research: v })} rows={4} /></Field>
          </div>

          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={label}>Process Steps</span>
            {p.process.map((step, si) => (
              <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 14, borderBottom: `1px solid ${T.border}` }}>
                <div style={row}>
                  <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 14, color: T.accent, flex: 1 }}>Step {si + 1}</span>
                  <Ghost onClick={() => upd(active, { process: p.process.filter((_, j) => j !== si) })}>Remove</Ghost>
                </div>
                <Field label="Title"><Inp value={step.title} onChange={v => updStep(active, si, { title: v })} /></Field>
                <Field label="Body"><Ta value={step.body} onChange={v => updStep(active, si, { body: v })} rows={2} /></Field>
              </div>
            ))}
            <Btn onClick={() => upd(active, { process: [...p.process, { title: '', body: '' }] })}>+ Add Step</Btn>
          </div>

          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={label}>Outcomes</span>
            {p.outcomes.map((o, oi) => (
              <div key={oi} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, alignItems: 'end' }}>
                <Field label="Value"><Inp value={o.val} onChange={v => updListItem(active, 'outcomes', oi, { val: v })} /></Field>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Field label="Label"><Inp value={o.label} onChange={v => updListItem(active, 'outcomes', oi, { label: v })} /></Field>
                  <Ghost onClick={() => upd(active, { outcomes: p.outcomes.filter((_, j) => j !== oi) })}>×</Ghost>
                </div>
              </div>
            ))}
            <Btn onClick={() => upd(active, { outcomes: [...p.outcomes, { val: '', label: '' }] })}>+ Add Outcome</Btn>
          </div>

          <div style={card}>
            <Field label="Reflection"><Ta value={p.reflection} onChange={v => upd(active, { reflection: v })} rows={4} /></Field>
          </div>
        </div>
      )}

      {/* SECTIONS */}
      {subTab === 'sections' && (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: 0, fontSize: 13, color: T.muted, lineHeight: 1.6 }}>Toggle which sections render on this project's page. A section only shows if it's switched on here <em>and</em> has content filled in on the Content tab.</p>
          <Divider />
          {SECTION_KEYS.map(key => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={p.sections[key]} onChange={e => upd(active, { sections: { ...p.sections, [key]: e.target.checked } })} />
              <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 14, color: T.text, textTransform: 'capitalize' }}>{key}</span>
            </label>
          ))}
        </div>
      )}

      {/* IMAGES */}
      {subTab === 'images' && (
        <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <ImgField label="Cover image (card thumbnail + detail page hero)" value={p.coverImageUrl} onChange={v => upd(active, { coverImageUrl: v })} />
          <Divider />
          <ImgField label="Process / wireframes image (mid-page, optional)" value={p.processImageUrl} onChange={v => upd(active, { processImageUrl: v })} />
          <Divider />
          <SecHead title="High-Fidelity Gallery" sub="Add multiple screens here. Grid layout is great for Web UIs; Horizontal scroll is great for Mobile App UIs." />
          <GalleryManager 
            gallery={p.gallery} 
            layout={p.galleryLayout} 
            onChange={patch => upd(active, patch)} 
          />
        </div>
      )}
    </div>
  )
}

function pathLabel(path: string, projects: Project[]): string {
  if (path === '#/' || path === '') return 'Home'
  if (path === '#/about') return 'About'
  if (path === '#/projects') return 'Projects (grid)'
  if (path === '#/contact') return 'Contact'
  if (path === '#/admin') return 'Admin'
  const m = path.match(/^#\/project\/(.+)$/)
  if (m) {
    const proj = projects.find(p => p.slug === m[1])
    return proj ? `Project: ${proj.name || proj.slug}` : `Project: ${m[1]} (deleted)`
  }
  return path
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  return `${days}d ago`
}

function StatCard({ value, label, highlight }: { value: string | number; label: string; highlight?: boolean }) {
  return (
    <div style={{ ...card, flex: '1 1 160px', border: highlight ? `1px solid ${T.accentBorder}` : undefined, background: highlight ? T.accentFaint : undefined }}>
      <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 32, color: T.accent }}>{value}</div>
      <div style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: highlight ? T.accent : T.muted, marginTop: 4 }}>{label}</div>
    </div>
  )
}

type TimeRange = '24h' | '7d' | '30d' | 'all'

const TIME_RANGE_OPTIONS: { key: TimeRange; label: string }[] = [
  { key: '24h', label: 'Last 24h' },
  { key: '7d',  label: 'Last 7 days' },
  { key: '30d', label: 'Last 30 days' },
  { key: 'all', label: 'All time' },
]

function sinceFromRange(range: TimeRange): string | undefined {
  if (range === '24h') return hoursAgo(24)
  if (range === '7d')  return daysAgo(7)
  if (range === '30d') return daysAgo(30)
  return undefined
}

function AnalyticsPanel() {
  const { data } = usePortfolio()
  const [range, setRange] = useState<TimeRange>('24h')
  const [stats, setStats] = useState<VisitorStats | null>(null)
  const [paths, setPaths] = useState<PathViews[]>([])
  const [visitors, setVisitors] = useState<Visitor[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [timeline, setTimeline] = useState<{ path: string; viewed_at: string }[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)

  const load = (r: TimeRange = range) => {
    setLoading(true)
    setExpanded(null)
    const since = sinceFromRange(r)
    Promise.all([getVisitorStats(since), getMostViewedPaths(20, since), getRecentVisitors(50, since)]).then(([s, p, v]) => {
      setStats(s); setPaths(p); setVisitors(v); setLoading(false)
    })
  }

  useEffect(() => { load() }, [])

  const handleRangeChange = (r: TimeRange) => {
    setRange(r)
    load(r)
  }

  const toggleExpand = (sessionId: string) => {
    if (expanded === sessionId) { setExpanded(null); return }
    setExpanded(sessionId)
    setTimelineLoading(true)
    getVisitorPageViews(sessionId).then(t => { setTimeline(t); setTimelineLoading(false) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
        <SecHead title="Analytics" sub="Anonymous visit tracking — no names, no IP addresses, just an anonymous per-browser id so returning visitors can be recognized." />
        <Btn onClick={() => load(range)} style={{ marginLeft: 'auto', alignSelf: 'center' }}>↻ Refresh</Btn>
      </div>

      {/* Time range selector */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {TIME_RANGE_OPTIONS.map(opt => (
          <button
            key={opt.key}
            onClick={() => handleRangeChange(opt.key)}
            style={{
              padding: '6px 14px',
              borderRadius: 100,
              border: range === opt.key ? `1px solid ${T.accent}` : `1px solid ${T.border}`,
              background: range === opt.key ? T.accentFaint : 'transparent',
              color: range === opt.key ? T.accent : T.muted,
              fontFamily: 'Poppins,sans-serif',
              fontSize: 12,
              fontWeight: range === opt.key ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ ...card, color: T.muted, fontSize: 13 }}>Loading…</div>
      ) : !stats ? (
        <div style={{ ...card, color: T.muted, fontSize: 13, lineHeight: 1.6 }}>
          No data yet. Make sure you've run <code>supabase/analytics_schema.sql</code> in your Supabase project's SQL editor, and that Supabase env vars are set.
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <StatCard value={stats.totalVisitors} label={range === 'all' ? 'Unique visitors' : `Unique visitors (${TIME_RANGE_OPTIONS.find(o => o.key === range)?.label})`} />
            <StatCard value={stats.returningVisitors} label="Returning visitors" />
            {range === 'all' && <StatCard value={stats.last24h} label="Active last 24h" highlight />}
            <StatCard value={stats.newToday} label="New today" />
            <StatCard value={stats.totalVisits} label="Total visits" />
          </div>

          <SecHead title="Most Viewed" />
          <div style={{ ...card, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {paths.length === 0 && <span style={{ color: T.muted, fontSize: 13 }}>No page views recorded in this period.</span>}
            {paths.map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '6px 0', borderBottom: i < paths.length - 1 ? `1px solid ${T.border}` : 'none' }}>
                <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 13, color: T.text }}>{pathLabel(p.path, data.projects)}</span>
                <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 13, color: T.accent }}>{p.views}</span>
              </div>
            ))}
          </div>

          <SecHead title="Recent Visitors" sub="Click a visitor to see exactly what they looked at, in order." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visitors.length === 0 && <div style={{ ...card, color: T.muted, fontSize: 13 }}>No visitors in this period.</div>}
            {visitors.map(v => (
              <div key={v.session_id} style={card}>
                <div onClick={() => toggleExpand(v.session_id)} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: T.muted }}>{v.session_id.slice(0, 8)}…</span>
                  {v.visit_count > 1 && (
                    <span style={{ fontSize: 11, fontFamily: 'Poppins,sans-serif', fontWeight: 600, color: T.success, border: '1px solid rgba(34,197,94,0.3)', borderRadius: 100, padding: '2px 10px' }}>Returning · {v.visit_count} visits</span>
                  )}
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: T.muted }}>First seen {timeAgo(v.first_seen)}</span>
                  <span style={{ fontFamily: 'Poppins,sans-serif', fontSize: 12, color: T.muted }}>Last seen {timeAgo(v.last_seen)}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: T.accent }}>{expanded === v.session_id ? '▲ Hide' : '▼ What did they check?'}</span>
                </div>
                {expanded === v.session_id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {timelineLoading ? (
                      <span style={{ color: T.muted, fontSize: 13 }}>Loading…</span>
                    ) : timeline.length === 0 ? (
                      <span style={{ color: T.muted, fontSize: 13 }}>No page views recorded for this visitor.</span>
                    ) : (
                      timeline.map((t, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13 }}>
                          <span style={{ color: T.text }}>{i + 1}. {pathLabel(t.path, data.projects)}</span>
                          <span style={{ color: T.muted }}>{timeAgo(t.viewed_at)}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   SIDEBAR TABS CONFIG
───────────────────────────────────────────── */
type TabKey = 'navbar' | 'hero' | 'expertise' | 'projects' | 'testimonials' | 'faq' | 'footer' | 'about' | 'analytics'
const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'navbar',       label: 'Navbar',          icon: '⚓' },
  { key: 'hero',        label: 'Hero',             icon: '🏠' },
  { key: 'expertise',   label: 'Expertise',        icon: '🔧' },
  { key: 'projects',    label: 'Projects',         icon: '💼' },
  { key: 'testimonials',label: 'Testimonials',     icon: '💬' },
  { key: 'faq',         label: 'FAQ',              icon: '❓' },
  { key: 'footer',      label: 'Footer',           icon: '🔗' },
  { key: 'about',       label: 'About + Exp.',     icon: '👤' },
  { key: 'analytics',   label: 'Analytics',        icon: '📊' },
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, height: 60, background: T.surface, borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', padding: '0 12px', overflow: 'hidden' }} className="md:px-6">
        <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden" aria-label="Toggle menu" style={{ background: 'none', border: 'none', color: T.text, fontSize: 20, cursor: 'pointer', padding: '4px 8px', flexShrink: 0 }}>☰</button>
        <span style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: 15, color: T.text, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 4 }}>
          🎨 <span className="hidden md:inline">Portfolio Admin</span><span className="md:hidden">Admin</span>
        </span>
        <div className="hidden md:block" style={{ flex: 1 }} />
        <div style={{ flex: 1 }} className="md:hidden" />
        {/* Sync status & Push Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: syncColor, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: syncColor, display: 'inline-block', animation: syncStatus === 'saving' ? 'pulse 1s infinite' : 'none', flexShrink: 0 }} />
            <span className="hidden md:inline">{syncLabel}</span>
          </span>
          {syncStatus === 'unsaved' && (
            <button onClick={pushToCloud} style={{ background: T.accent, color: T.bg, border: 'none', padding: '6px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600, fontFamily: 'Poppins,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <span className="hidden md:inline">Push to Live Site</span><span className="md:hidden">Push</span>
            </button>
          )}
        </div>
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12, marginLeft: 12 }}>
          <Btn onClick={() => { window.location.hash = '' }} color="rgba(255,255,255,0.06)" textColor={T.text}>View Site →</Btn>
          <Btn onClick={() => { sessionStorage.removeItem('admin_v2'); setAuthed(false) }} color="rgba(239,68,68,0.15)" textColor={T.danger}>Log out</Btn>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', marginTop: 60, flex: 1 }}>
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div className="md:hidden" onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, top: 60, background: 'rgba(0,0,0,0.6)', zIndex: 90 }} />
        )}

        {/* Sidebar — off-canvas drawer on mobile, static column on desktop */}
        <aside className="md:!translate-x-0" style={{ width: 240, background: T.surface, borderRight: `1px solid ${T.border}`, position: 'fixed', top: 60, bottom: 0, left: 0, overflowY: 'auto', padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4, zIndex: 95, transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease' }}>
          <span style={{ fontFamily: 'Poppins,sans-serif', fontWeight: 600, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: T.muted, padding: '4px 12px', marginBottom: 8 }}>Sections</span>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSidebarOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: tab === t.key ? T.accentFaint : 'transparent', border: tab === t.key ? `1px solid ${T.accentBorder}` : '1px solid transparent', color: tab === t.key ? T.accent : T.muted, fontFamily: 'Poppins,sans-serif', fontWeight: tab === t.key ? 600 : 400, fontSize: 13, cursor: 'pointer', textAlign: 'left', width: '100%' }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
          {/* Mobile-only: actions that live in the header on desktop */}
          <div className="md:hidden" style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 16, marginTop: 8, borderTop: `1px solid ${T.border}` }}>
            <Btn onClick={() => { window.location.hash = '' }} color="rgba(255,255,255,0.06)" textColor={T.text}>View Site →</Btn>
            <Btn onClick={() => { sessionStorage.removeItem('admin_v2'); setAuthed(false) }} color="rgba(239,68,68,0.15)" textColor={T.danger}>Log out</Btn>
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
            <button onClick={() => { if (window.confirm('Reset ALL content to defaults?')) { reset() } }}
              style={{ background: 'none', border: 'none', color: T.danger, fontSize: 12, cursor: 'pointer', fontFamily: 'Poppins,sans-serif', padding: '8px 14px' }}>
              ⚠️ Reset to defaults
            </button>
          </div>
        </aside>

        {/* Main panel */}
        <main className="ml-0 md:ml-[240px] px-4 py-6 md:px-10 md:py-8" style={{ flex: 1, overflowY: 'auto', maxWidth: 900, boxSizing: 'border-box', width: '100%' }}>
          {tab === 'navbar'       && <NavbarEditor />}
          {tab === 'hero'        && <HeroEditor />}
          {tab === 'expertise'   && <ExpertiseEditor />}
          {tab === 'projects'    && <ProjectsEditor />}
          {tab === 'testimonials' && <TestimonialsEditor />}
          {tab === 'faq'         && <FAQEditor />}
          {tab === 'footer'      && <FooterEditor />}
          {tab === 'about'       && <AboutEditor />}
          {tab === 'analytics'   && <AnalyticsPanel />}
        </main>
      </div>
    </div>
  )
}
