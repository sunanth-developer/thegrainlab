import { useParams } from 'react-router-dom'
import PageMeta from '../components/PageMeta/PageMeta.jsx'
import PageHero from '../components/PageHero/PageHero.jsx'
import SectionHeader from '../components/SectionHeader/SectionHeader.jsx'
import Img from '../components/Img/Img.jsx'
import MaskReveal from '../components/motion/MaskReveal.jsx'
import FadeUp from '../components/motion/FadeUp.jsx'
import Gallery from '../components/Gallery/Gallery.jsx'
import CategoryFeature from '../components/CategoryFeature/CategoryFeature.jsx'
import CollectionCard from '../components/Collection/CollectionCard.jsx'
import ProductCard from '../components/Collection/ProductCard.jsx'
import FinalStatement from '../components/FinalStatement/FinalStatement.jsx'
import NotFound from './NotFound.jsx'
import {
  getCategory,
  getCategoryIndex,
  getCollection,
  getGallery,
  getProductsByCategory,
  getVisibleCategories,
  pad,
} from '../lib/catalogue.js'
import { imageSrc } from '../data/images.js'
import './pages.css'

const COUNT_WORDS = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']

/** "Dosa mixes" → ["Dosa", <em>mixes.</em>] for an art-directed two-line title. */
function titleLines(name) {
  const [first, ...rest] = name.split(' ')
  return rest.length ? [first, <em key="accent" className="accent-italic">{rest.join(' ')}.</em>] : [`${first}.`]
}

function Stories({ items, exclude, title = 'At the table.' }) {
  if (!items.length) return null
  return (
    <section className="section stories tone-dark" data-tone="dark" aria-labelledby="stories-title">
      <div className="container">
        <SectionHeader id="stories-title" label="Food inspiration" lines={[title]} />
        <Gallery items={items} layout="pair" excludeCategory={exclude} />
      </div>
    </section>
  )
}

function MoreCategories({ categories, title = 'Keep exploring.' }) {
  if (!categories.length) return null
  const all = getVisibleCategories()
  return (
    <section className="section surface" data-tone="light" aria-labelledby="more-title">
      <div className="container">
        <SectionHeader id="more-title" label="More from the range" lines={[title]} />
        <ul className="more__grid">
          {categories.map((c) => (
            <li key={c.slug}>
              <CollectionCard category={c} index={all.findIndex((x) => x.slug === c.slug)} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function CategoryView({ category }) {
  const all = getVisibleCategories()
  const index = getCategoryIndex(category.slug)
  const products = getProductsByCategory(category.slug)

  return (
    <>
      <PageMeta title={category.name} description={category.description} image={imageSrc(category.image)} />

      <PageHero
        theme={category.theme}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'All products', to: '/products' },
          { label: category.name },
        ]}
        label={`Category ${pad(index + 1)} / ${pad(all.length)}`}
        lines={titleLines(category.name)}
        intro={category.description}
        imageKey={category.image}
        imageRatio="4 / 5"
        imagePosition={category.focus}
      />

      <section className="section surface" data-tone="light" aria-labelledby="range-title">
        <div className="container">
          {products.length > 0 ? (
            <>
              <SectionHeader id="range-title" label="Products" lines={[`The ${category.name.toLowerCase()}.`]} />
              <ul className="range__products">
                {products.map((p) => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="range">
              <MaskReveal className="range__media">
                <Img
                  imageKey={category.cardImage ?? category.image}
                  ratio="4 / 5"
                  sizes="(min-width: 900px) 42vw, 100vw"
                  fallbackLabel={category.name}
                />
              </MaskReveal>
              <FadeUp className="range__text">
                <p className="label">
                  <span className="label__index">{pad(index + 1)}</span>
                  The range
                </p>
                <h2 id="range-title" className="range__title">
                  Product details <em className="accent-italic">to follow.</em>
                </h2>
                <p className="range__copy">
                  Individual products in this range will be listed here, with their verified details, once they
                  are published.
                </p>
              </FadeUp>
            </div>
          )}
        </div>
      </section>

      <Stories items={getGallery({ categories: [category.slug] })} exclude={category.slug} />

      <MoreCategories categories={all.filter((c) => c.slug !== category.slug)} />

      <FinalStatement />
    </>
  )
}

function CollectionView({ collection }) {
  const slugs = collection.categories.map((c) => c.slug)
  const all = getVisibleCategories()

  return (
    <>
      <PageMeta title={collection.name} description={collection.description} image={imageSrc(collection.image)} />

      <PageHero
        theme={collection.theme}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'All products', to: '/products' },
          { label: collection.name },
        ]}
        label={`${collection.categories.length} categories`}
        lines={[collection.name, <em key="accent" className="accent-italic">collection.</em>]}
        intro={collection.description}
        imageKey={collection.image}
        imageRatio="1 / 1"
      />

      <section className="section surface" data-tone="light" aria-labelledby="collection-title">
        <div className="container">
          <SectionHeader
            id="collection-title"
            label="In this collection"
            lines={[
              `${COUNT_WORDS[collection.categories.length - 1] ?? collection.categories.length} ways`,
              <em key="accent" className="accent-italic">to start the day.</em>,
            ]}
          />
          <div className="collection-features">
            {collection.categories.map((c) => (
              <CategoryFeature
                key={c.slug}
                category={c}
                index={all.findIndex((x) => x.slug === c.slug)}
                ratio="4 / 5"
                imageKey={c.image}
                sizes="(min-width: 900px) 45vw, 100vw"
              />
            ))}
          </div>
        </div>
      </section>

      <Stories items={getGallery({ categories: slugs, exclude: [collection.image] })} title="Morning, served." />

      <MoreCategories
        categories={all.filter((c) => !slugs.includes(c.slug))}
        title="Beyond breakfast."
      />

      <FinalStatement />
    </>
  )
}

export default function CategoryPage() {
  const { slug } = useParams()
  const category = getCategory(slug)
  if (category) return <CategoryView category={category} />

  const collection = getCollection(slug)
  if (collection) return <CollectionView collection={collection} />

  return <NotFound />
}
