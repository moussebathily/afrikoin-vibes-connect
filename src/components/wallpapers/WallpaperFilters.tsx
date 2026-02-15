import React from 'react'
import { cn } from '@/lib/utils'
import { Image, Video } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  color: string | null
}

interface WallpaperFiltersProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (cat: string) => void
  selectedType: string
  onTypeChange: (type: string) => void
}

export function WallpaperFilters({ categories, selectedCategory, onCategoryChange, selectedType, onTypeChange }: WallpaperFiltersProps) {
  const typeOptions = [
    { value: 'all', label: 'Tous', icon: null },
    { value: 'image', label: 'Images', icon: Image },
    { value: 'video', label: 'Vidéos', icon: Video },
  ]

  return (
    <div className="space-y-3">
      {/* Type filter */}
      <div className="flex gap-2">
        {typeOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => onTypeChange(opt.value)}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              selectedType === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.icon && <opt.icon className="h-3 w-3" />}
            {opt.label}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => onCategoryChange('all')}
          className={cn(
            "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
            selectedCategory === 'all'
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Toutes
        </button>
        {categories.map(cat => (
          <button
            key={cat.slug}
            onClick={() => onCategoryChange(cat.slug)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
              selectedCategory === cat.slug
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
