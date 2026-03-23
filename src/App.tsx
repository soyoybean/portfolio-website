import { useEffect, useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
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
  thumbnailPosition?: string
  caseStudyUrl: string
}

type NavKey = 'home' | 'work' | 'about' | 'contact'

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
    title: 'Systems Thinking & Modeling',
    description:
      'Building accessible tools and practices that center marginalized voices',
  },
]

const projects: Project[] = [
  {
    id: 'flowguard-pain-relief-robotic-system',
    pillar: 'robotics',
    title: 'FlowGuard: Pain Relief Robotic System',
    subtitle: '**Assistive robotic system for chronic pain relief in long-term wheelchair users**',
    supports: 'Long-term wheelchair users with chronic pain and the caregivers supporting them',
    impact:
      'Deployed in real-world use **12+ hours daily for 1+ year**, reducing both pain and caregiver burden through co-designed, low-effort interaction.',
    thumbnail: '/case-studies/FlowGuard_hero.png',
    caseStudyUrl: '/case-studies/flowguard.html',
  },
  {
    id: 'disability-accommodation-advocacy-llm',
    pillar: 'ai',
    title: 'Disability Accommodation Advocacy LLM',
    subtitle: '**AI system supporting students in navigating disability accommodation requests**',
    supports: 'Students with disabilities navigating accommodation systems',
    impact: 'Reduced writing burden while revealing critical tensions around trust, over-disclosure, and user control in high-stakes communication.',
    thumbnail: '/case-studies/DisabilityLLM_1.png',
    caseStudyUrl: '/case-studies/accommodation-llm.html',
  },
  {
    id: 'carmen-cognitively-assistive-robot',
    pillar: 'robotics',
    title: 'CARMEN: Assistive Robot for Neurorehabilitation',
    subtitle: '**Cognitively assistive robot for home-based neurorehabilitation and motivation**',
    supports: 'People with mild cognitive impairment, caregivers, and neuropsychologists',
    impact: 'Translated clinical interventions into robot interaction design, enabling collaborative goal-setting, personalization, and sustained engagement in real-world care.',
    thumbnail: '/case-studies/CARMEN_1.png',
    thumbnailPosition: 'center bottom',
    caseStudyUrl: '/case-studies/carmen.html',
  },
  {
    id: 'artists-vs-ai-creator-protection',
    pillar: 'ai',
    title: 'Artists vs AI: Creator Protection & Transparency',
    subtitle: '**Research on creator trust, ownership, and platform responsibility in generative AI**',
    supports: 'Small Instagram artists (<10K followers)',
    impact: 'Identified how lack of transparency and consent drives mistrust, informing platform-level design for ethical AI and creator protection.',
    thumbnail: '/case-studies/ArtistsVsAI.png',
    caseStudyUrl: '/case-studies/artists-vs-ai.html',
  },
  {
    id: 'us-healthcare-access-map',
    pillar: 'systems',
    title: 'How Accessing U.S. Healthcare Works: Interactive Systems Map',
    subtitle: '**Interactive system mapping of U.S. healthcare access across stakeholders and barriers**',
    supports: 'Patients, caregivers, and healthcare ecosystem stakeholders',
    impact: 'Reveals how decisions propagate through the system, redistributing burden onto patients and caregivers and reframing access as a systems problem.',
    thumbnail: '/case-studies/HealthcareAccess.png',
    caseStudyUrl: '/case-studies/healthcare-map.html',
  },
]

function renderBoldMarkedText(text: string) {
  const segments = text.split(/(\*\*.*?\*\*)/g).filter(Boolean)

  return segments.map((segment, index) => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      return <strong key={`${segment}-${index}`}>{segment.slice(2, -2)}</strong>
    }

    return <span key={`${segment}-${index}`}>{segment}</span>
  })
}

function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    try {
      const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme
      }
    } catch {
      // Fallback to system theme when storage is unavailable.
    }

    const prefersDark =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    return prefersDark ? 'dark' : 'light'
  })
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<NavKey>('home')
  const [selectedPillar, setSelectedPillar] = useState<PillarKey>('robotics')
  const [showAllPillars, setShowAllPillars] = useState(false)
  const [selectedProjectByPillar, setSelectedProjectByPillar] = useState<Record<PillarKey, string>>(() =>
    pillars.reduce(
      (map, pillar) => {
        const firstProjectId = projects.find((project) => project.pillar === pillar.key)?.id ?? ''
        map[pillar.key] = firstProjectId
        return map
      },
      {} as Record<PillarKey, string>,
    ),
  )

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

  useEffect(() => {
    const resolveHashTarget = (hash: string) => {
      const rawId = hash.replace(/^#/, '')
      const aliasMap: Record<string, string> = {
        work: 'impact-anchor',
        about: 'about-home-title',
        contact: 'contact-home-title',
      }

      return aliasMap[rawId] ?? rawId
    }

    const scrollToHashTarget = () => {
      if (!window.location.hash || window.location.hash === '#top') {
        return false
      }

      const targetId = resolveHashTarget(window.location.hash)
      const target = document.getElementById(targetId)
      if (!target) {
        return false
      }

      const header = document.querySelector('.site-header') as HTMLElement | null
      const offset = (header?.offsetHeight ?? 0) + 12
      const targetTop = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset)

      window.scrollTo({
        top: targetTop,
        behavior: 'auto',
      })

      return true
    }

    const syncHashScroll = () => {
      if (scrollToHashTarget()) {
        return
      }

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollToHashTarget()
        })
      })
    }

    syncHashScroll()
    window.addEventListener('hashchange', syncHashScroll)

    return () => window.removeEventListener('hashchange', syncHashScroll)
  }, [])

  useEffect(() => {
    const updateActiveSection = () => {
      const getAbsoluteTop = (element: HTMLElement) => window.scrollY + element.getBoundingClientRect().top
      const header = document.querySelector('.site-header') as HTMLElement | null
      const headerHeight = header?.offsetHeight ?? 0

      if (window.scrollY <= 8) {
        setActiveNav('home')
        return
      }

      const homeSection = document.getElementById('home') as HTMLElement | null
      const workSection = document.getElementById('work') as HTMLElement | null
      const aboutSection = document.getElementById('about') as HTMLElement | null
      const contactSection = document.getElementById('contact') as HTMLElement | null
      if (!homeSection || !workSection || !aboutSection || !contactSection) {
        return
      }

      const sections: Array<{
        key: NavKey
        section: HTMLElement
      }> = [
        { key: 'home', section: homeSection },
        { key: 'work', section: workSection },
        { key: 'about', section: aboutSection },
        { key: 'contact', section: contactSection },
      ]

      const scrollMarker = window.scrollY + headerHeight + Math.min(window.innerHeight * 0.32, 220)
      let nextActive: NavKey = sections[0].key

      sections.forEach((entry) => {
        if (getAbsoluteTop(entry.section) <= scrollMarker) {
          nextActive = entry.key
        }
      })

      setActiveNav((current) => (current === nextActive ? current : nextActive))
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
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

  const selectedPillarGroup =
    projectsByPillar.find((group) => group.pillar.key === selectedPillar) ?? projectsByPillar[0]

  const selectedProject = selectedPillarGroup?.items.find(
    (project) => project.id === selectedProjectByPillar[selectedPillarGroup.pillar.key],
  )

  const themeLabel = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'

  const focusAnchorTarget = (target: HTMLElement) => {
    if (!target.hasAttribute('tabindex')) {
      target.setAttribute('tabindex', '-1')
    }

    target.focus({ preventScroll: true })
  }

  const smoothScrollToTarget = (targetId: string, navKey: NavKey) => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const target = document.getElementById(targetId)
    if (!target) {
      return
    }

    const header = document.querySelector('.site-header') as HTMLElement | null
    const offset = (header?.offsetHeight ?? 0) + 12
    const targetTop = Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset)

    setActiveNav(navKey)
    focusAnchorTarget(target)
    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
    window.history.replaceState(null, '', `#${targetId}`)
  }

  const scrollToActiveProjectModule = () => {
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    requestAnimationFrame(() => {
      const impactHeading = document.getElementById('impact-anchor')
      if (!impactHeading) {
        return
      }

      const header = document.querySelector('.site-header') as HTMLElement | null
      const offset = (header?.offsetHeight ?? 0) + 24
      const targetTop = window.scrollY + impactHeading.getBoundingClientRect().top - offset

      window.scrollTo({
        top: targetTop,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    })
  }

  const setPillar = (pillarKey: PillarKey, shouldScroll = true) => {
    setShowAllPillars(false)
    setSelectedPillar(pillarKey)
    if (shouldScroll) {
      scrollToActiveProjectModule()
    }
  }

  const toggleSeeAllPillars = () => {
    setShowAllPillars((current) => {
      const next = !current
      if (!next) {
        setSelectedPillar('robotics')
      }
      return next
    })
    scrollToActiveProjectModule()
  }

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'))
  }

  const toggleNav = () => {
    setIsNavOpen((current) => !current)
  }

  const closeNav = () => {
    setIsNavOpen(false)
  }

  const selectPillarProject = (pillarKey: PillarKey, projectId: string) => {
    setSelectedProjectByPillar((current) => ({
      ...current,
      [pillarKey]: projectId,
    }))
  }

  const onPillarKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentKey: PillarKey) => {
    const keys = pillars.map((pillar) => pillar.key)
    const currentIndex = keys.indexOf(currentKey)
    if (currentIndex < 0) {
      return
    }

    let nextIndex = currentIndex

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % keys.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + keys.length) % keys.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = keys.length - 1
    } else {
      return
    }

    event.preventDefault()
    const nextKey = keys[nextIndex]
    setPillar(nextKey)
    requestAnimationFrame(() => {
      document.getElementById(`pillar-tab-${nextKey}`)?.focus()
    })
  }

  const onProjectKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentProjectId: string) => {
    if (!selectedPillarGroup) {
      return
    }

    const projectIds = selectedPillarGroup.items.map((project) => project.id)
    const currentIndex = projectIds.indexOf(currentProjectId)
    if (currentIndex < 0) {
      return
    }

    let nextIndex = currentIndex

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % projectIds.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + projectIds.length) % projectIds.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = projectIds.length - 1
    } else {
      return
    }

    event.preventDefault()
    const nextProjectId = projectIds[nextIndex]
    selectPillarProject(selectedPillarGroup.pillar.key, nextProjectId)
    requestAnimationFrame(() => {
      document.getElementById(`project-tab-${nextProjectId}`)?.focus()
    })
  }

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
              <a
                href="#top"
                className={activeNav === 'home' ? 'is-active' : undefined}
                aria-current={activeNav === 'home' ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  smoothScrollToTarget('top', 'home')
                  closeNav()
                }}
              >
                Home
              </a>
              <a
                href="#impact-anchor"
                className={activeNav === 'work' ? 'is-active' : undefined}
                aria-current={activeNav === 'work' ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  smoothScrollToTarget('impact-anchor', 'work')
                  closeNav()
                }}
              >
                Work
              </a>
              <a
                href="#about-home-title"
                className={activeNav === 'about' ? 'is-active' : undefined}
                aria-current={activeNav === 'about' ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  smoothScrollToTarget('about-home-title', 'about')
                  closeNav()
                }}
              >
                About Me
              </a>
              <a
                href="/artifacts/SoyonKim_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-no-highlight"
                onClick={closeNav}
              >
                Resume
              </a>
              <a
                href="#contact-home-title"
                className={activeNav === 'contact' ? 'is-active' : undefined}
                aria-current={activeNav === 'contact' ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  smoothScrollToTarget('contact-home-title', 'contact')
                  closeNav()
                }}
              >
                Contact
              </a>
            </nav>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              role="switch"
              aria-checked={theme === 'dark'}
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
        <section id="home" className="section hero" aria-labelledby="hero-title" tabIndex={-1}>
          <div className="hero-stage">
            <div className="container hero-layout">
              <div className="hero-copy">
                <div className="hero-intro">
                  <p className="hero-greeting">Hello,</p>
                  <h1 id="hero-title">I&apos;m Soyon Kim,</h1>
                  <p className="hero-titleline">Human-centered UX Design Researcher</p>
                  <p className="hero-subline">
                    My goal is to build trustworthy, responsible systems that support human wellbeing and agency.
                  </p>
                </div>
              </div>
              <div className="hero-portrait">
                <img src="/soyon_portrait.png" alt="Portrait of Soyon Kim" loading="eager" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section work" aria-labelledby="impact-anchor" tabIndex={-1}>
          <div className="container work-content">
            <h2 id="impact-anchor" className="hero-transition" tabIndex={-1}>
              My work spans across:
            </h2>

            <div className="work-panel-shell">
              <div id="pillar-selector" className="pillar-selector">
                <div className="pillar-tablist" role="tablist" aria-label="Research pillars">
                  {pillars.map((pillar) => {
                    const selected = !showAllPillars && pillar.key === selectedPillar
                    return (
                      <button
                        key={pillar.key}
                        id={`pillar-tab-${pillar.key}`}
                        type="button"
                        role="tab"
                        className={`pillar-tab ${selected ? 'is-active' : ''}`}
                        aria-selected={selected}
                        aria-controls="pillar-content-panel"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setPillar(pillar.key)}
                        onKeyDown={(event) => onPillarKeyDown(event, pillar.key)}
                      >
                        <span className="pillar-tab-icon" aria-hidden="true">
                          <PillarIcon icon={pillar.icon} />
                        </span>
                        <span className="pillar-tab-label">{pillar.title}</span>
                      </button>
                    )
                  })}
                </div>
                <button
                  type="button"
                  className={`pillar-tab pillar-tab-see-all ${showAllPillars ? 'is-active' : ''}`}
                  aria-expanded={showAllPillars}
                  aria-controls="pillar-content-panel"
                  onClick={toggleSeeAllPillars}
                >
                  {showAllPillars ? 'Collapse' : 'See all'}
                </button>
              </div>

              {showAllPillars ? (
                <section id="pillar-content-panel" className="pillar-content-panel" role="region" aria-label="All pillars">
                  {projectsByPillar.map((group) => (
                    <section key={group.pillar.key} className="all-pillars-group">
                      <p className="pillar-group-title">{group.pillar.title}</p>
                      <p className="pillar-intro">{group.pillar.description}</p>
                      <div className="project-stack">
                        {group.items.map((project) => (
                          <a
                            key={project.id}
                            className="project-focus-card is-selected"
                            href={project.caseStudyUrl}
                            aria-label={`View ${project.title} project`}
                          >
                            <div className="project-focus-media">
                              <img
                                src={project.thumbnail}
                                alt={`${project.title} preview`}
                                loading="lazy"
                                decoding="async"
                                width={640}
                                height={360}
                                style={project.thumbnailPosition ? { objectPosition: project.thumbnailPosition } : undefined}
                              />
                            </div>
                            <div className="project-focus-content">
                              <h3>{project.title}</h3>
                              <p className="project-focus-summary">{renderBoldMarkedText(project.subtitle)}</p>
                              <p className="meta-line meta-supports">
                                <span className="meta-icon" aria-hidden="true">
                                  <MetaIcon type="supports" />
                                </span>
                                <span>
                                  <strong>Supports:</strong> {project.supports}
                                </span>
                              </p>
                              <p className="meta-line meta-impact">
                                <span className="meta-icon" aria-hidden="true">
                                  <MetaIcon type="impact" />
                                </span>
                                <span>
                                  <strong>Impact:</strong> {renderBoldMarkedText(project.impact)}
                                </span>
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </section>
                  ))}
                </section>
              ) : selectedPillarGroup && selectedProject ? (
                <section
                  id="pillar-content-panel"
                  key={selectedPillarGroup.pillar.key}
                  className="pillar-content-panel"
                  role="tabpanel"
                  aria-labelledby={`pillar-tab-${selectedPillarGroup.pillar.key}`}
                >
                  <p id="work-pillar-title" className="pillar-group-title">
                    {selectedPillarGroup.pillar.title}
                  </p>
                  <p className="pillar-intro">{selectedPillarGroup.pillar.description}</p>
                  <p className="project-tab-lead">See projects in this category:</p>

                  <div className="project-tabs" role="tablist" aria-label={`${selectedPillarGroup.pillar.title} projects`}>
                    {selectedPillarGroup.items.map((project) => {
                      const isSelected = project.id === selectedProject.id
                      return (
                        <button
                          key={project.id}
                          id={`project-tab-${project.id}`}
                          type="button"
                          role="tab"
                          className={`project-tab ${isSelected ? 'is-active' : ''}`}
                          aria-selected={isSelected}
                          aria-controls={`project-panel-${selectedPillarGroup.pillar.key}`}
                          tabIndex={isSelected ? 0 : -1}
                          onClick={() => selectPillarProject(selectedPillarGroup.pillar.key, project.id)}
                          onKeyDown={(event) => onProjectKeyDown(event, project.id)}
                        >
                          {project.title}
                        </button>
                      )
                    })}
                  </div>

                  <div
                    id={`project-panel-${selectedPillarGroup.pillar.key}`}
                    className="project-tabpanel"
                    role="tabpanel"
                    aria-labelledby={`project-tab-${selectedProject.id}`}
                  >
                    <a
                      className="project-focus-card is-selected"
                      href={selectedProject.caseStudyUrl}
                      aria-label={`View ${selectedProject.title} project`}
                    >
                      <div className="project-focus-media">
                        <img
                          src={selectedProject.thumbnail}
                          alt={`${selectedProject.title} preview`}
                          loading="lazy"
                          decoding="async"
                          width={640}
                          height={360}
                          style={selectedProject.thumbnailPosition ? { objectPosition: selectedProject.thumbnailPosition } : undefined}
                        />
                      </div>
                      <div className="project-focus-content">
                        <h3>{selectedProject.title}</h3>
                        <p className="project-focus-summary">{renderBoldMarkedText(selectedProject.subtitle)}</p>
                        <p className="meta-line meta-supports">
                          <span className="meta-icon" aria-hidden="true">
                            <MetaIcon type="supports" />
                          </span>
                          <span>
                            <strong>Supports:</strong> {selectedProject.supports}
                          </span>
                        </p>
                        <p className="meta-line meta-impact">
                          <span className="meta-icon" aria-hidden="true">
                            <MetaIcon type="impact" />
                          </span>
                          <span>
                              <strong>Impact:</strong> {renderBoldMarkedText(selectedProject.impact)}
                          </span>
                        </p>
                      </div>
                    </a>
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </section>

        <section id="about" className="section about-home" aria-labelledby="about-home-title" tabIndex={-1}>
          <div className="container about-home-layout">
            <div className="about-home-copy">
              <h2 id="about-home-title">About Me</h2>
              <p>
                I&apos;m a <strong>human-centered UX design researcher</strong> focused on building
                <strong> trustworthy, responsible assistive systems</strong> that support wellbeing and human agency.
                My work sits at the intersection of assistive robotics, healthcare, and AI, domains where design
                decisions directly shape how people experience <strong>access and autonomy in care</strong> in their
                daily lives.
              </p>
              <p>
                I approach research as both a deeply qualitative and systemic practice. Through co-design, in-situ
                research, and longitudinal engagement, I work closely with people navigating complex, high-stakes
                environments. My focus is on translating lived experiences into real-world, sustainable design
                decisions. I&apos;m particularly interested in how
                <strong> systems, not just products, uplift humanity</strong>, whether that&apos;s how healthcare
                access is structured, how assistive technologies are adopted over time, or how AI mediates sensitive
                human interactions.
              </p>
              <p>
                Across my work, I aim to bridge research and implementation: building and evaluating systems that move
                beyond concepts into real-world deployment, and ensuring that design reflects not just what works,
                but what is <strong>equitable and trustworthy in real human needs</strong>.
              </p>
              <ul className="home-link-list" aria-label="Professional links">
                <li>
                  <a href="https://www.linkedin.com/in/soyon-kim/" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="https://github.com/soyoybean" target="_blank" rel="noopener noreferrer">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="https://scholar.google.com/citations?user=l3XDvJgAAAAJ&hl=en" target="_blank" rel="noopener noreferrer">
                    Google Scholar
                  </a>
                </li>
              </ul>
            </div>
            <figure className="about-home-figure">
              <img
                src="/Soyon_GreenBackground.jpg"
                alt="Soyon Kim portrait against a green background."
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        <section id="contact" className="section contact-home" aria-labelledby="contact-home-title" tabIndex={-1}>
          <div className="container contact-home-layout">
            <h2 id="contact-home-title">Contact</h2>
            <p>
              For any questions, thoughts, or feedback, reach out via any of the following:
            </p>
            <ul className="social-list" aria-label="Contact links">
              <li>
                <a href="https://www.linkedin.com/in/soyon-kim/" target="_blank" rel="noopener noreferrer">
                  <FooterIcon type="linkedin" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a href="https://github.com/soyoybean" target="_blank" rel="noopener noreferrer">
                  <FooterIcon type="github" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://scholar.google.com/citations?user=l3XDvJgAAAAJ&hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FooterIcon type="scholar" />
                  <span>Google Scholar</span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section
          id="accessibility"
          className="section accessibility-home"
          aria-labelledby="accessibility-home-title"
          tabIndex={-1}
        >
          <div className="container accessibility-home-layout">
            <h2 id="accessibility-home-title">Accessibility Statement</h2>
            <p>
              This site is designed to be keyboard navigable, responsive, and readable in light and dark modes.
              Images include descriptive alt text, and interactive elements follow accessible patterns (e.g.,
              ARIA-compliant toggles and focus states).
            </p>
            <p>
              If you encounter any accessibility barriers, please reach out; I welcome feedback and continuously
              improve the experience.
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer" aria-labelledby="footer-quote">
        <div className="container footer-layout">
          <p id="footer-quote" className="footer-quote">
            &quot;Despite everything, it&apos;s still you.&quot;
          </p>

          <nav className="footer-nav" aria-label="Footer navigation">
            <a href="#top">Home</a>
            <a href="#impact-anchor">Work</a>
            <a href="#about">About Me</a>
            <a href="/artifacts/SoyonKim_Resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-no-highlight">
              Resume
            </a>
            <a href="#contact">Contact</a>
          </nav>

          <ul className="footer-social" aria-label="External links">
            <li>
              <a href="https://www.linkedin.com/in/soyon-kim/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FooterIcon type="linkedin" />
              </a>
            </li>
            <li>
              <a href="https://github.com/soyoybean" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FooterIcon type="github" />
              </a>
            </li>
            <li>
              <a
                href="https://scholar.google.com/citations?user=l3XDvJgAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Scholar"
              >
                <FooterIcon type="scholar" />
              </a>
            </li>
          </ul>
        </div>
      </footer>
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
  type: 'supports' | 'impact'
}

type FooterIconProps = {
  type: 'linkedin' | 'github' | 'scholar'
}

function MetaIcon({ type }: MetaIconProps) {
  if (type === 'supports') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16 19v-1.2A3.8 3.8 0 0 0 12.2 14H7.8A3.8 3.8 0 0 0 4 17.8V19" />
        <circle cx="10" cy="8" r="3" />
        <path d="M19 19v-1a3.2 3.2 0 0 0-2.4-3.1" />
        <path d="M15.5 5.2a3 3 0 0 1 0 5.7" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m4 16 5-5 4 4 7-7" />
      <path d="M16 8h4v4" />
    </svg>
  )
}

function FooterIcon({ type }: FooterIconProps) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M8.8 14.7c1.1 1.5 2.6 2.3 3.2 2.6M8.2 9.8h7.6M9.5 12h5.4M13.5 6.5c1.3 2 2 4 2 5.5s-.7 3.5-2 5.5" />
    </svg>
  )
}

export default App
