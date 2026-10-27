import Stat from '../Stat/Stat.jsx'
import ProductSection from './ProductSection.jsx'

export default function ProductHighlights({ product }) {
  const { stats, features, onPack } = product.highlights
  return (
    <ProductSection id="highlights" label="Highlights" title="At a glance" tone="theme">
      <div className="hl">
        <ul className="hl__stats">
          {stats.map((s) => (
            <li key={s.label} className="hl__stat">
              <Stat stat={s} size="lg" />
            </li>
          ))}
        </ul>
        <ul className="hl__features">
          {features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        {onPack.length > 0 && (
          <div className="hl__onpack">
            <p className="hl__onpack-label">Stated on the pack</p>
            <ul>
              {onPack.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="psec__fineprint">
        Figures as printed on the front of the pack; per-serving amounts refer to the {product.pack.servingSize} serving.
      </p>
    </ProductSection>
  )
}
