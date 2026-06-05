// Generates public/sitemap.xml and public/sitemap-news.xml.
// Runs in `predev` and `prebuild`. Falls back gracefully if Supabase is unreachable.
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE_URL = 'https://afrikoin.online'
const SUPABASE_URL = 'https://diglkmdsxpfimylshnmc.supabase.co'
const SUPABASE_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpZ2xrbWRzeHBmaW15bHNobm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNTU5OTIsImV4cCI6MjA5MDgzMTk5Mn0.u1ViCxg73iNia35kYMFgSdybvyXqvaTpIo8WdS_dXQE'

const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/marketplace', changefreq: 'daily', priority: '0.9' },
  { path: '/culture', changefreq: 'daily', priority: '0.8' },
  { path: '/sports', changefreq: 'daily', priority: '0.8' },
  { path: '/markets', changefreq: 'daily', priority: '0.8' },
  { path: '/rankings', changefreq: 'weekly', priority: '0.7' },
  { path: '/wallet', changefreq: 'weekly', priority: '0.7' },
  { path: '/jobs', changefreq: 'daily', priority: '0.9' },
  { path: '/news', changefreq: 'hourly', priority: '0.9' },
  { path: '/tracking', changefreq: 'weekly', priority: '0.6' },
  { path: '/transport', changefreq: 'weekly', priority: '0.8' },
  { path: '/stations', changefreq: 'weekly', priority: '0.7' },
  { path: '/tabaski', changefreq: 'weekly', priority: '0.7' },
  { path: '/call', changefreq: 'monthly', priority: '0.5' },
  { path: '/fonds-ecran', changefreq: 'weekly', priority: '0.6' },
  { path: '/about', changefreq: 'monthly', priority: '0.5' },
  { path: '/aide', changefreq: 'weekly', priority: '0.9' },
  { path: '/aide/articles/eviter-arnaques', changefreq: 'monthly', priority: '0.8' },
  { path: '/aide/articles/paiement-mobile-money', changefreq: 'monthly', priority: '0.8' },
  { path: '/aide/articles/livraison', changefreq: 'monthly', priority: '0.8' },
  { path: '/aide/articles/retours', changefreq: 'monthly', priority: '0.8' },
  { path: '/aide/articles/vendre-en-confiance', changefreq: 'monthly', priority: '0.8' },
]

const escape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

async function fetchNews() {
  try {
    const url = `${SUPABASE_URL}/rest/v1/daily_news?select=id,title,published_at,created_at,image_url,source&order=published_at.desc&limit=1000`
    const res = await fetch(url, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch (e) {
    console.warn('[sitemap] news fetch failed, continuing without news entries:', e.message)
    return []
  }
}

function buildSitemap(news) {
  const urls = [
    ...STATIC_ROUTES.map(
      (r) =>
        `  <url><loc>${BASE_URL}${r.path}</loc><changefreq>${r.changefreq}</changefreq><priority>${r.priority}</priority></url>`
    ),
    ...news.map((n) => {
      const lastmod = (n.published_at || n.created_at || '').slice(0, 10)
      return `  <url><loc>${BASE_URL}/news/${n.id}</loc>${
        lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
      }<changefreq>weekly</changefreq><priority>0.7</priority></url>`
    }),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}

function buildNewsSitemap(news) {
  // Google News sitemap: only articles published in the last 48h
  const cutoff = Date.now() - 48 * 3600 * 1000
  const recent = news.filter((n) => {
    const d = new Date(n.published_at || n.created_at).getTime()
    return Number.isFinite(d) && d >= cutoff
  })
  const urls = recent.slice(0, 1000).map((n) => {
    const pub = new Date(n.published_at || n.created_at).toISOString()
    return `  <url>
    <loc>${BASE_URL}/news/${n.id}</loc>
    <news:news>
      <news:publication>
        <news:name>AfriKoin</news:name>
        <news:language>fr</news:language>
      </news:publication>
      <news:publication_date>${pub}</news:publication_date>
      <news:title>${escape(n.title)}</news:title>
    </news:news>${n.image_url ? `\n    <image:image><image:loc>${escape(n.image_url)}</image:loc></image:image>` : ''}
  </url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`
}

const news = await fetchNews()
writeFileSync(resolve('public/sitemap.xml'), buildSitemap(news))
writeFileSync(resolve('public/sitemap-news.xml'), buildNewsSitemap(news))
console.log(`[sitemap] wrote sitemap.xml (${STATIC_ROUTES.length} static + ${news.length} news) and sitemap-news.xml`)
