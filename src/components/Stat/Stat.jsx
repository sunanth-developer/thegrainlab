import './Stat.css'

/**
 * A label figure, always rendered with its basis (e.g. "14g+ / protein per
 * 75 g serving") so a quantity never appears without its serving reference.
 */
export default function Stat({ stat, size = 'md', className = '' }) {
  return (
    <p className={`stat stat--${size} ${className}`}>
      <span className="stat__value">{stat.value}</span>
      <span className="stat__label">
        {stat.label}
        <span className="stat__basis">{stat.basis}</span>
      </span>
    </p>
  )
}
