import ProductCard from '../ProductCard/ProductCard.jsx'

export default function RelatedProducts({ products, title = 'Also in the collection', single = false }) {
  if (!products.length) return null
  return (
    <section className="related section" data-tone="light" aria-labelledby="related-title">
      <div className="container">
        <header className="related__header">
          <p className="label">The collection</p>
          <h2 id="related-title" className="title-md">
            {title}
          </h2>
        </header>
        <ul className={`related__grid ${single ? 'related__grid--single' : ''}`}>
          {products.map((p) => (
            <li key={p.slug}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
