import React, { useEffect, useState } from 'react'
import { Calendar, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { formatDate } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export function FestivalBanner() {
  const [currentHoliday, setCurrentHoliday] = useState<any>(null)
  const { t } = useTranslation()

  useEffect(() => {
    fetchUpcomingHoliday()
  }, [])

  const fetchUpcomingHoliday = async () => {
    try {
      // This would need to be implemented with proper holiday calculation
      // For now, showing a mock upcoming holiday
      const mockHoliday = {
        id: '1',
        name: 'Fête de l\'Indépendance du Sénégal',
        description: 'Célébration de l\'indépendance du Sénégal',
        date: '2024-04-04',
        type: 'national',
        countries: ['SN']
      }
      
      setCurrentHoliday(mockHoliday)
    } catch (error) {
      console.error('Error fetching holidays:', error)
    }
  }

  if (!currentHoliday) return null

  return (
    <div className="bg-gradient-accent rounded-xl p-4 text-accent-foreground">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-accent-foreground/20 rounded-full p-2">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{currentHoliday.name}</h3>
            <p className="text-xs text-accent-foreground/80">
              {formatDate(currentHoliday.date)}
            </p>
          </div>
        </div>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-accent-foreground/20 text-accent-foreground hover:bg-accent-foreground/30 border-0"
        >
          <Star className="h-4 w-4 mr-1" />
          {t('holidays.discover')}
        </Button>
      </div>
    </div>
  )
}