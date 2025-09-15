import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next'
import { Palette, Trophy, TrendingUp, Shield, Hash } from 'lucide-react'
import { ContentCategory } from '@/types/content'

interface CategoryTabsProps {
  categories: ContentCategory[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const getCategoryIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Palette':
      return Palette
    case 'Trophy':
      return Trophy
    case 'TrendingUp':
      return TrendingUp
    case 'Shield':
      return Shield
    default:
      return Hash
  }
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const { t } = useTranslation()

  return (
    <div className="w-full">
      <Tabs value={activeCategory} onValueChange={onCategoryChange} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1">
          {categories.filter(cat => cat.is_active).map((category) => {
            const IconComponent = getCategoryIcon(category.icon)
            return (
              <TabsTrigger
                key={category.slug}
                value={category.slug}
                className="flex flex-col items-center gap-1 py-3 data-[state=active]:text-primary"
              >
                <IconComponent className="h-4 w-4" />
                <span className="text-xs font-medium">{category.name}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>
    </div>
  )
}