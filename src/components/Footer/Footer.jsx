import { Link } from 'react-router-dom'
import { LogoImage } from '../Logo/Logo.jsx'
import Arrow from '../Icon/Arrow.jsx'
import { imageSrc } from '../../data/images.js'
import { getLaunchProducts, productPath } from '../../lib/catalogue.js'
import './Footer.css'

const products = getLaunchProducts()
const YEAR = new Date().getFullYear()
const FIELDS = imageSrc('fields', 960)

export default function Footer() {
  return (
    <footer className="site-footer tone-dark" data-tone="dark">
      {FIELDS && (
        <div className="site-footer__fields" aria-hidden="true" style={{ '--fields': `url(${FIELDS})` }} />
      )}
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Link to="/" aria-label="The Grain Lab — home" className="site-footer__logo">
            <LogoImage variant="light" sizes="280px" alt="" />
          </Link>
        </div>

        <nav aria-label="Launch products" className="site-footer__col">
          <p className="site-footer__heading">The launch collection</p>
          <ul>
            {products.map((p) => (
              <li key={p.slug}>
                <Link to={productPath(p)} className="link-line">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Explore" className="site-footer__col">
          <p className="site-footer__heading">Explore</p>
          <ul>
            <li>
              <Link to="/products" className="link-line">
                Explore products
              </Link>
            </li>
            <li>
              <Link to="/pancake-mixes" className="link-line">
                Pancake mixes
              </Link>
            </li>
            <li>
              <Link to="/products#on-the-horizon" className="link-line">
                On the horizon
              </Link>
            </li>
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

        <div className="site-footer__base">
          <p>© {YEAR} The Grain Lab</p>
          <p>
            Product information is transcribed from the pack labels; always check the pack before use. Food
            photography shows serving suggestions.
          </p>
        </div>
      </div>
    </footer>
  )
}
