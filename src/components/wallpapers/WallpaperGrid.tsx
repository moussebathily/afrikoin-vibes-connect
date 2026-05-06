import React from 'react'
import { Heart, Download, Play, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { OptimizedImage } from '@/components/ui/optimized-image'
import type { Wallpaper } from '@/pages/WallpapersPage'

interface WallpaperGridProps {
  wallpapers: Wallpaper[]
  loading: boolean
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  onPreview: (w: Wallpaper) => void
  onDownload: (w: Wallpaper) => void
}

export function WallpaperGrid({ wallpapers, loading, favorites, onToggleFavorite, onPreview, onDownload }: WallpaperGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[9/16] rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (!wallpapers.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">Aucun fond d'écran trouvé</p>
        <p className="text-sm mt-1">Soyez le premier à en publier !</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {wallpapers.map(w => {
        const isFav = favorites.has(w.id)
        return (
          <div
            key={w.id}
            className="relative group aspect-[9/16] rounded-xl overflow-hidden bg-muted cursor-pointer"
            onClick={() => onPreview(w)}
          >
            {w.media_type === 'video' ? (
              <>
                <video src={w.file_url} className="w-full h-full object-cover" muted preload="metadata" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center">
                    <Play className="h-5 w-5 text-foreground fill-foreground" />
                  </div>
                </div>
              </>
            ) : (
              <OptimizedImage src={w.file_url} alt={w.title} sizes="(max-width:768px) 50vw, 25vw" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Actions */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(w.id) }}
                className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <Heart className={cn("h-4 w-4", isFav ? "fill-red-500 text-red-500" : "text-foreground")} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDownload(w) }}
                className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <Download className="h-4 w-4 text-foreground" />
              </button>
            </div>

            {/* Title */}
            <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium truncate">{w.title}</p>
              {w.wallpaper_categories && (
                <span className="text-white/70 text-[10px]">{w.wallpaper_categories.name}</span>
              )}
            </div>

            {/* Category badge */}
            {w.media_type === 'video' && (
              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-primary/80 text-primary-foreground rounded text-[10px] font-medium">
                Vidéo
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
