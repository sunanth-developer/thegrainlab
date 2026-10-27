import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Img from '../Img/Img.jsx'
import { EASE } from '../../lib/motion.js'
import './IngredientExplorer.css'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Ingredient-by-ingredient explorer.
 *
 * Props
 * - items: [{ id, name, fullName?, quantity: { display } | null, role | null, onPack | null, image }]
 * - quantityLabel: what the quantity means, e.g. "Per 100 g of mix".
 * - sourceNote: where the quantities and roles come from, shown once under the panel.
 * - label: accessible name for the selector.
 *
 * The selector is an ARIA tablist (arrow keys, Home/End); every ingredient's
 * name, quantity and role are plain text in the panel, so nothing depends on
 * hover or animation. Motion is limited to a crossfade and is reduced by the
 * app-wide MotionConfig when the user prefers reduced motion.
 */
export default function IngredientExplorer({ items, quantityLabel, sourceNote, label = 'Ingredients', id = 'ingredients-explorer' }) {
  const [index, setIndex] = useState(0)
  const tabs = useRef([])
  const listRef = useRef(null)
  const item = items[index]

  // Keep the selected ingredient visible when the selector scrolls sideways.
  useEffect(() => {
    const list = listRef.current
    const tab = tabs.current[index]
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return
    const offset = tab.getBoundingClientRect().left - list.getBoundingClientRect().left + list.scrollLeft
    list.scrollTo({ left: Math.max(0, offset - (list.clientWidth - tab.offsetWidth) / 2), behavior: 'smooth' })
  }, [index])

  if (!item) return null
  const next = items[(index + 1) % items.length]

  const select = (i, focus = false) => {
    const n = (i + items.length) % items.length
    setIndex(n)
    if (focus) tabs.current[n]?.focus()
  }

  const onKeyDown = (e) => {
    const moves = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 }
    if (!(e.key in moves)) return
    e.preventDefault()
    select(moves[e.key], true)
  }

  const tabId = (it) => `${id}-tab-${it.id}`

  return (
    <div className="ix">
      <div ref={listRef} className="ix__picker" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {items.map((it, i) => (
          <button
            key={it.id}
            ref={(node) => (tabs.current[i] = node)}
            id={tabId(it)}
            type="button"
            role="tab"
            className="ix__pick"
            aria-selected={i === index}
            aria-controls={`${id}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => select(i)}
          >
            <span className="ix__pick-photo">
              <Img imageKey={it.image} ratio="1 / 1" sizes="112px" alt="" fallbackLabel={it.name} />
            </span>
            <span className="ix__pick-name">{it.name}</span>
            {it.quantity && <span className="ix__pick-qty">{it.quantity.display}</span>}
          </button>
        ))}
      </div>

      <div id={`${id}-panel`} className="ix__panel" role="tabpanel" aria-labelledby={tabId(item)}>
        <div className="ix__stage">
          <div className="ix__frame">
            <AnimatePresence initial={false}>
              <motion.div
                key={item.id}
                className="ix__photo"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <Img imageKey={item.image} ratio="fill" sizes="(min-width: 900px) 44vw, 92vw" fallbackLabel={item.name} />
              </motion.div>
            </AnimatePresence>
          </div>

          {item.quantity && (
            <p className="ix__badge" aria-hidden="true">
              <span className="ix__badge-value">{item.quantity.display}</span>
              <span className="ix__badge-label">{quantityLabel}</span>
            </p>
          )}

          <p className="ix__count" aria-hidden="true">
            {pad(index + 1)} <span>/ {pad(items.length)}</span>
          </p>

          {items.length > 1 && (
            <button type="button" className="ix__next" onClick={() => select(index + 1)}>
              <span className="ix__next-photo">
                <Img imageKey={next.image} ratio="1 / 1" sizes="80px" alt="" />
              </span>
              <span className="ix__next-text">
                <span className="ix__next-label">Next</span>
                <span className="ix__next-name">{next.name}</span>
              </span>
            </button>
          )}
        </div>

        <motion.div
          key={item.id}
          className="ix__detail"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p className="ix__eyebrow">Ingredient {pad(index + 1)}</p>
          <h3 className="ix__name">{item.name}</h3>
          {item.fullName && <p className="ix__fullname">{item.fullName}</p>}

          <div className="ix__why">
            <p className="ix__why-label">Why it&rsquo;s here</p>
            <p className="ix__why-text">{item.role ?? 'Its role is not described in the product information.'}</p>
          </div>

          <dl className="ix__facts">
            <div>
              <dt>{quantityLabel}</dt>
              <dd>{item.quantity?.display ?? 'Not specified'}</dd>
            </div>
            <div>
              <dt>On the pack</dt>
              <dd>{item.onPack ?? 'Not listed on the current pack artwork'}</dd>
            </div>
          </dl>
        </motion.div>
      </div>

      {sourceNote && <p className="ix__source">{sourceNote}</p>}
    </div>
  )
}
