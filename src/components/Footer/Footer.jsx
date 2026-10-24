import { Link } from 'react-router-dom'
import { WordmarkType } from '../Wordmark/Wordmark.jsx'
import Arrow from '../Icon/Arrow.jsx'
import { categoryPath, getCollection, getVisibleCategories } from '../../lib/catalogue.js'
import './Footer.css'

const categories = getVisibleCategories()
const breakfast = getCollection('breakfast')
const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer tone-dark" data-tone="dark">
      <div className="container site-footer__inner">
        <div className="site-footer__columns">
          <nav aria-label="Product categories">
            <p className="site-footer__heading">Products</p>
            <ul>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={categoryPath(c.slug)} className="link-line">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Browse">
            <p className="site-footer__heading">Browse</p>
            <ul>
              <li>
                <Link to="/products" className="link-line">
                  All products
                </Link>
              </li>
              {breakfast && (
                <li>
                  <Link to={categoryPath(breakfast.slug)} className="link-line">
                    {breakfast.name}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
          <button
            type="button"
            className="site-footer__top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to top
            <Arrow direction="up" />
          </button>
        </div>

        <Link to="/" className="site-footer__wordmark" aria-label="The Grain Lab — home">
          <WordmarkType />
        </Link>

        <div className="site-footer__base">
          <p>© {YEAR} The Grain Lab</p>
          <p>Photography is illustrative and does not depict specific products or packaging.</p>
        </div>
      </div>
    </footer>
  )
}
