import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { WallpaperGrid } from '@/components/wallpapers/WallpaperGrid'
import { WallpaperUploadDialog } from '@/components/wallpapers/WallpaperUploadDialog'
import { WallpaperPreviewDialog } from '@/components/wallpapers/WallpaperPreviewDialog'
import { WallpaperFilters } from '@/components/wallpapers/WallpaperFilters'
import { Button } from '@/components/ui/button'
import { Upload, ImageIcon } from 'lucide-react'

interface WallpaperCategory {
  id: string
  name: string
  slug: string
  icon: string | null
  color: string | null
}

export interface Wallpaper {
  id: string
  user_id: string
  title: string
  description: string | null
  file_url: string
  thumbnail_url: string | null
  category_id: string | null
  media_type: string
  width: number | null
  height: number | null
  download_count: number
  favorites_count: number
  created_at: string
  wallpaper_categories?: WallpaperCategory | null
}

export default function WallpapersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [categories, setCategories] = useState<WallpaperCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showUpload, setShowUpload] = useState(false)
  const [previewWallpaper, setPreviewWallpaper] = useState<Wallpaper | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCategories()
    fetchWallpapers()
    if (user) fetchFavorites()
  }, [selectedCategory, selectedType, user])

  async function fetchCategories() {
    const { data } = await supabase
      .from('wallpaper_categories')
      .select('*')
      .order('order_index')
    if (data) setCategories(data)
  }

  async function fetchWallpapers() {
    setLoading(true)
    let query = supabase
      .from('wallpapers')
      .select('*, wallpaper_categories(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (selectedCategory !== 'all') {
      const cat = categories.find(c => c.slug === selectedCategory)
      if (cat) query = query.eq('category_id', cat.id)
    }
    if (selectedType !== 'all') {
      query = query.eq('media_type', selectedType)
    }

    const { data, error } = await query
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' })
    } else {
      setWallpapers(data || [])
    }
    setLoading(false)
  }

  async function fetchFavorites() {
    if (!user) return
    const { data } = await supabase
      .from('wallpaper_favorites')
      .select('wallpaper_id')
      .eq('user_id', user.id)
    if (data) setFavorites(new Set(data.map(f => f.wallpaper_id)))
  }

  async function toggleFavorite(wallpaperId: string) {
    if (!user) return
    const isFav = favorites.has(wallpaperId)
    if (isFav) {
      await supabase.from('wallpaper_favorites').delete().eq('user_id', user.id).eq('wallpaper_id', wallpaperId)
      setFavorites(prev => { const n = new Set(prev); n.delete(wallpaperId); return n })
    } else {
      await supabase.from('wallpaper_favorites').insert({ user_id: user.id, wallpaper_id: wallpaperId })
      setFavorites(prev => new Set(prev).add(wallpaperId))
    }
  }

  async function handleDownload(wallpaper: Wallpaper) {
    const link = document.createElement('a')
    link.href = wallpaper.file_url
    link.download = wallpaper.title
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    await supabase.from('wallpapers').update({ download_count: (wallpaper.download_count || 0) + 1 }).eq('id', wallpaper.id)
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Fonds d'Écran HD 4K</h1>
        </div>
        <Button size="sm" onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4 mr-1" />
          Publier
        </Button>
      </div>

      <WallpaperFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <WallpaperGrid
        wallpapers={wallpapers}
        loading={loading}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onPreview={setPreviewWallpaper}
        onDownload={handleDownload}
      />

      <WallpaperUploadDialog
        open={showUpload}
        onOpenChange={setShowUpload}
        categories={categories}
        onUploaded={() => { setShowUpload(false); fetchWallpapers() }}
      />

      {previewWallpaper && (
        <WallpaperPreviewDialog
          wallpaper={previewWallpaper}
          isFavorite={favorites.has(previewWallpaper.id)}
          onClose={() => setPreviewWallpaper(null)}
          onToggleFavorite={() => toggleFavorite(previewWallpaper.id)}
          onDownload={() => handleDownload(previewWallpaper)}
        />
      )}
    </div>
  )
}
