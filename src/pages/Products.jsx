import PageMeta from '../components/PageMeta/PageMeta.jsx'
import PageHero from '../components/PageHero/PageHero.jsx'
import Collection from '../components/Collection/Collection.jsx'
import FinalStatement from '../components/FinalStatement/FinalStatement.jsx'
import { categoryPath, getCollection } from '../lib/catalogue.js'
import { imageSrc } from '../data/images.js'
import './pages.css'

const breakfast = getCollection('breakfast')

export default function Products() {
  return (
    <>
      <PageMeta
        title="All products"
        description="Browse The Grain Lab collection: millet flours, dosa mixes, millet pasta, breakfast porridges and pancake blends."
        image={imageSrc('format-flours')}
      />

      <PageHero
        theme={{ tone: 'light', background: 'var(--ivory-50)' }}
        breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'All products' }]}
        lines={['The', <em key="accent" className="accent-italic">collection.</em>]}
        intro="Millet flours, mixes, pasta and breakfast staples — filter by category to find where to start."
      />

      <section className="section collection-section collection-section--flush" data-tone="light" aria-label="Product collection">
        <div className="container">
          <Collection syncWithUrl headingLevel={2} />
        </div>
      </section>

      {breakfast ? (
        <FinalStatement
          lines={['Start with', <em key="accent" className="accent-italic">breakfast.</em>]}
          ctaLabel="Explore breakfast"
          ctaTo={categoryPath(breakfast.slug)}
        />
      ) : (
        <FinalStatement ctaLabel="Back to home" ctaTo="/" />
      )}
    </>
  )
}
