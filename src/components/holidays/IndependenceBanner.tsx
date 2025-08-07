import React, { useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { CalendarDays, Sparkles } from 'lucide-react'

// Minimal independence dates map (month is 1-12)
const independenceMap: Record<string, { month: number; day: number }> = {
  senegal: { month: 4, day: 4 },
  mali: { month: 9, day: 22 },
  niger: { month: 8, day: 3 },
  'burkina faso': { month: 8, day: 5 },
  'côte d’ivoire': { month: 8, day: 7 },
  "cote d'ivoire": { month: 8, day: 7 },
  ghana: { month: 3, day: 6 },
  nigeria: { month: 10, day: 1 },
  kenya: { month: 12, day: 12 },
  uganda: { month: 10, day: 9 },
  tanzania: { month: 12, day: 9 },
  "tanzanie": { month: 12, day: 9 },
  "république démocratique du congo": { month: 6, day: 30 },
  drc: { month: 6, day: 30 },
  algeria: { month: 7, day: 5 },
  algérie: { month: 7, day: 5 },
  morocco: { month: 11, day: 18 },
  maroc: { month: 11, day: 18 },
  tunisia: { month: 3, day: 20 },
  tunisie: { month: 3, day: 20 },
  zambia: { month: 10, day: 24 },
  zimbabwe: { month: 4, day: 18 },
  mozambique: { month: 6, day: 25 },
  angola: { month: 11, day: 11 },
}

function normalize(text?: string) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
}

export const IndependenceBanner: React.FC = () => {
  const { profile } = useAuth()

  const isTodayIndependence = useMemo(() => {
    const country = normalize(profile?.country)
    if (!country) return false
    const entry = independenceMap[country]
    if (!entry) return false
    const now = new Date()
    return now.getMonth() + 1 === entry.month && now.getDate() === entry.day
  }, [profile?.country])

  if (!isTodayIndependence) return null

  return (
    <section className="rounded-xl p-4 bg-gradient-primary text-primary-foreground shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-sm">
              Journée d'Indépendance — Gagnez avec vos abonnés
            </h2>
            <p className="text-xs/5 opacity-90 mt-1">
              Publiez aujourd'hui, recevez plus de visibilité et transformez les likes de vos abonnés en revenus.
            </p>
          </div>
        </div>
        <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30 border-0">
          <Sparkles className="h-4 w-4 mr-1" />
          Commencer
        </Button>
      </div>
    </section>
  )
}
