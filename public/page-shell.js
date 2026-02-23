(() => {
  const storageKey = 'portfolio-theme'
  const root = document.documentElement

  const getPreferredTheme = () => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (stored === 'light' || stored === 'dark') {
        return stored
      }
    } catch {
      // noop
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme)
    const toggle = document.querySelector('[data-theme-toggle]')
    const icon = document.querySelector('[data-theme-icon]')
    if (toggle instanceof HTMLButtonElement) {
      const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'
      toggle.setAttribute('aria-label', label)
      toggle.setAttribute('title', label)
    }
    if (icon instanceof HTMLImageElement) {
      icon.src = theme === 'dark' ? '/icons/moon-placeholder.svg' : '/icons/sun-placeholder.svg'
    }
  }

  const persistTheme = (theme) => {
    try {
      window.localStorage.setItem(storageKey, theme)
    } catch {
      // noop
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    let theme = getPreferredTheme()
    applyTheme(theme)

    const navLinks = Array.from(document.querySelectorAll('.primary-nav a'))
    const path = window.location.pathname
    const hash = window.location.hash

    let activeKey = ''
    if (path === '/' || path.endsWith('/index.html')) {
      if (hash === '#impact-anchor' || hash === '#work') {
        activeKey = 'work'
      } else if (hash === '#about') {
        activeKey = 'about'
      } else if (hash === '#contact') {
        activeKey = 'contact'
      } else {
        activeKey = 'home'
      }
    } else if (path.includes('/case-studies/')) {
      activeKey = 'work'
    }

    navLinks.forEach((link) => {
      if (!(link instanceof HTMLAnchorElement)) {
        return
      }
      if (link.dataset.nav === activeKey) {
        link.classList.add('is-active')
      }
      link.addEventListener('click', () => {
        if (link.dataset.nav === 'resume') {
          return
        }
        navLinks.forEach((node) => node.classList.remove('is-active'))
        link.classList.add('is-active')
      })
    })

    const sectionNavLinks = Array.from(document.querySelectorAll('.case-section-nav a[href^="#"]'))
    const siteHeader = document.querySelector('.site-header')
    const caseHeader = document.querySelector('.case-header')
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const getSectionOffset = () => {
      const siteHeaderHeight = siteHeader instanceof HTMLElement ? siteHeader.offsetHeight : 0
      const caseHeaderHeight = caseHeader instanceof HTMLElement ? caseHeader.offsetHeight : 0
      return siteHeaderHeight + caseHeaderHeight + 10
    }

    if (sectionNavLinks.length > 0) {
      sectionNavLinks.forEach((link) => {
        if (!(link instanceof HTMLAnchorElement)) {
          return
        }

        link.addEventListener('click', (event) => {
          const id = link.getAttribute('href')?.slice(1)
          if (!id) {
            return
          }

          const target = document.getElementById(id)
          if (!target) {
            return
          }

          event.preventDefault()
          const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - getSectionOffset())
          window.scrollTo({
            top,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          })

          sectionNavLinks.forEach((node) => node.classList.remove('is-active'))
          link.classList.add('is-active')
          window.history.replaceState(null, '', `#${id}`)
        })
      })
    }

    const toggle = document.querySelector('[data-theme-toggle]')
    if (toggle instanceof HTMLButtonElement) {
      toggle.addEventListener('click', () => {
        theme = theme === 'light' ? 'dark' : 'light'
        applyTheme(theme)
        persistTheme(theme)
      })
    }
  })
})()
