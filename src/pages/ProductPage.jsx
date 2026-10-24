import { useParams } from 'react-router-dom'
import PageMeta from '../components/PageMeta/PageMeta.jsx'
import Img from '../components/Img/Img.jsx'
import Arrow from '../components/Icon/Arrow.jsx'
import MaskReveal from '../components/motion/MaskReveal.jsx'
import FadeUp from '../components/motion/FadeUp.jsx'
import LineReveal from '../components/motion/LineReveal.jsx'
import FinalStatement from '../components/FinalStatement/FinalStatement.jsx'
import NotFound from './NotFound.jsx'
import { categoryPath, getCategory, getProduct, hasValue } from '../lib/catalogue.js'
import { formatPrice } from '../lib/format.js'
import { imageSrc } from '../data/images.js'
import { Link } from 'react-router-dom'
import './pages.css'

/** Product detail. Every field is optional and hidden when not verified. */
export default function ProductPage() {
  const { slug, productId } = useParams()
  const product = getProduct(slug, productId)
  if (!product) return <NotFound />

  const category = getCategory(product.category)
  const price = formatPrice(product.price)
  const nutrition = product.nutrition?.rows?.filter((r) => hasValue(r.label) && hasValue(r.value)) ?? []
  const meta = [
    hasValue(product.packSize) && ['Pack size', product.packSize],
    price && ['Price', price],
    hasValue(product.availability) && ['Availability', product.availability],
  ].filter(Boolean)

  return (
    <>
      <PageMeta title={product.name} description={product.description} image={imageSrc(product.image)} />

      <section className="section surface page-top" data-tone="light" aria-labelledby="product-title">
        <div className="container product">
          <MaskReveal trigger="mount">
            <Img imageKey={product.image} ratio="4 / 5" priority sizes="(min-width: 900px) 52vw, 100vw" fallbackLabel={product.name} />
          </MaskReveal>

          <div className="product__details">
            <nav aria-label="Breadcrumb" className="breadcrumbs">
              <ol>
                <li>
                  <Link to="/products" className="link-line">All products</Link>
                </li>
                {category && (
                  <li>
                    <Link to={categoryPath(category.slug)} className="link-line">{category.name}</Link>
                  </li>
                )}
                <li aria-current="page">{product.name}</li>
              </ol>
            </nav>
            <LineReveal as="h1" id="product-title" trigger="mount" lines={[product.name]} className="title-md" />
            {hasValue(product.description) && <FadeUp trigger="mount" as="p" className="lede">{product.description}</FadeUp>}

            {meta.length > 0 && (
              <dl className="product__meta">
                {meta.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {hasValue(product.ingredients) && (
              <div className="product__block">
                <h2>Ingredients</h2>
                <p>{product.ingredients.join(', ')}</p>
              </div>
            )}

            {nutrition.length > 0 && (
              <div className="product__block">
                <h2>Nutritional information</h2>
                <table>
                  {hasValue(product.nutrition.basis) && <caption>{product.nutrition.basis}</caption>}
                  <tbody>
                    {nutrition.map((row) => (
                      <tr key={row.label}>
                        <th scope="row">{row.label}</th>
                        <td>{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {hasValue(product.purchaseUrl) && (
              <a className="btn" href={product.purchaseUrl} target="_blank" rel="noopener noreferrer">
                Buy {product.name}
                <span className="visually-hidden"> (opens in a new tab)</span>
                <span className="btn__icon">
                  <Arrow direction="up-right" />
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      <FinalStatement />
    </>
  )
}
