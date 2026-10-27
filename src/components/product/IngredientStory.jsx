import ProductSection from './ProductSection.jsx'
import IngredientExplorer from '../IngredientExplorer/IngredientExplorer.jsx'
import IngredientComposition from './IngredientComposition.jsx'
import IngredientList from './IngredientList.jsx'

/**
 * The product page's one ingredients section: the visual story (explorer and
 * composition) first, then the full statement and allergens as printed.
 */
export default function IngredientStory({ product }) {
  const story = product.ingredientStory
  return (
    <ProductSection
      id="ingredients"
      label="Ingredients"
      title="Good things, ingredient by ingredient."
      intro="Explore what’s in the mix and the role each ingredient plays."
      layout="wide"
      className="istory"
    >
      {story && (
        <>
          <IngredientExplorer
            items={story.items}
            quantityLabel={story.quantityLabel}
            sourceNote={story.sourceNote}
            label={`${product.name} ingredients`}
          />
          <IngredientComposition story={story} />
        </>
      )}
      <IngredientList product={product} />
    </ProductSection>
  )
}
