import { Link } from 'react-router-dom'
import Img from '../Img/Img.jsx'
import Parallax from '../motion/Parallax.jsx'
import SectionHeader from '../SectionHeader/SectionHeader.jsx'
import CategoryFeature, { CategoryText } from '../CategoryFeature/CategoryFeature.jsx'
import { categoryPath, getVisibleCategories } from '../../lib/catalogue.js'
import './CategoryShowcase.css'

/*
 * Art-directed slots, in category order. Each slot fixes the crop and the
 * placement; extra categories fall back to the "pair" treatment.
 */
const SLOTS = [
  { variant: 'lead', ratio: '1 / 1', sizes: '(min-width: 900px) 46vw, 100vw' },
  { variant: 'companion', ratio: '1 / 1', sizes: '(min-width: 900px) 46vw, 100vw' },
  { variant: 'wide', ratio: '16 / 9', sizes: '100vw' },
  { variant: 'pair-a', ratio: '1 / 1', sizes: '(min-width: 900px) 46vw, 100vw' },
  { variant: 'pair-b', ratio: '1 / 1', sizes: '(min-width: 900px) 46vw, 100vw' },
]
const FALLBACK = { variant: 'pair-a', ratio: '1 / 1', sizes: '(min-width: 900px) 46vw, 100vw' }

const WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']

function WideTile({ category, index, slot }) {
  return (
    <Link to={categoryPath(category.slug)} className="showcase__wide">
      <Parallax speed={0.07} zoom={0.1} className="showcase__wide-media">
        <Img imageKey={category.image} ratio="fill" sizes={slot.sizes} position={category.focus} />
      </Parallax>
      <div className="container showcase__wide-panel-wrap">
        <div className="showcase__wide-panel tone-dark">
          <CategoryText category={category} index={index} />
        </div>
      </div>
    </Link>
  )
}

export default function CategoryShowcase({ id = 'categories' }) {
  const categories = getVisibleCategories()
  if (!categories.length) return null

  const tiles = categories.map((category, i) => ({ category, index: i, slot: SLOTS[i] ?? FALLBACK }))
  const wide = tiles.find((t) => t.slot.variant === 'wide')
  const before = tiles.filter((t) => t !== wide && (!wide || t.index < wide.index))
  const after = tiles.filter((t) => t !== wide && wide && t.index > wide.index)

  const renderFeature = (t) => (
    <CategoryFeature
      key={t.category.slug}
      category={t.category}
      index={t.index}
      ratio={t.slot.ratio}
      sizes={t.slot.sizes}
      className={`showcase__tile showcase__tile--${t.slot.variant}`}
    />
  )

  return (
    <section id={id} className="showcase surface" data-tone="light" aria-labelledby={`${id}-title`}>
      <div className="container section showcase__intro">
        <SectionHeader
          id={`${id}-title`}
          label="The range"
          lines={[
            `${WORDS[categories.length - 1] ?? categories.length} ${categories.length === 1 ? 'way' : 'ways'} to bring`,
            <em key="accent" className="accent-italic">grain to the table.</em>,
          ]}
          intro="From the flour bin to the breakfast bowl — explore The Grain Lab by format."
        />
        <div className="showcase__row">{before.map(renderFeature)}</div>
      </div>

      {wide && <WideTile {...wide} />}

      {after.length > 0 && <div className="container section showcase__row">{after.map(renderFeature)}</div>}
    </section>
  )
}
