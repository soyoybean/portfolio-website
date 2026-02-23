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
      const workTitle = document.getElementById('impact-anchor') as HTMLElement | null
      const aboutTitle = document.getElementById('about-home-title') as HTMLElement | null
      const contactTitle = document.getElementById('contact-home-title') as HTMLElement | null

      if (
        !homeSection ||
        !workSection ||
        !aboutSection ||
        !contactSection ||
        !workTitle ||
        !aboutTitle ||
        !contactTitle
      ) {
        return
      }

      const sections: Array<{
        key: NavKey
        section: HTMLElement
        title: HTMLElement
      }> = [
        {
          key: 'home',
          section: homeSection,
          title: (document.getElementById('hero-title') as HTMLElement | null) ?? homeSection,
        },
        { key: 'work', section: workSection, title: workTitle },
        { key: 'about', section: aboutSection, title: aboutTitle },
        { key: 'contact', section: contactSection, title: contactTitle },
      ]

      let nextActive: NavKey = 'home'
      for (let index = 0; index < sections.length - 1; index += 1) {
        const current = sections[index]
        const upcoming = sections[index + 1]
        const currentTop = getAbsoluteTop(current.section)
        const currentHeight = Math.max(current.section.offsetHeight, 1)
        const upcomingTitleTop = getAbsoluteTop(upcoming.title)
        const majorityPassedThreshold = currentTop + currentHeight * 0.55
        const upcomingTitleVisibleThreshold = upcomingTitleTop - (headerHeight + 16)
        const transitionThreshold = Math.max(majorityPassedThreshold, upcomingTitleVisibleThreshold)

        if (window.scrollY >= transitionThreshold) {
          nextActive = upcoming.key
        } else {
          break
        }
      }

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
                <img src="/soyon-portrait.png" alt="Portrait of Soyon Kim" loading="eager" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="section work" aria-labelledby="work-pillar-title">
          <div className="container work-content">
            <p id="impact-anchor" className="hero-transition">
              My work spans across:
            </p>

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
                    <h2>{group.pillar.title}</h2>
                    <p className="pillar-intro">{group.pillar.description}</p>
                    <div className="project-stack">
                      {group.items.map((project) => (
                        <a key={project.id} className="project-focus-card is-selected" href={project.caseStudyUrl}>
                          <div className="project-focus-media">
                            <img
                              src={project.thumbnail}
                              alt={`${project.title} preview`}
                              loading="lazy"
                              decoding="async"
                              width={640}
                              height={360}
                            />
                          </div>
                          <div className="project-focus-content">
                            <h3>{project.title}</h3>
                            <p className="project-focus-summary">{project.subtitle}</p>
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
                                <strong>Impact:</strong> {project.impact}
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
                <h2 id="work-pillar-title">{selectedPillarGroup.pillar.title}</h2>
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
                  <a className="project-focus-card is-selected" href={selectedProject.caseStudyUrl}>
                    <div className="project-focus-media">
                      <img
                        src={selectedProject.thumbnail}
                        alt={`${selectedProject.title} preview`}
                        loading="lazy"
                        decoding="async"
                        width={640}
                        height={360}
                      />
                    </div>
                    <div className="project-focus-content">
                      <h3>{selectedProject.title}</h3>
                      <p className="project-focus-summary">{selectedProject.subtitle}</p>
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
                          <strong>Impact:</strong> {selectedProject.impact}
                        </span>
                      </p>
                    </div>
                  </a>
                </div>
              </section>
            ) : null}
          </div>
        </section>

        <section id="about" className="section about-home" aria-labelledby="about-home-title">
          <div className="container about-home-layout">
            <h2 id="about-home-title">About Me</h2>
            <p>
              I am a human-centered UX Design Researcher focused on trustworthy AI, assistive robotics, and equitable
              healthcare systems. My work combines qualitative depth with systems-level thinking to translate research
              into practical, real-world impact.
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
        </section>

        <section id="contact" className="section contact-home" aria-labelledby="contact-home-title">
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
