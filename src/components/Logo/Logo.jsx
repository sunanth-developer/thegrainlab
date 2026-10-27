import { Link } from 'react-router-dom'
import { getImage, imageSrc, imageSrcSet } from '../../data/images.js'
import './Logo.css'

/**
 * The Grain Lab logo, extracted from the brand deck.
 * - variant 'mark': logo without the tagline (header)
 * - variant 'full': logo with "From forgotten to future"
 * - variants 'mark-light' / 'light': the same, recoloured for dark surfaces
 */
const KEYS = { mark: 'logo-mark', 'mark-light': 'logo-mark-light', full: 'logo', light: 'logo-light' }

export function LogoImage({ variant = 'mark', className = '', sizes = '160px', alt }) {
  const key = KEYS[variant]
  const image = getImage(key)
  if (!image) return <span className={`logo-fallback ${className}`}>The Grain Lab</span>
  return (
    <img
      className={`logo ${className}`}
      src={imageSrc(key, image.widths[1] ?? image.widths[0])}
      srcSet={imageSrcSet(key)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={alt ?? image.alt}
      decoding="async"
    />
  )
}

export default function Logo({ variant = 'mark', className = '', onClick }) {
  return (
    <Link to="/" className={`logo-link ${className}`} onClick={onClick} aria-label="The Grain Lab — home">
      <LogoImage variant={variant} alt="" />
    </Link>
  )
}
