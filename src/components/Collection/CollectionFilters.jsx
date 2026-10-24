import { useId } from 'react'
import { motion } from 'motion/react'
import { EASE } from '../../lib/motion.js'

function Chip({ active, onClick, children, group }) {
  return (
    <button type="button" className="chip" aria-pressed={active} onClick={onClick}>
      {active && (
        <motion.span
          layoutId={`chip-active-${group}`}
          className="chip__bg"
          transition={{ duration: 0.5, ease: EASE }}
          aria-hidden="true"
        />
      )}
      <span className="chip__label">{children}</span>
    </button>
  )
}

export default function CollectionFilters({ categories, category, onCategoryChange, query, onQueryChange, showSearch }) {
  const group = useId()

  return (
    <div className="collection-filters">
      <div className="collection-filters__chips" role="group" aria-label="Filter by category">
        <Chip group={group} active={!category} onClick={() => onCategoryChange('')}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip
            key={c.slug}
            group={group}
            active={category === c.slug}
            onClick={() => onCategoryChange(category === c.slug ? '' : c.slug)}
          >
            {c.name}
          </Chip>
        ))}
      </div>

      {showSearch && (
        <div className="collection-filters__search">
          <label htmlFor={`${group}-search`} className="visually-hidden">
            Search products
          </label>
          <input
            id={`${group}-search`}
            type="search"
            value={query}
            placeholder="Search products"
            autoComplete="off"
            onChange={(e) => onQueryChange(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
