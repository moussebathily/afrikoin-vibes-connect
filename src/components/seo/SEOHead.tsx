import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOHeadProps {
  title?: string
  description?: string
  image?: string
  type?: string
  noIndex?: boolean
}

const BASE_URL = 'https://www.afrikoin.online'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`
const SITE_NAME = 'AfriKoin'

const PAGE_META: Record<string, { title: string; description: string }> = {
  '/': { title: 'Accueil', description: 'La plateforme tout-en-un pour l\'Afrique. Achetez, vendez, trouvez des emplois et suivez l\'actualité.' },
  '/marketplace': { title: 'Marketplace', description: 'Découvrez des milliers de produits africains. Mode, artisanat, électronique et plus.' },
  '/jobs': { title: 'Emplois', description: 'Trouvez votre prochain emploi en Afrique. Des milliers d\'offres dans tous les secteurs.' },
  '/news': { title: 'Actualités', description: 'Suivez l\'actualité africaine en temps réel. Sport, culture, politique et économie.' },
  '/transport': { title: 'Transport', description: 'Réservez un trajet ou louez un véhicule partout en Afrique.' },
  '/wallet': { title: 'Portefeuille', description: 'Gérez vos paiements Mobile Money, Wave et Orange Money.' },
  '/messages': { title: 'Messages', description: 'Communiquez avec vos contacts et partenaires commerciaux.' },
  '/stations': { title: 'Stations-service', description: 'Trouvez les stations-service les plus proches avec les meilleurs prix.' },
  '/culture': { title: 'Culture', description: 'Explorez la richesse culturelle africaine : musique, cinéma, art et traditions.' },
  '/sports': { title: 'Sports', description: 'Suivez les compétitions sportives africaines en direct.' },
}

export function SEOHead({ title, description, image, type = 'website', noIndex }: SEOHeadProps) {
  const { pathname } = useLocation()

  useEffect(() => {
    const pageMeta = PAGE_META[pathname]
    const pageTitle = title || pageMeta?.title
    const pageDesc = description || pageMeta?.description || 'AfriKoin - Marketplace Panafricain'
    const pageImage = image || DEFAULT_IMAGE
    const fullTitle = pageTitle ? `${pageTitle} | ${SITE_NAME}` : `${SITE_NAME} - Marketplace Panafricain`
    const canonicalUrl = `${BASE_URL}${pathname}`

    document.title = fullTitle

    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('name', 'description', pageDesc)
    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', pageDesc)
    setMeta('property', 'og:image', pageImage)
    setMeta('property', 'og:url', canonicalUrl)
    setMeta('property', 'og:type', type)
    setMeta('name', 'twitter:title', fullTitle)
    setMeta('name', 'twitter:description', pageDesc)
    setMeta('name', 'twitter:image', pageImage)

    if (noIndex) {
      setMeta('name', 'robots', 'noindex, nofollow')
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [pathname, title, description, image, type, noIndex])

  return null
}
