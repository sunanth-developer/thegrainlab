import { useParams } from 'react-router-dom'
import PageMeta from '../components/PageMeta/PageMeta.jsx'
import ProductHero from '../components/product/ProductHero.jsx'
import SectionNav from '../components/product/SectionNav.jsx'
import ProductHighlights from '../components/product/ProductHighlights.jsx'
import IngredientStory from '../components/product/IngredientStory.jsx'
import NutritionPanel from '../components/product/NutritionPanel.jsx'
import PreparationSteps from '../components/product/PreparationSteps.jsx'
import ServingSuggestion from '../components/product/ServingSuggestion.jsx'
import StorageInfo from '../components/product/StorageInfo.jsx'
import RelatedProducts from '../components/product/RelatedProducts.jsx'
import NotFound from './NotFound.jsx'
import { imageSrc } from '../data/images.js'
import { getProduct, getRelated, proteinText } from '../lib/catalogue.js'
import '../components/product/product.css'
import './pages.css'

/** One template, each product's own data: overview → highlights → ingredients → nutrition → preparation → serving → storage. */
export default function ProductPage() {
  const { slug } = useParams()
  const product = getProduct(slug)
  if (!product) return <NotFound />

  const { theme } = product
  return (
    <div
      className="pdp"
      style={{
        '--p-bg': theme.background,
        '--p-deep': theme.deep,
        '--p-strong': theme.strong,
        '--p-ink': theme.ink,
        '--p-accent': theme.accent,
        '--p-highlight': theme.highlight,
      }}
    >
      <PageMeta
        title={product.name}
        description={`${product.description} ${proteinText(product)}. Ingredients, allergens, nutrition, preparation and storage.`}
        image={imageSrc(product.images.pouch)}
      />
      <ProductHero product={product} />
      <SectionNav label={`${product.name} sections`} />
      <ProductHighlights product={product} />
      <IngredientStory product={product} />
      <NutritionPanel product={product} />
      <PreparationSteps product={product} />
      <ServingSuggestion product={product} />
      <StorageInfo product={product} />
      <RelatedProducts products={getRelated(product)} />
    </div>
  )
}
