import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Img from '../Img/Img.jsx'
import Pack from '../Pack/Pack.jsx'
import { getProductGallery } from '../../lib/catalogue.js'
import { imageSrc } from '../../data/images.js'
import { EASE } from '../../lib/motion.js'
import './ProductGallery.css'

export default function ProductGallery({ product }) {
  const items = getProductGallery(product)
  const [state, setState] = useState({ index: 0, dir: 1 })
  const item = items[state.index]
  if (!item) return null

  const go = (next) => {
    const index = (next + items.length) % items.length
    setState({ index, dir: index >= state.index ? 1 : -1 })
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const next = state.index + (e.key === 'ArrowRight' ? 1 : -1)
      go(next)
      const buttons = e.currentTarget.querySelectorAll('button')
      buttons[(next + items.length) % items.length]?.focus()
    }
  }

  const from = state.dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)'

  return (
    <div className="gallery">
      <figure className="gallery__main">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={item.key}
            className={`gallery__slide gallery__slide--${item.kind}`}
            initial={{ clipPath: from }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0.4, transition: { duration: 0.8 } }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {item.kind === 'pack' ? (
              <div className="gallery__pack">
                <Pack product={product} view={item.view} priority={state.index === 0} sizes="(min-width: 900px) 360px, 64vw" />
              </div>
            ) : (
              <div className="gallery__label">
                <Img imageKey={item.key} ratio="fill" fit="contain" placeholder={false} sizes="(min-width: 900px) 46vw, 100vw" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <figcaption className="gallery__caption">
          <span>
            {String(state.index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </span>
          {item.caption}
        </figcaption>
        {item.kind === 'label' && (
          <a className="gallery__zoom" href={imageSrc(item.key)} target="_blank" rel="noreferrer">
            Open full size<span className="visually-hidden">: {item.caption} (opens in a new tab)</span>
          </a>
        )}
      </figure>

      {items.length > 1 && (
        <div className="gallery__thumbs" role="group" aria-label="Product images" onKeyDown={onKeyDown}>
          {items.map((it, i) => (
            <button
              key={it.key}
              type="button"
              className="gallery__thumb"
              aria-pressed={i === state.index}
              aria-label={`Show image ${i + 1}: ${it.caption}`}
              tabIndex={i === state.index ? 0 : -1}
              onClick={() => go(i)}
            >
              <Img imageKey={it.key} ratio="1 / 1" fit="contain" placeholder={false} sizes="96px" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
