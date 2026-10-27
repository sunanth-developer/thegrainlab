import Img from '../Img/Img.jsx'
import MaskReveal from '../motion/MaskReveal.jsx'
import ProductSection from './ProductSection.jsx'

export default function ServingSuggestion({ product }) {
  const { serving, images, accompaniment } = product
  return (
    <ProductSection id="serving" label="Serving" title="Serving suggestion">
      <div className="serve">
        <blockquote className="serve__quote">
          <p>{serving.text}</p>
          <footer>{serving.source}.</footer>
        </blockquote>
        <div className="serve__images">
          <MaskReveal className="serve__photo serve__photo--main">
            <Img imageKey={images.food} ratio="4 / 5" sizes="(min-width: 900px) 30vw, 60vw" />
          </MaskReveal>
          <figure className="serve__photo serve__photo--side">
            <MaskReveal delay={0.15}>
              <Img imageKey={images.accompaniment} ratio="1 / 1" sizes="(min-width: 900px) 20vw, 40vw" />
            </MaskReveal>
            <figcaption>
              {accompaniment.name}: {accompaniment.amount}, in the pack
            </figcaption>
          </figure>
        </div>
      </div>
      <p className="psec__fineprint">Photography shows serving suggestions and is illustrative.</p>
    </ProductSection>
  )
}
