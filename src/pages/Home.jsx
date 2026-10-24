import PageMeta from '../components/PageMeta/PageMeta.jsx'
import Hero from '../components/Hero/Hero.jsx'
import CategoryShowcase from '../components/CategoryShowcase/CategoryShowcase.jsx'
import Interlude from '../components/Interlude/Interlude.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import Gallery from '../components/Gallery/Gallery.jsx'
import Collection from '../components/Collection/Collection.jsx'
import FinalStatement from '../components/FinalStatement/FinalStatement.jsx'
import { getGallery } from '../lib/catalogue.js'
import { imageSrc } from '../data/images.js'
import './pages.css'

export default function Home() {
  const stories = getGallery()

  return (
    <>
      <PageMeta
        description="Millet flours, dosa mixes, millet pasta, breakfast porridges and pancake blends from The Grain Lab."
        image={imageSrc('hero')}
      />

      <Hero />
      <CategoryShowcase id="categories" />
      <Interlude />

      {stories.length > 0 && (
        <section className="section stories tone-dark" data-tone="dark" aria-labelledby="stories-title">
          <div className="container">
            <SectionHeader
              id="stories-title"
              label="At the table"
              lines={['Breakfast,', <em key="accent" className="accent-italic">considered.</em>]}
              intro="Porridge, pancakes, dosa and the grain behind them — a few ways the range finds its way to the table."
            />
            <Gallery items={stories} />
          </div>
        </section>
      )}

      <section id="collection" className="section surface collection-section" data-tone="light" aria-labelledby="collection-title">
        <div className="container">
          <SectionHeader
            id="collection-title"
            label="The collection"
            lines={['Browse by', <em key="accent" className="accent-italic">format.</em>]}
            intro="Every category in one place. Filter the range to find where to start."
          />
          <Collection />
        </div>
      </section>

      <FinalStatement />
    </>
  )
}
