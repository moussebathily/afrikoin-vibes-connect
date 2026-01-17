import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  DollarSign,
  ChevronRight,
  ExternalLink,
  Users
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
  salary?: string
  posted_at: string
  logo_url?: string
  is_featured?: boolean
  category?: string
  applicants?: number
}

// Données de démonstration - à remplacer par des données Supabase
const demoJobs: Job[] = [
  {
    id: '1',
    title: 'Développeur Full Stack',
    company: 'AfriTech Solutions',
    location: 'Dakar, Sénégal',
    type: 'full-time',
    salary: '800K - 1.5M FCFA',
    posted_at: '2025-01-15',
    is_featured: true,
    category: 'Tech',
    applicants: 45
  },
  {
    id: '2',
    title: 'Community Manager',
    company: 'Pan-African Media',
    location: 'Lagos, Nigeria',
    type: 'remote',
    salary: '400K - 600K FCFA',
    posted_at: '2025-01-14',
    category: 'Marketing',
    applicants: 78
  },
  {
    id: '3',
    title: 'Comptable Senior',
    company: 'FinanceAfrique',
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'full-time',
    salary: '600K - 900K FCFA',
    posted_at: '2025-01-13',
    category: 'Finance',
    applicants: 32
  },
  {
    id: '4',
    title: 'Stage Marketing Digital',
    company: 'StartUp Nairobi',
    location: 'Nairobi, Kenya',
    type: 'internship',
    salary: '150K FCFA',
    posted_at: '2025-01-12',
    category: 'Marketing',
    applicants: 120
  }
]

interface JobsSectionProps {
  limit?: number
}

export function JobsSection({ limit = 4 }: JobsSectionProps) {
  const [jobs] = useState<Job[]>(demoJobs.slice(0, limit))
  const { t } = useTranslation()

  const getTypeLabel = (type: Job['type']) => {
    const labels = {
      'full-time': 'Temps plein',
      'part-time': 'Temps partiel',
      'contract': 'Contrat',
      'internship': 'Stage',
      'remote': 'Télétravail'
    }
    return labels[type]
  }

  const getTypeVariant = (type: Job['type']): 'default' | 'secondary' | 'outline' => {
    if (type === 'remote') return 'default'
    if (type === 'internship') return 'secondary'
    return 'outline'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return 'Hier'
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return (
    <section aria-label="Offres d'emploi">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Briefcase className="h-5 w-5 text-primary" />
              Offres d'emploi
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">
              Voir tout <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {jobs.map(job => (
            <Card 
              key={job.id} 
              className={`transition-all hover:shadow-md cursor-pointer group ${
                job.is_featured ? 'border-primary/50 bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {job.logo_url ? (
                      <img 
                        src={job.logo_url} 
                        alt={job.company}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                          {job.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">{job.company}</p>
                      </div>
                      {job.is_featured && (
                        <Badge className="text-xs bg-gradient-primary text-primary-foreground">
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                      <Badge variant={getTypeVariant(job.type)} className="text-xs">
                        {getTypeLabel(job.type)}
                      </Badge>
                      {job.salary && (
                        <span className="flex items-center gap-1 text-primary font-medium">
                          <DollarSign className="h-3 w-3" />
                          {job.salary}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(job.posted_at)}
                        </span>
                        {job.applicants && (
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applicants} candidats
                          </span>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="h-auto p-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center pt-2">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Briefcase className="h-4 w-4 mr-2" />
              Publier une offre d'emploi
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
