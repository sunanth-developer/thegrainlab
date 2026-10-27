import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta/PageMeta.jsx'
import PageIntro from '../components/PageIntro/PageIntro.jsx'
import Arrow from '../components/Icon/Arrow.jsx'
import { getLaunchProducts, productPath } from '../lib/catalogue.js'
import './pages.css'

export default function NotFound() {
  const products = getLaunchProducts()
  return (
    <>
      <PageMeta title="Page not found" noindex />
      <PageIntro
        tone="dark"
        className="not-found"
        label="Page not found"
        lines={['Not on', <em key="accent">the menu.</em>]}
        intro="The page you were looking for doesn’t exist. Try one of our breakfasts instead."
      >
        <div className="not-found__actions">
          <Link to="/products" className="btn">
            Explore the collection
            <span className="btn__icon">
              <Arrow />
            </span>
          </Link>
          {products.map((p) => (
            <Link key={p.slug} to={productPath(p)} className="link-line">
              {p.name}
            </Link>
          ))}
        </div>
      </PageIntro>
    </>
  )
}
