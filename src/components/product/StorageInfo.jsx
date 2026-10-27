import ProductSection from './ProductSection.jsx'

export default function StorageInfo({ product }) {
  return (
    <ProductSection id="storage" label="Storage" title="Storage instructions" tone="raised">
      <ul className="store">
        {product.storage.map((line) => (
          <li key={line}>
            <p>{line}</p>
          </li>
        ))}
      </ul>
    </ProductSection>
  )
}
