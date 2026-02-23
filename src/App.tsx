import { useEffect, useMemo, useState } from 'react'
import './App.css'

type Theme = 'light' | 'dark'
type PillarKey = 'robotics' | 'ai' | 'systems'
type PillarIconKey = 'heart' | 'brain' | 'network'

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
  supports: string
  impact: string
  thumbnail: string
  caseStudyUrl: string
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
    subtitle: 'Longitudinal in-home robotic support for chronic pain management.',
    supports: 'People with quadriplegia, ALS, and long-term wheelchair users',
    impact: '1+ year deployment (12+ hrs/day) with reduced pain and caregiver burden',
    thumbnail: '/project-thumbs/flowguard.svg',
    caseStudyUrl: '/case-studies/flowguard.html',
  },
  {
    id: 'disability-accommodation-advocacy-llm',
    pillar: 'ai',
    title: 'Disability Accommodation Advocacy LLM',
    subtitle: 'Human-centered AI assistant for accommodation request drafting.',
    supports: 'Students with disabilities navigating accommodation systems',
    impact: 'Prototype reduced cognitive and emotional load in advocacy drafting',
    thumbnail: '/project-thumbs/accommodation-llm.svg',
    caseStudyUrl: '/case-studies/accommodation-llm.html',
  },
  {
    id: 'carmen-cognitively-assistive-robot',
    pillar: 'robotics',
    title: 'CARMEN: Assistive Robot for Neurorehabilitation',
    subtitle: 'Home-oriented robot concepts for motivation and cognitive support.',
    supports: 'People with mild cognitive impairment, caregivers, and neuropsychologists',
    impact: 'Conference paper introducing design patterns for home assistive robots',
    thumbnail: '/project-thumbs/carmen.svg',
    caseStudyUrl: '/case-studies/carmen.html',
  },
  {
    id: 'artists-vs-ai-creator-protection',
    pillar: 'ai',
    title: 'Artists vs AI: Creator Protection & Transparency',
    subtitle: 'Trust and fairness research for small creators in AI-mediated platforms.',
    supports: 'Small Instagram artists (<10K followers)',
    impact: 'Framework from 202 synthesis notes guiding transparency-focused design',
    thumbnail: '/project-thumbs/artists-vs-ai.svg',
    caseStudyUrl: '/case-studies/artists-vs-ai.html',
  },
  {
    id: 'us-healthcare-access-map',
    pillar: 'systems',
    title: 'How Accessing U.S. Healthcare Works: Interactive Systems Map',
    subtitle: 'Systems visualization for navigating healthcare access complexity.',
    supports: 'Patients, caregivers, and healthcare ecosystem stakeholders',
    impact: 'Interactive tool that accelerates understanding of healthcare access pathways',
    thumbnail: '/project-thumbs/healthcare-map.svg',
    caseStudyUrl: '/case-studies/healthcare-map.html',
  },
]

function App() {
  const [theme, setTheme] = useState<Theme>('light')
  const [isNavOpen, setIsNavOpen] = useState(false)

  useEffect(() => {
    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme)
        return
      }
    } catch {
      // Fallback to system theme when storage is unavailable.
    }

    const prefersDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setTheme(prefersDark ? 'dark' : 'light')
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Ignore storage write errors in restricted contexts.
    }
  }, [theme])

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
      const reduceMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
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
              <div className="hero-copy">
                <p className="hero-greeting">Hello,</p>
                <h1 id="hero-title">I&apos;m Soyon Kim,</h1>
                <p className="hero-titleline">Human-centered UX Design Researcher</p>
                <p className="hero-subline">
                  My goal is to build trustworthy, responsible systems that support human wellbeing and agency.
                </p>
                <p className="hero-rings">
                  Human-Centered · Real-World Deployment · Responsible Systems · Healthtech
                </p>
                <div className="hero-actions">
                  <a className="hero-btn hero-btn-secondary" href="/artifacts/SoyonKim_Resume.txt" download>
                    Download Resume
                  </a>
                </div>
              </div>
              <div className="hero-portrait">
                <img src="/soyon-portrait.png" alt="Portrait of Soyon Kim" loading="eager" decoding="async" />
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
                    </div>
                    <span className="pillar-description">{pillar.description}</span>
                    <span className="pillar-explore" aria-hidden="true">
                      Explore →
                    </span>
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
                  <h2 id={`pillar-heading-${pillar.key}`}>{pillar.title}</h2>
                </header>
                <p className="pillar-intro">{pillar.description}</p>

                <div className="project-grid" role="list" aria-label={`${pillar.title} projects`}>
                  {items.map((project) => (
                    <article key={project.id} className="project-card" role="listitem">
                      <img
                        className="project-thumb"
                        src={project.thumbnail}
                        alt={`${project.title} thumbnail preview`}
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={360}
                      />

                      <h3>{project.title}</h3>
                      <p className="project-subtitle">{project.subtitle}</p>

                      <p className="meta-line">
                        <strong>Supports:</strong> {project.supports}
                      </p>
                      <p className="meta-line meta-impact">
                        <strong>Impact:</strong> {project.impact}
                      </p>

                      <div className="project-links">
                        <a className="card-link card-link-secondary" href={project.caseStudyUrl}>
                          Case Study <span aria-hidden="true">↗</span>
                        </a>
                      </div>
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
              For opportunities, collaboration, or project questions, reach out directly by email or through my
              professional profiles.
            </p>

            <ul className="social-list" aria-label="Social links">
              <li>
                <a href="https://www.linkedin.com/in/soyon-kim/" target="_blank" rel="noreferrer noopener">
                  <SocialIcon type="linkedin" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/soyoybean" target="_blank" rel="noreferrer noopener">
                  <SocialIcon type="github" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="mailto:soyonkim00@gmail.com">
                  <SocialIcon type="gmail" />
                  soyonkim00@gmail.com
                </a>
              </li>
            </ul>

            <p className="domain-note">Production-ready deployment with custom domain support.</p>
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

type SocialIconProps = {
  type: 'linkedin' | 'github' | 'gmail'
}

function SocialIcon({ type }: SocialIconProps) {
  if (type === 'linkedin') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 9v8M7 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11 17V9h3v1.6c.5-1 1.5-1.8 3-1.8 2.3 0 3 1.6 3 3.8V17" />
      </svg>
    )
  }

  if (type === 'github') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 18c-4 .8-4-2-6-2m12 4v-3.1a2.7 2.7 0 0 0-.8-2.1c2.6-.3 5.3-1.3 5.3-6a4.7 4.7 0 0 0-1.3-3.3 4.4 4.4 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.8 11.8 0 0 0-6.2 0C6 2 5 2.3 5 2.3a4.4 4.4 0 0 0-.1 3.2A4.7 4.7 0 0 0 3.6 8.8c0 4.7 2.7 5.7 5.3 6a2.7 2.7 0 0 0-.8 2.1V20" />
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
