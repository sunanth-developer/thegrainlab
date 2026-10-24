import { useCallback, useState } from 'react'
import { getImage, imageSrc } from '../../data/images.js'
import './Img.css'

/**
 * Manifest-driven responsive image.
 * - `ratio`: CSS aspect-ratio string, 'native' (from the manifest) or 'fill'
 *   (the parent controls the size).
 * - Shows the image's dominant colour while loading and a designed fallback if
 *   the file fails, so there is never an empty box.
 */
export default function Img({
  imageKey,
  sizes = '100vw',
  ratio = 'native',
  position = 'center',
  priority = false,
  className = '',
  fallbackLabel,
  alt,
}) {
  const image = getImage(imageKey)
  const [status, setStatus] = useState('loading')

  const ref = useCallback((node) => {
    if (node?.complete) setStatus(node.naturalWidth ? 'loaded' : 'error')
  }, [setStatus])

  const aspectRatio =
    ratio === 'fill' ? undefined : ratio === 'native' && image ? `${image.width} / ${image.height}` : ratio

  const classes = ['img', `is-${image ? status : 'error'}`, ratio === 'fill' && 'img--fill', className]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} style={{ aspectRatio, backgroundColor: image?.color }}>
      {image && status !== 'error' && (
        <img
          ref={ref}
          src={imageSrc(imageKey)}
          srcSet={image.widths.map((w) => `${imageSrc(imageKey, w)} ${w}w`).join(', ')}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={alt ?? image.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          style={{ objectPosition: position }}
        />
      )}
      {(!image || status === 'error') && (
        <div className="img__fallback" role={alt === '' ? undefined : 'img'} aria-label={alt ?? image?.alt ?? fallbackLabel}>
          <span className="img__kernel" aria-hidden="true" />
          {fallbackLabel && <span className="img__fallback-label">{fallbackLabel}</span>}
        </div>
      )}
    </div>
  )
}
