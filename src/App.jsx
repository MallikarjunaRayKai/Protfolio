import { useEffect, useRef, useState } from 'react'
import './App.css'
import ChatWidget from './ChatWidget'

const NAV_ITEMS = [
  { id: 'about',      label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills',     label: 'Skills' },
  { id: 'contact',    label: 'Contact' },
]

const NAV_OFFSET = 84

function smoothScrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET
  window.scrollTo({ top, behavior: 'smooth' })
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + NAV_OFFSET + 4
      let current = ids[0]
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) current = id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ids.join(',')])
  return active
}

function handleNavClick(e, id, onAfter) {
  e.preventDefault()
  smoothScrollTo(id)
  if (history.replaceState) history.replaceState(null, '', `#${id}`)
  if (onAfter) onAfter()
}

function Nav() {
  const active = useActiveSection(NAV_ITEMS.map((n) => n.id))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [open])

  return (
    <nav className="topnav">
      <a
        href="#top"
        className="brand"
        onClick={(e) => {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
          setOpen(false)
        }}
      >
        <span className="brand-dot" /> MB.
      </a>

      <ul className="navlinks">
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={active === item.id ? 'active' : ''}
              onClick={(e) => handleNavClick(e, item.id)}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        className={`hamburger ${open ? 'open' : ''}`}
        aria-label="Toggle menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span /><span /><span />
      </button>

      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={active === item.id ? 'active' : ''}
            onClick={(e) => handleNavClick(e, item.id, () => setOpen(false))}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

const SKILL_GROUPS = [
  { label: 'Backend',    icons: 'python,fastapi,java,spring,nodejs,nestjs,go' },
  { label: 'Frontend',   icons: 'react,vite,nextjs,ts,js,html,css' },
  { label: 'Database',   icons: 'postgres,mongodb,redis' },
  { label: 'Cloud',      icons: 'aws,azure' },
  { label: 'DevOps',     icons: 'kubernetes,docker,jenkins,gitlab,git,bash,linux' },
  { label: 'AI / Tools', icons: 'openai,vscode,postman,nginx' },
]

const EXPERIENCE = [
  {
    role: 'Software Engineer — Full Stack & DevOps',
    company: 'Ominaya Technologies Pvt Ltd',
    period: 'Feb 2023 – Present',
    bullets: [
      'Build and ship backend services across Python (FastAPI), Java (Spring Boot), Node.js (NestJS), and Go.',
      'Develop frontends with React, Vite, and Next.js — from product UIs to internal dashboards.',
      'Own cloud infrastructure end-to-end: provisioning, deployments, utilization, and cost across AWS / Azure / Modal.',
      'Maintain CI/CD pipelines with Jenkins, ArgoCD, and GitLab; orchestrate workloads on Kubernetes.',
      'Integrate AI capabilities using OpenAI API, Claude, and OCR pipelines into production systems.',
    ],
  },
]

const LINKS = {
  email: 'mallikarjunabankoli@gmail.com',
  github: 'https://github.com/MallikarjunaRayKai',
  site: 'https://mallikarjunabankoli.com',
}

function yearsSince(date) {
  return ((Date.now() - new Date(date)) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
}

function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        obs.disconnect()
      }
    }, options)
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

export default function App() {
  const years = yearsSince('2023-02-01')

  return (
    <>
      <Nav />

      <main className="page" id="top">
        <section className="profile">
          <div className="profile-glow" aria-hidden="true" />
          <div className="profile-card">
            <div className="avatar-wrap">
              <div className="avatar-ring" aria-hidden="true" />
              <div className="avatar">
                {/* Swap src for a real photo when you have one (e.g. /avatar.jpg) */}
                <img
                  src="https://api.dicebear.com/7.x/personas/svg?seed=MallikarjunaDev&backgroundColor=transparent&hair=shortHair&skinColor=e5a07e&body=squared"
                  alt="Mallikarjuna avatar"
                />
              </div>
              <span className="float-sym sym-1" aria-hidden="true">{'</>'}</span>
              <span className="float-sym sym-2" aria-hidden="true">{'{ }'}</span>
              <span className="float-sym sym-3" aria-hidden="true">✦</span>
              <span className="float-sym sym-4" aria-hidden="true">⚡</span>
            </div>
            <div className="profile-info">
              <h1>Mallikarjuna Bankoli</h1>
              <p className="handle">@MallikarjunaRayKai</p>
              <p className="bio">
                Software Engineer · Full Stack &amp; DevOps. I build backends and
                frontends, ship to the cloud, and keep things running.
              </p>
              <ul className="meta">
                <li>📍 India</li>
                <li>💼 Ominaya Technologies</li>
                <li>⏳ {years} yrs experience</li>
              </ul>
              <div className="actions">
                <a className="btn primary" href={`mailto:${LINKS.email}`}>Email me</a>
                <a className="btn" href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>
                <a className="btn" href={LINKS.site} target="_blank" rel="noreferrer">Website</a>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <Reveal as="h2" className="section-title">About</Reveal>
          <Reveal delay={80}>
            <p className="lead">
              Full-stack engineer at a startup, wearing two hats: developer and DevOps.
              On the backend I work with Python (FastAPI), Java (Spring Boot), Node.js (NestJS),
              and Go. On the frontend I build with React, Vite, and Next.js. I also own
              deployment, cloud subscriptions, utilization, and ongoing maintenance.
              I pick up new languages quickly and care about shipping reliable, observable software.
            </p>
          </Reveal>
        </section>

        <section id="experience" className="section">
          <Reveal as="h2" className="section-title">Experience</Reveal>
          <div className="timeline">
            {EXPERIENCE.map((job, i) => (
              <Reveal key={i} delay={i * 100} className="tl-item">
                <div className="tl-dot" />
                <div className="tl-card">
                  <div className="tl-head">
                    <strong>{job.role}</strong>
                    <span className="muted">{job.period}</span>
                  </div>
                  <p className="company">{job.company}</p>
                  <ul>
                    {job.bullets.map((b) => <li key={b}>{b}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="skills" className="section">
          <Reveal as="h2" className="section-title">Skills</Reveal>
          <div className="skills">
            {SKILL_GROUPS.map((g, i) => (
              <Reveal key={g.label} delay={i * 60} className="skill-row">
                <div className="skill-label">{g.label}</div>
                <img
                  src={`https://skillicons.dev/icons?i=${g.icons}&theme=dark`}
                  alt={`${g.label} icons`}
                  loading="lazy"
                />
              </Reveal>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact">
          <Reveal as="h2" className="section-title">Get in touch</Reveal>
          <Reveal delay={80}>
            <p className="lead">
              Got a question, a project idea, or want to collaborate?
              Drop a message via the chat bubble — or email me directly.
            </p>
          </Reveal>
          <Reveal delay={160}>
            <div className="actions center">
              <a className="btn primary" href={`mailto:${LINKS.email}`}>{LINKS.email}</a>
            </div>
          </Reveal>
        </section>

        <footer>
          <p className="muted">© {new Date().getFullYear()} Mallikarjuna Bankoli · Built with React + Vite</p>
        </footer>
      </main>

      <ChatWidget />
    </>
  )
}
