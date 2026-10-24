import { useEffect, useState, useSyncExternalStore } from 'react'

export function useMediaQuery(query) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * Header state from scroll position:
 * - `scrolled` once the page has moved
 * - `hidden` while scrolling down past the fold (shown again on scroll up)
 * - `tone` of the section currently underneath the header ([data-tone])
 */
export function useHeaderState(pathname) {
  const [state, setState] = useState({ scrolled: false, hidden: false, tone: 'dark' })

  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const read = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      const probeY = Math.min(40, window.innerHeight - 1)
      const under = document
        .elementsFromPoint(window.innerWidth / 2, probeY)
        .find((el) => !el.closest('.site-header') && el.closest('[data-tone]'))
      const tone = under?.closest('[data-tone]')?.dataset.tone ?? 'light'

      setState((prev) => {
        let hidden = prev.hidden
        if (y < 160) hidden = false
        else if (delta > 6) hidden = true
        else if (delta < -6) hidden = false
        const next = { scrolled: y > 12, hidden, tone }
        return next.scrolled === prev.scrolled && next.hidden === prev.hidden && next.tone === prev.tone
          ? prev
          : next
      })
      lastY = y
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read)
    }

    // Re-read after route transitions settle.
    const timers = [0, 350, 900].map((t) => setTimeout(read, t))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      timers.forEach(clearTimeout)
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  return state
}
