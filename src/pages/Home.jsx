import PageMeta from '../components/PageMeta/PageMeta.jsx'
import Hero from '../sections/Hero/Hero.jsx'
import LaunchCollection from '../sections/LaunchCollection/LaunchCollection.jsx'
import RangeHighlights from '../sections/RangeHighlights/RangeHighlights.jsx'
import PrepPreview from '../sections/PrepPreview/PrepPreview.jsx'
import ProductIndex from '../sections/ProductIndex/ProductIndex.jsx'
import FinalCta from '../sections/FinalCta/FinalCta.jsx'

/**
 * Homepage, one purpose per section:
 * brand → the three products → how they differ → how to prepare →
 * where to find the full label details → one closing call to action.
 */
export default function Home() {
  return (
    <>
      <PageMeta description="Vanilla and Chocolate Protein Pancake Mixes with an 8 g honey stick, and a Millet Idli Mix with its own tomato chutney mix." />
      <Hero />
      <LaunchCollection />
      <RangeHighlights />
      <PrepPreview />
      <ProductIndex />
      <FinalCta />
    </>
  )
}
