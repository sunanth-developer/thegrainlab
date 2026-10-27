import { Link } from 'react-router-dom'
import PageMeta from '../components/PageMeta/PageMeta.jsx'
import PageIntro from '../components/PageIntro/PageIntro.jsx'
import ProductCard from '../components/ProductCard/ProductCard.jsx'
import PreparationSteps from '../components/product/PreparationSteps.jsx'
import RelatedProducts from '../components/product/RelatedProducts.jsx'
import FadeUp from '../components/motion/FadeUp.jsx'
import { getLaunchProducts, productPath } from '../lib/catalogue.js'
import { valueOf } from '../lib/nutrition.js'
import '../components/product/product.css'
import './pages.css'

const per100 = (p, nutrient) => valueOf(p.nutrition.groups[0], nutrient, 'per100') ?? '–'
const stat = (p, label) => {
  const s = p.highlights.stats.find((x) => x.label === label)
  return s ? `${s.value} ${s.basis}` : '–'
}

/** Only the rows where the two labels can be compared directly. */
const ROWS = [
  ['Flavour', (p) => p.compare.flavour],
  ['Foxtail millet flour', (p) => p.compare.grain.replace(/^Foxtail millet flour \((.+)\)$/, '$1 of the mix')],
  ['Protein (front of pack)', (p) => stat(p, 'Protein')],
  ['Dietary fibre (front of pack)', (p) => stat(p, 'Dietary fibre')],
  ['Energy per 100 g', (p) => per100(p, 'Energy')],
  ['Total sugars per 100 g', (p) => per100(p, 'Total sugars')],
  ['Added sugars per 100 g', (p) => per100(p, 'Added sugars')],
  ['Total fat per 100 g', (p) => per100(p, 'Total fat')],
  ['Sodium per 100 g', (p) => per100(p, 'Sodium')],
]

export default function PancakeMixes() {
  const pancakes = getLaunchProducts('pancake')
  const others = getLaunchProducts().filter((p) => p.family !== 'pancake')
  const [first] = pancakes

  return (
    <>
      <PageMeta
        title="Pancake mixes"
        description="Vanilla and Chocolate Protein Pancake Mixes compared: flavour, protein, fibre and nutrition per 100 g, plus the shared preparation method."
      />
      <PageIntro
        label="Pancake mixes"
        lines={['Vanilla or', <em key="accent">chocolate.</em>]}
        intro="Both come with an 8 g honey stick and use the same method. Here is where the two labels differ."
      />

      <section className="family" data-tone="light" aria-label="The two pancake mixes">
        <div className="container">
          <ul className="related__grid">
            {pancakes.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {pancakes.length > 1 && (
        <section id="compare" className="compare section" data-tone="light" aria-labelledby="compare-title">
          <div className="container">
            <p className="label">At a glance</p>
            <h2 id="compare-title" className="title-md compare__title">
              Side by <em className="accent-italic">side.</em>
            </h2>
            <FadeUp className="ntable compare__wrap" style={{ '--cols': pancakes.length + 1 }}>
              <div className="ntable__box">
                <div className="ntable__scroll" role="region" aria-labelledby="compare-title" tabIndex={0}>
                  <table>
                    <caption className="visually-hidden">Vanilla and chocolate pancake mixes, from each label</caption>
                    <thead>
                      <tr>
                        <th scope="col">Label detail</th>
                        {pancakes.map((p) => (
                          <th key={p.slug} scope="col" style={{ '--p-bg': p.theme.background }} className="compare__head">
                            <Link to={productPath(p)} className="link-line">
                              {p.shortName}
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {ROWS.map(([label, get]) => (
                        <tr key={label}>
                          <th scope="row">{label}</th>
                          {pancakes.map((p) => (
                            <td key={p.slug}>{get(p)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="ntable__note">
                Full nutrition tables, including the separate honey stick values, are on each product page.
              </p>
            </FadeUp>
          </div>
        </section>
      )}

      {first && (
        <div
          style={{
            '--p-bg': first.theme.background,
            '--p-strong': first.theme.strong,
            '--p-accent': first.theme.accent,
            '--p-highlight': first.theme.highlight,
          }}
        >
          <PreparationSteps
            product={first}
            title="One method for both"
            intro="The vanilla and chocolate labels print the same six steps."
          />
        </div>
      )}

      <RelatedProducts products={others} title="Also in the collection" single />
    </>
  )
}
