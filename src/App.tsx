import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

type Theme = 'light' | 'dark'
type PillarKey = 'robotics' | 'ai' | 'systems'
type PillarIconKey = 'heart' | 'brain' | 'network'

type MetaItem = {
  label: 'Supports' | 'My Role' | 'My Contribution' | 'Outcome & Impact'
  value: string
}

type Pillar = {
  key: PillarKey
  icon: PillarIconKey
  title: string
  description: string
}

type Project = {
  id: string
  pillar: PillarKey
  title: string
  subtitle: string
  meta: MetaItem[]
}

const THEME_STORAGE_KEY = 'portfolio-theme'

const pillars: Pillar[] = [
  {
    key: 'robotics',
    icon: 'heart',
    title: 'Assistive Care Robotics',
    description:
      'Designing human-robot interaction that supports dignity, agency, and wellbeing',
  },
  {
    key: 'ai',
    icon: 'brain',
    title: 'Responsible & Trustworthy AI',
    description: 'Investigating trust, fairness, and accountability in AI systems',
  },
  {
    key: 'systems',
    icon: 'network',
    title: 'Systems Thinking & Communication',
    description:
      'Building accessible tools and practices that center marginalized voices',
  },
]

const projects: Project[] = [
  {
    id: 'flowguard-pain-relief-robotic-system',
    pillar: 'robotics',
    title: 'FlowGuard: Pain Relief Robotic System',
    subtitle:
      'Long-term assistive robotics for daily pain relief in at-home wheelchair use',
    meta: [
      {
        label: 'Supports',
        value:
          'People with quadriplegia, ALS, and other long-term wheelchair users',
      },
      {
        label: 'My Role',
        value: 'UX Research Lead · Product Designer · Hardware Engineer',
      },
      {
        label: 'My Contribution',
        value: 'At-Home Interviews · Co-Design · Longitudinal User Testing',
      },
      {
        label: 'Outcome & Impact',
        value:
          '1+ Year In-Situ Deployment (12+ hrs/day) with reduced daily pain & caregiver burden',
      },
    ],
  },
  {
    id: 'disability-accommodation-advocacy-llm',
    pillar: 'ai',
    title: 'Disability Accommodation Advocacy LLM',
    subtitle:
      'A human-centered AI support workflow for accommodation request drafting',
    meta: [
      {
        label: 'Supports',
        value: 'Students with disabilities navigating accommodation systems',
      },
      {
        label: 'My Role',
        value: 'UX Researcher · Human-Centered AI Designer',
      },
      {
        label: 'My Contribution',
        value: 'Usability Testing · Think-Aloud Protocols · Iterative Design',
      },
      {
        label: 'Outcome & Impact',
        value:
          'Functional prototype with user evaluation, showing reduced cognitive & emotional load in drafting advocacy requests',
      },
    ],
  },
  {
    id: 'carmen-cognitively-assistive-robot',
    pillar: 'robotics',
    title: 'CARMEN — Cognitively Assistive Robot for Motivation & Neurorehabilitation',
    subtitle:
      'Design patterns for home-based assistive robotics in cognitive support settings',
    meta: [
      {
        label: 'Supports',
        value:
          'People with Mild Cognitive Impairment (PwMCI), caregivers, and neuropsychologists',
      },
      {
        label: 'My Role',
        value: 'UX Designer · HRI Researcher',
      },
      {
        label: 'My Contribution',
        value: 'Literature Review · Human-Centered Design · Concept Evaluation',
      },
      {
        label: 'Outcome & Impact',
        value:
          'Conference Paper outlining design patterns for home-based assistive robots',
      },
    ],
  },
  {
    id: 'artists-vs-ai-creator-protection',
    pillar: 'ai',
    title: 'Artists vs AI: Creator Protection & AI Transparency Research',
    subtitle:
      'Transparency and protection research for creators in algorithmic content ecosystems',
    meta: [
      { label: 'Supports', value: 'Small Instagram artists (<10K followers)' },
      { label: 'My Role', value: 'UX Researcher' },
      {
        label: 'My Contribution',
        value: 'Contextual Interviews · Affinity Clustering · Cultural Modeling',
      },
      {
        label: 'Outcome & Impact',
        value:
          'Research report & design framework around 202 synthesized interpretation notes & design directions',
      },
    ],
  },
  {
    id: 'us-healthcare-access-map',
    pillar: 'systems',
    title: 'How Accessing U.S. Healthcare Works — Interactive Systemic Map',
    subtitle:
      'An interactive map that clarifies access pathways across complex healthcare systems',
    meta: [
      {
        label: 'Supports',
        value:
          'Patients, caregivers, and stakeholders navigating complex healthcare access systems',
      },
      { label: 'My Role', value: 'Systems Designer · UX Researcher' },
      {
        label: 'My Contribution',
        value: 'Systems Mapping · Information Design · Research Synthesis',
      },
      {
        label: 'Outcome & Impact',
        value:
          'Interactive visualization tool that streamlines learning and building of complex healthcare ecosystems',
      },
    ],
  },
]

function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [isNavOpen, setIsNavOpen] = useState(false)
  const heroBlurbRef = useRef<HTMLDivElement | null>(null)
  const [heroBlurbHeight, setHeroBlurbHeight] = useState<number | null>(null)

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme)
      return
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const blurb = heroBlurbRef.current
    if (!blurb) return

    const updateHeight = () => {
      setHeroBlurbHeight(Math.round(blurb.getBoundingClientRect().height))
    }

    updateHeight()

    const observer = new ResizeObserver(() => updateHeight())
    observer.observe(blurb)
    window.addEventListener('resize', updateHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setIsNavOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const projectsByPillar = useMemo(
    () =>
      pillars
        .map((pillar) => ({
          pillar,
          items: projects.filter((project) => project.pillar === pillar.key),
        }))
        .filter((group) => group.items.length > 0),
    [],
  )

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const toggleNav = () => {
    setIsNavOpen((current) => !current)
  }

  const closeNav = () => {
    setIsNavOpen(false)
  }

  const scrollToSection = (id: string) => {
    closeNav()
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const themeLabel = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'

  return (
    <div className="page-shell" id="top">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="container nav-layout">
          <a className="brand" href="#top" aria-label="Return to Home">
            <img src="/egg_icon.png" alt="Fried egg icon" />
            <span>Soyon Kim</span>
          </a>

          <div className="nav-controls">
            <nav
              id="primary-navigation"
              className={`primary-nav ${isNavOpen ? 'is-open' : ''}`}
              aria-label="Primary"
            >
              <a href="#top" onClick={closeNav}>
                Home
              </a>
              <a href="#work" onClick={closeNav}>
                Work
              </a>
              <a href="#about" onClick={closeNav}>
                About
              </a>
              <a href="#contact" onClick={closeNav}>
                Contact
              </a>
            </nav>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={themeLabel}
              title={themeLabel}
            >
              <img
                src={theme === 'light' ? '/icons/sun-placeholder.svg' : '/icons/moon-placeholder.svg'}
                alt=""
                aria-hidden="true"
              />
              <span className="sr-only">{themeLabel}</span>
            </button>
            <button
              type="button"
              className="nav-toggle"
              aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
              aria-controls="primary-navigation"
              aria-expanded={isNavOpen}
              onClick={toggleNav}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <section id="home" className="section hero" aria-labelledby="hero-title">
          <div className="hero-stage">
            <div className="container hero-layout">
              <div className="hero-copy" ref={heroBlurbRef}>
                <p className="hero-greeting">Hello,</p>
                <h1 id="hero-title">I&apos;m Soyon Kim,</h1>
                <h2>A human-centered UX Design Researcher</h2>
                <p className="hero-subline">
                  Designing trustworthy, responsible systems
                  <br />
                  that support wellbeing and human agency.
                </p>
              </div>
              <div
                className="hero-portrait"
                style={heroBlurbHeight ? { height: `${heroBlurbHeight}px` } : undefined}
              >
                <img
                  src="/soyon-portrait.png"
                  alt="Portrait of Soyon Kim"
                />
              </div>
            </div>

            <div className="container pillar-cta-block">
              <p className="pillar-lead">See how I achieve impact:</p>
              <div className="pillar-cta-grid" aria-label="Research pillars">
                {pillars.map((pillar) => (
                  <button
                    key={pillar.key}
                    type="button"
                    className="pillar-cta"
                    onClick={() => scrollToSection(`pillar-${pillar.key}`)}
                    aria-controls={`pillar-${pillar.key}`}
                  >
                    <div className="pillar-heading-row">
                      <span className="pillar-icon-circle">
                        <PillarIcon icon={pillar.icon} />
                      </span>
                      <span className="pillar-title">{pillar.title}</span>
                      <span className="pillar-arrow" aria-hidden="true">
                        →
                      </span>
                    </div>
                    <span className="pillar-description">{pillar.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section work" aria-label="Projects by research pillar">
          <div className="container">
            {projectsByPillar.map(({ pillar, items }) => (
              <section
                key={pillar.key}
                id={`pillar-${pillar.key}`}
                className="pillar-section"
                aria-labelledby={`pillar-heading-${pillar.key}`}
              >
                <header className="pillar-header">
                  <span className="pillar-header-icon" aria-hidden="true">
                    <PillarIcon icon={pillar.icon} />
                  </span>
                  <h3 id={`pillar-heading-${pillar.key}`}>{pillar.title}</h3>
                </header>
                <p className="pillar-intro">{pillar.description}</p>

                <div className="project-grid" role="list" aria-label={`${pillar.title} projects`}>
                  {items.map((project) => (
                    <article key={project.id} className="project-card" role="listitem">
                      <h4>{project.title}</h4>
                      <p className="project-subtitle">{project.subtitle}</p>

                      <div className="meta-divider" aria-hidden="true" />

                      <ul className="meta-list" aria-label={`Project details for ${project.title}`}>
                        {project.meta.map((item) => (
                          <li key={item.label}>
                            <MetaIcon label={item.label} />
                            <span>
                              <strong>{item.label}:</strong> {item.value}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <a className="card-link" href="#contact">
                        Read case study <span aria-hidden="true">→</span>
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section id="about" className="anchor-only" aria-hidden="true" />

        <section id="contact" className="section contact" aria-labelledby="contact-title">
          <div className="container contact-layout">
            <h2 id="contact-title">Contact</h2>
            <p>
              For any questions, thoughts, or feedback, feel free to reach out via any of the following:
            </p>

            <ul className="social-list" aria-label="Social links">
              <li>
                <a href="https://www.linkedin.com/in/soyon-kim/" target="_blank" rel="noreferrer noopener">
                  <SocialIcon type="linkedin" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://x.com/soyoybean" target="_blank" rel="noreferrer noopener">
                  <SocialIcon type="x" />
                  X
                </a>
              </li>
              <li>
                <a href="mailto:soyonkim00@gmail.com">
                  <SocialIcon type="gmail" />
                  Gmail
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

type PillarIconProps = {
  icon: PillarIconKey
}

function PillarIcon({ icon }: PillarIconProps) {
  if (icon === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20s-7-4.8-7-10a4.1 4.1 0 0 1 7-2.8A4.1 4.1 0 0 1 19 10c0 5.2-7 10-7 10Z" />
      </svg>
    )
  }

  if (icon === 'brain') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 4.5a3 3 0 0 0-4.6 2.6A3 3 0 0 0 5 13a3 3 0 0 0 3 5h2M15 4.5a3 3 0 0 1 4.6 2.6A3 3 0 0 1 19 13a3 3 0 0 1-3 5h-2" />
        <path d="M12 4v16M9.4 8.2c1.1.1 1.8.7 2.6 1.8M14.6 8.2c-1.1.1-1.8.7-2.6 1.8M9.6 14.6c1 .1 1.7.6 2.4 1.6M14.4 14.6c-1 .1-1.7.6-2.4 1.6" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="10" y="3" width="4" height="4" rx="1" />
      <rect x="4" y="15" width="4" height="4" rx="1" />
      <rect x="16" y="15" width="4" height="4" rx="1" />
      <path d="M12 7v4M6 15v-2h12v2" />
    </svg>
  )
}

type MetaIconProps = {
  label: MetaItem['label']
}

function MetaIcon({ label }: MetaIconProps) {
  const props = {
    'aria-hidden': true,
    viewBox: '0 0 24 24',
  }

  if (label === 'Supports') {
    return (
      <svg {...props}>
        <circle cx="8" cy="9" r="3" />
        <circle cx="16" cy="9" r="3" />
        <path d="M3 19c1.7-2.8 4.2-4.2 7-4.2S15.3 16.2 17 19M12 19c1.1-1.9 2.8-3 5-3.3" />
      </svg>
    )
  }

  if (label === 'My Role') {
    return (
      <svg {...props}>
        <rect x="4" y="7" width="16" height="13" rx="2" />
        <path d="M9 7V5h6v2" />
      </svg>
    )
  }

  if (label === 'My Contribution') {
    return (
      <svg {...props}>
        <path d="M9 3h6M10 3v5l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 17l-5-9V3" />
      </svg>
    )
  }

  return (
    <svg {...props}>
      <path d="M4 16.5 9 11l4 4 7-7" />
      <path d="M20 12v-4h-4" />
    </svg>
  )
}

type SocialIconProps = {
  type: 'linkedin' | 'x' | 'gmail'
}

function SocialIcon({ type }: SocialIconProps) {
  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 9v8M7 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11 17V9h3v1.6c.5-1 1.5-1.8 3-1.8 2.3 0 3 1.6 3 3.8V17" />
      </svg>
    )
  }

  if (type === 'x') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h4.6l3.2 4.8L15.8 4H20l-6 7.1L20.4 20h-4.6l-3.7-5.4L7.3 20H3l6.6-7.8L4 4Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export default App
