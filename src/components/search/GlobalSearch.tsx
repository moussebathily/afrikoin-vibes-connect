import React, { useState, useEffect, useRef } from 'react'
import { Search, X, ShoppingBag, Briefcase, MapPin, Fuel } from 'lucide-react'
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

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      return
    }

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const [products, jobs, stations] = await Promise.allSettled([
          supabase.from('products').select('id, title, price, currency').ilike('title', `%${query}%`).limit(5),
          supabase.from('jobs').select('id, title, company, location').ilike('title', `%${query}%`).limit(5),
          supabase.from('stations').select('id, name, city, brand').ilike('name', `%${query}%`).limit(3),
        ])

        const merged: SearchResult[] = []

        if (products.status === 'fulfilled' && products.value.data) {
          products.value.data.forEach((p: any) =>
            merged.push({ id: p.id, title: p.title, type: 'product', subtitle: `${p.price} ${p.currency || 'XOF'}` })
          )
        }
        if (jobs.status === 'fulfilled' && jobs.value.data) {
          jobs.value.data.forEach((j: any) =>
            merged.push({ id: j.id, title: j.title, type: 'job', subtitle: j.company || j.location })
          )
        }
        if (stations.status === 'fulfilled' && stations.value.data) {
          stations.value.data.forEach((s: any) =>
            merged.push({ id: s.id, title: s.name, type: 'station', subtitle: s.city || s.brand })
          )
        }

        setResults(merged)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(debounceRef.current)
  }, [query])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleSelect = (result: SearchResult) => {
    setOpen(false)
    setQuery('')
    if (result.type === 'product') navigate(`/product/${result.id}`)
    else if (result.type === 'job') navigate(`/jobs/${result.id}`)
    else navigate('/stations')
  }

  const typeIcon = (type: SearchResult['type']) => {
    if (type === 'product') return <ShoppingBag className="h-4 w-4 text-primary" />
    if (type === 'job') return <Briefcase className="h-4 w-4 text-accent-foreground" />
    return <Fuel className="h-4 w-4 text-muted-foreground" />
  }

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label={t('navigation.search')}
        className="hover:bg-primary/10 hover:text-primary rounded-xl"
      >
        <Search className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm pt-safe-top">
      <div className="container max-w-lg mx-auto px-4 pt-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher produits, emplois, stations..."
              className="pl-10 rounded-xl"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => { setOpen(false); setQuery('') }}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 bg-gradient-primary rounded-lg animate-pulse" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-1">
            {results.map((r) => (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
              >
                {typeIcon(r.type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  {r.subtitle && <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>}
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && query.length >= 2 && results.length === 0 && (
          <p className="text-center text-muted-foreground py-8 text-sm">Aucun résultat pour « {query} »</p>
        )}
      </div>
    </div>
  )
}
