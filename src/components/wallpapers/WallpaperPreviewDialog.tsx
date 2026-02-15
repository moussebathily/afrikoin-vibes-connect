import React from 'react'
import { X, Heart, Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Wallpaper } from '@/pages/WallpapersPage'

interface Props {
  wallpaper: Wallpaper
  isFavorite: boolean
  onClose: () => void
  onToggleFavorite: () => void
  onDownload: () => void
}

export function WallpaperPreviewDialog({ wallpaper, isFavorite, onClose, onToggleFavorite, onDownload }: Props) {
  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col" onClick={onClose}>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onClose} className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
          <X className="h-5 w-5 text-white" />
        </button>
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Heart className={cn("h-5 w-5", isFavorite ? "fill-red-500 text-red-500" : "text-white")} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDownload() }}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Download className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center" onClick={e => e.stopPropagation()}>
        {wallpaper.media_type === 'video' ? (
          <video
            src={wallpaper.file_url}
            className="max-w-full max-h-full object-contain"
            controls
            autoPlay
          />
        ) : (
          <img
            src={wallpaper.file_url}
            alt={wallpaper.title}
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <h3 className="text-white font-semibold">{wallpaper.title}</h3>
        {wallpaper.description && <p className="text-white/70 text-sm mt-1">{wallpaper.description}</p>}
        {wallpaper.wallpaper_categories && (
          <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-white text-xs">
            {wallpaper.wallpaper_categories.name}
          </span>
        )}
      </div>
    </div>
  )
}
