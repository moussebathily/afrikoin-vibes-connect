import { Helmet } from 'react-helmet-async'

interface EntitySEOProps {
  title: string
  description?: string
  image?: string
  url: string
  type?: 'website' | 'article' | 'product'
  jsonLd?: Record<string, any> | Record<string, any>[]
}

/**
 * Per-page SEO + Open Graph + JSON-LD overrides.
 * Helmet replaces the static index.html tags for JS-executing crawlers
 * (Googlebot, Twitterbot supports it for many sites).
 */
export function EntitySEO({
  title,
  description,
  image,
  url,
  type = 'website',
  jsonLd,
}: EntitySEOProps) {
  const fullTitle = `${title} | AfriKoin`
  const desc = description?.slice(0, 200)
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {desc && <meta name="description" content={desc} />}
      <link rel="canonical" href={url} />

      <meta property="og:title" content={fullTitle} />
      {desc && <meta property="og:description" content={desc} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}

      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      {desc && <meta name="twitter:description" content={desc} />}
      {image && <meta name="twitter:image" content={image} />}

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}
