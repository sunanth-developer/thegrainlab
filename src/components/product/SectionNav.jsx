import { useEffect, useRef, useState } from 'react'
import { PRODUCT_SECTIONS } from './sections.js'

/** Sticky in-page navigation for the product page; highlights the section in view. */
export default function SectionNav({ label }) {
  const [active, setActive] = useState(PRODUCT_SECTIONS[0].id)
  const listRef = useRef(null)

  useEffect(() => {
    const targets = PRODUCT_SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  // On narrow screens the list scrolls sideways; keep the current section's link in view.
  useEffect(() => {
    const list = listRef.current
    const link = list?.querySelector('[aria-current="true"]')
    if (!list || !link || list.scrollWidth <= list.clientWidth) return
    const offset = link.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft
    const left = offset - (list.clientWidth - link.offsetWidth) / 2
    list.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [active])

  return (
    <nav className="snav" aria-label={label}>
      <div className="container snav__inner">
        <ul ref={listRef}>
          {PRODUCT_SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="snav__link" aria-current={active === s.id ? 'true' : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
