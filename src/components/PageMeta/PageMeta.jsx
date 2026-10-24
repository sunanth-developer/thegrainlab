const SITE = 'The Grain Lab'

/** React 19 hoists these tags into <head>. */
export default function PageMeta({ title, description, image, noindex = false }) {
  const fullTitle = title ? `${title} — ${SITE}` : `${SITE} — Millet flours, mixes, pasta & breakfast`
  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {noindex && <meta name="robots" content="noindex" />}
    </>
  )
}
