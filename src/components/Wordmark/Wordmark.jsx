import { Link } from 'react-router-dom'
import './Wordmark.css'

/** THE GRAIN LAB lockup: small sans "THE", serif caps, a grain kernel as the joint. */
export function WordmarkType({ className = '' }) {
  return (
    <span className={`wordmark ${className}`} aria-hidden="true">
      <span className="wordmark__the">The</span>
      <span className="wordmark__main">
        Grain
        <span className="wordmark__kernel" />
        Lab
      </span>
    </span>
  )
}

export default function Wordmark({ className = '', onClick }) {
  return (
    <Link to="/" className={`wordmark-link ${className}`} aria-label="The Grain Lab — home" onClick={onClick}>
      <WordmarkType />
    </Link>
  )
}
