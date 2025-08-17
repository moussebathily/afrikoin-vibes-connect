import React, { useEffect, useState } from 'react'
import { Calendar, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { formatDate } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

// Independence dates for West African countries
const INDEPENDENCE_HOLIDAYS = [
  {
    id: 'niger',
    country: 'Niger',
    countryCode: 'NE',
    date: { month: 8, day: 3 }, // August 3, 1960
    nameKey: 'holidays.independence.niger',
    descriptionKey: 'holidays.independence.nigerDesc'
  },
  {
    id: 'burkina',
    country: 'Burkina Faso', 
    countryCode: 'BF',
    date: { month: 8, day: 5 }, // August 5, 1960
    nameKey: 'holidays.independence.burkina',
    descriptionKey: 'holidays.independence.burkinaDesc'
  },
  {
    id: 'mali',
    country: 'Mali',
    countryCode: 'ML', 
    date: { month: 9, day: 22 }, // September 22, 1960
    nameKey: 'holidays.independence.mali',
    descriptionKey: 'holidays.independence.maliDesc'
  }
]

const getNextIndependenceDay = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  
  const upcomingHolidays = INDEPENDENCE_HOLIDAYS.map(holiday => {
    let holidayDate = new Date(currentYear, holiday.date.month - 1, holiday.date.day)
    
    // If the holiday has passed this year, use next year's date
    if (holidayDate < now) {
      holidayDate = new Date(currentYear + 1, holiday.date.month - 1, holiday.date.day)
    }
    
    return {
      ...holiday,
      actualDate: holidayDate,
      daysUntil: Math.ceil((holidayDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }
  })
  
  // Sort by closest date
  upcomingHolidays.sort((a, b) => a.daysUntil - b.daysUntil)
  
  return upcomingHolidays[0]
}

interface Holiday {
  id: string
  name: string
  date: string
  country: string
  description?: string
  is_national: boolean
  daysUntil?: number
  type?: string
  countryCode?: string
}

export function FestivalBanner() {
  const [currentHoliday, setCurrentHoliday] = useState<Holiday | null>(null)
  const { t } = useTranslation()

  const fetchUpcomingHoliday = React.useCallback(async () => {
    try {
      const nextHoliday = getNextIndependenceDay()
      
      const holiday = {
        id: nextHoliday.id,
        name: t(nextHoliday.nameKey),
        description: t(nextHoliday.descriptionKey),
        date: nextHoliday.actualDate.toISOString().split('T')[0],
        type: 'national',
        country: nextHoliday.country,
        countryCode: nextHoliday.countryCode,
        daysUntil: nextHoliday.daysUntil,
        is_national: true
      }
      
      setCurrentHoliday(holiday)
    } catch (error) {
      console.error('Error fetching holidays:', error)
    }
  }, [t])

  useEffect(() => {
    fetchUpcomingHoliday()
  }, [fetchUpcomingHoliday])

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
              {currentHoliday.daysUntil === 0 
                ? t('holidays.today')
                : currentHoliday.daysUntil === 1
                ? t('holidays.tomorrow') 
                : `${currentHoliday.daysUntil} ${t('holidays.daysLeft')}`
              }
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