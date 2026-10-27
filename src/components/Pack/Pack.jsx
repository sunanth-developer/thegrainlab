import Img from '../Img/Img.jsx'
import './Pack.css'

/**
 * The real product pouch, cut out from the photographs in the product's label
 * PDF. `view="back"` shows the reverse of the pouch.
 */
export default function Pack({
  product,
  view = 'front',
  tilt = 0,
  className = '',
  sizes = '(min-width: 900px) 240px, 40vw',
  priority,
}) {
  const key = view === 'back' ? product.images.pouchBack : product.images.pouch
  return (
    <figure className={`pack ${className}`} style={{ '--pack-tilt': `${tilt}deg` }}>
      <Img
        imageKey={key}
        ratio="native"
        fit="contain"
        placeholder={false}
        sizes={sizes}
        priority={priority}
        alt={`${view === 'back' ? 'Back' : 'Front'} of the ${product.name} pack`}
        fallbackLabel={product.name}
      />
    </figure>
  )
}
