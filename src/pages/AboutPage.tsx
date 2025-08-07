import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PlayCircle, Users, Music2, Wand2, Smile, Scissors, Sparkles, Clapperboard } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AboutPage() {
  const { t } = useTranslation()

  // SEO: title, meta description, canonical
  useEffect(() => {
    const title = 'Découvrir Afrikoin – communauté vidéo'
    document.title = title

    const desc = t('marketing.hero.subtitle') as string
    const metaName = 'description'
    let meta = document.querySelector(`meta[name="${metaName}"]`)
    if (!meta) {
      meta = document.createElement('meta')
      meta.setAttribute('name', metaName)
      document.head.appendChild(meta)
    }
    meta.setAttribute('content', (desc || '').slice(0, 155))

    const canonicalHref = `${window.location.origin}/about`
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = canonicalHref
  }, [t])

  const features = useMemo(() => ([
    { icon: PlayCircle, title: t('marketing.features.watch.title'), desc: t('marketing.features.watch.desc') },
    { icon: Users, title: t('marketing.features.community.title'), desc: t('marketing.features.community.desc') },
    { icon: Music2, title: t('marketing.features.music.title'), desc: t('marketing.features.music.desc') },
    { icon: Smile, title: t('marketing.features.stickers.title'), desc: t('marketing.features.stickers.desc') },
    { icon: Scissors, title: t('marketing.features.editing.title'), desc: t('marketing.features.editing.desc') },
    { icon: Sparkles, title: t('marketing.features.livefilters.title'), desc: t('marketing.features.livefilters.desc') },
    { icon: Clapperboard, title: t('marketing.features.variety.title'), desc: t('marketing.features.variety.desc') },
  ]), [t])

  const explore = t('marketing.explore.items', { returnObjects: true }) as string[]
  const connect = t('marketing.connect.items', { returnObjects: true }) as string[]
  const share = t('marketing.share.items', { returnObjects: true }) as string[]

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t('marketing.hero.title')}</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t('marketing.hero.subtitle')}</p>
      </header>

      <main>
        {/* Feature grid */}
        <section className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, desc }, idx) => (
            <article key={idx} className="rounded-lg border bg-card text-card-foreground p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-md bg-muted/60 p-2">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold leading-none mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Explore / Connect / Share */}
        <section className="mt-10 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">{t('marketing.explore.title')}</h2>
            <ul className="list-disc ms-5 text-muted-foreground space-y-1">
              {explore?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">{t('marketing.connect.title')}</h2>
            <ul className="list-disc ms-5 text-muted-foreground space-y-1">
              {connect?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">{t('marketing.share.title')}</h2>
            <ul className="list-disc ms-5 text-muted-foreground space-y-1">
              {share?.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTAs */}
        <section className="mt-10 flex items-center justify-center gap-3">
          <Button asChild size="lg">
            <a href="/ai-studio" aria-label={t('marketing.cta.create') as string}>{t('marketing.cta.create')}</a>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <a href="/ai-studio" aria-label={t('marketing.cta.aiStudio') as string}>{t('marketing.cta.aiStudio')}</a>
          </Button>
        </section>
      </main>
    </div>
  )
}

export default AboutPage
