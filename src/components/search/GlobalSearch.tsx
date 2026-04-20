import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Search, X, ShoppingBag, Briefcase, Fuel, Command } from 'lucide-react'
import Fuse from 'fuse.js'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useTranslation } from 'react-i18next'

interface SearchResult {
  id: string
  title: string
  type: 'product' | 'job' | 'station'
  subtitle?: string
}

interface RawIndex {
  products: any[]
  jobs: any[]
  stations: any[]
}

const RECENT_KEY = 'afrikoin:recent-searches'

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const [recents, setRecents] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const indexRef = useRef<RawIndex | null>(null)
  const fetchedAtRef = useRef<number>(0)
  const navigate = useNavigate()
  const { t } = useTranslation()

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY)
      if (stored) setRecents(JSON.parse(stored).slice(0, 5))
    } catch {}
  }, [])

  // Cmd/Ctrl+K shortcut + Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Prefetch index when opened (cache 60s)
  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const fresh = Date.now() - fetchedAtRef.current < 60_000
    if (fresh && indexRef.current) return

    ;(async () => {
      setLoading(true)
      const [products, jobs, stations] = await Promise.allSettled([
        (supabase as any).from('products')
          .select('id, title, description, category, country, price, currency')
          .eq('is_active', true).limit(200),
        (supabase as any).from('jobs')
          .select('id, title, company, description, location, category')
          .eq('is_active', true).limit(200),
        (supabase as any).from('stations')
          .select('id, name, brand, city, country, address').limit(200),
      ])

      indexRef.current = {
        products: products.status === 'fulfilled' ? (products.value.data || []) : [],
        jobs: jobs.status === 'fulfilled' ? (jobs.value.data || []) : [],
        stations: stations.status === 'fulfilled' ? (stations.value.data || []) : [],
      }
      fetchedAtRef.current = Date.now()
      setLoading(false)
    })()
  }, [open])

  // Fuse instances
  const fuses = useMemo(() => {
    const data = indexRef.current
    if (!data) return null
    return {
      products: new Fuse(data.products, {
        keys: ['title', 'description', 'category', 'country'],
        threshold: 0.4, includeScore: true,
      }),
      jobs: new Fuse(data.jobs, {
        keys: ['title', 'company', 'description', 'location', 'category'],
        threshold: 0.4, includeScore: true,
      }),
      stations: new Fuse(data.stations, {
        keys: ['name', 'brand', 'city', 'country', 'address'],
        threshold: 0.4, includeScore: true,
      }),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, open])

  // Run fuzzy search
  useEffect(() => {
    if (!query.trim() || query.length < 2 || !fuses) {
      setResults([])
      setActiveIdx(0)
      return
    }
    const merged: Array<SearchResult & { score: number }> = []

    fuses.products.search(query).slice(0, 6).forEach((r) => {
      const p = r.item
      merged.push({
        id: p.id, title: p.title, type: 'product',
        subtitle: `${p.price ?? ''} ${p.currency || 'XOF'}`.trim(),
        score: r.score ?? 1,
      })
    })
    fuses.jobs.search(query).slice(0, 6).forEach((r) => {
      const j = r.item
      merged.push({
        id: j.id, title: j.title, type: 'job',
        subtitle: [j.company, j.location].filter(Boolean).join(' • '),
        score: r.score ?? 1,
      })
    })
    fuses.stations.search(query).slice(0, 4).forEach((r) => {
      const s = r.item
      merged.push({
        id: s.id, title: s.name, type: 'station',
        subtitle: [s.brand, s.city].filter(Boolean).join(' • '),
        score: r.score ?? 1,
      })
    })

    merged.sort((a, b) => a.score - b.score)
    setResults(merged.slice(0, 12))
    setActiveIdx(0)
  }, [query, fuses])

  const persistRecent = (q: string) => {
    const next = [q, ...recents.filter((r) => r !== q)].slice(0, 5)
    setRecents(next)
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
  }

  const handleSelect = (result: SearchResult) => {
    persistRecent(query)
    setOpen(false)
    setQuery('')
    if (result.type === 'product') navigate(`/product/${result.id}`)
    else if (result.type === 'job') navigate(`/jobs/${result.id}`)
    else navigate('/stations')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[activeIdx]) {
      e.preventDefault()
      handleSelect(results[activeIdx])
    }
  }

  const typeIcon = (type: SearchResult['type']) => {
    if (type === 'product') return <ShoppingBag className="h-4 w-4 text-primary" />
    if (type === 'job') return <Briefcase className="h-4 w-4 text-accent-foreground" />
    return <Fuel className="h-4 w-4 text-muted-foreground" />
  }

  const typeLabel = (type: SearchResult['type']) => {
    if (type === 'product') return 'Produit'
    if (type === 'job') return 'Emploi'
    return 'Station'
  }

  // Group results by type for cleaner UI
  const grouped = useMemo(() => {
    const g: Record<SearchResult['type'], SearchResult[]> = { product: [], job: [], station: [] }
    results.forEach((r) => g[r.type].push(r))
    return g
  }, [results])

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={t('navigation.search')}
        className="hover:bg-primary/10 hover:text-primary rounded-xl"
        title="Rechercher (Ctrl+K)"
      >
        <Search className="h-5 w-5" />
      </Button>
    )
  }

  let flatIdx = -1

  return (
    <div
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md pt-safe-top animate-in fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="container max-w-2xl mx-auto px-4 pt-8 sm:pt-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-card border border-border/50 rounded-2xl shadow-elegant overflow-hidden">
          <div className="flex items-center gap-2 p-3 border-b border-border/50">
            <Search className="h-5 w-5 text-muted-foreground ml-2" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher produits, emplois, stations…"
              className="border-0 bg-transparent focus-visible:ring-0 text-base"
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] text-muted-foreground bg-muted/50 rounded">
              <Command className="h-3 w-3" />K
            </kbd>
            <Button variant="ghost" size="icon" onClick={() => { setOpen(false); setQuery('') }}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {loading && !indexRef.current && (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 bg-gradient-primary rounded-lg animate-pulse" />
              </div>
            )}

            {!query && recents.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground mb-2 px-2">Recherches récentes</p>
                {recents.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQuery(r)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 text-sm flex items-center gap-2"
                  >
                    <Search className="h-3 w-3 text-muted-foreground" />
                    {r}
                  </button>
                ))}
              </div>
            )}

            {results.length > 0 && (
              <div className="space-y-3">
                {(['product', 'job', 'station'] as const).map((type) => {
                  if (grouped[type].length === 0) return null
                  return (
                    <div key={type}>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground px-3 py-1">
                        {typeLabel(type)}s
                      </p>
                      {grouped[type].map((r) => {
                        flatIdx++
                        const isActive = flatIdx === activeIdx
                        return (
                          <button
                            key={`${r.type}-${r.id}`}
                            onClick={() => handleSelect(r)}
                            onMouseEnter={() => setActiveIdx(flatIdx)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                              isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                            }`}
                          >
                            {typeIcon(r.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{r.title}</p>
                              {r.subtitle && (
                                <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                              )}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">
                Aucun résultat pour « {query} »
              </p>
            )}
          </div>

          <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-border/50 text-[11px] text-muted-foreground bg-muted/20">
            <div className="flex items-center gap-3">
              <span><kbd className="px-1.5 py-0.5 bg-background rounded border">↑↓</kbd> Naviguer</span>
              <span><kbd className="px-1.5 py-0.5 bg-background rounded border">↵</kbd> Ouvrir</span>
              <span><kbd className="px-1.5 py-0.5 bg-background rounded border">Esc</kbd> Fermer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
