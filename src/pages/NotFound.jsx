import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta/PageMeta.jsx'
import PageHero from '../components/PageHero/PageHero.jsx'
import Arrow from '../components/Icon/Arrow.jsx'
import { categoryPath, getVisibleCategories } from '../lib/catalogue.js'
import './pages.css'

export default function NotFound() {
  const categories = getVisibleCategories()
  return (
    <>
      <PageMeta title="Page not found" noindex />
      <PageHero
        theme={{ tone: 'dark', background: 'var(--plum-900)' }}
        layout="tall"
        label="Page not found"
        lines={['Not on', <em key="accent" className="accent-italic">the menu.</em>]}
        intro="The page you were looking for doesn’t exist. Try one of the categories below."
      >
        <div className="not-found__actions">
          <Link to="/products" className="btn">
            Explore all products
            <span className="btn__icon">
              <Arrow />
            </span>
          </Link>
          {categories.map((c) => (
            <Link key={c.slug} to={categoryPath(c.slug)} className="link-line">
              {c.name}
            </Link>
          ))}
        </div>
      </PageHero>
    </>
  )
}
