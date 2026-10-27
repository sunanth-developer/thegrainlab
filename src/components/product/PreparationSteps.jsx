import Img from '../Img/Img.jsx'
import ProductSection from './ProductSection.jsx'

export default function PreparationSteps({ product, id = 'preparation', title = 'How to prepare', intro }) {
  const { steps, panel } = product.preparation
  return (
    <ProductSection id={id} label="Preparation" title={title} intro={intro} tone="theme">
      <div className="prep">
        <ol className="prep__steps">
          {steps.map((step, i) => (
            <li key={step.text} className="prep__step">
              <span className="prep__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <p className="prep__text">
                <span className="visually-hidden">Step {i + 1}: </span>
                {step.text}
              </p>
              {step.time && <span className="prep__time">{step.time}</span>}
            </li>
          ))}
        </ol>
        {panel && (
          <figure className="prep__panel">
            <Img imageKey={panel} ratio="native" fit="contain" placeholder={false} sizes="(min-width: 900px) 34vw, 100vw" />
            <figcaption>The preparation panel as printed on the pack.</figcaption>
          </figure>
        )}
      </div>
    </ProductSection>
  )
}
