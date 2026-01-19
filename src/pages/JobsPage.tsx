import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  DollarSign,
  Search,
  Filter,
  Users,
  Globe,
  Laptop,
  GraduationCap,
  TrendingUp
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/integrations/supabase/client'
import { JobPostForm } from '@/components/jobs/JobPostForm'
import { JobApplicationForm } from '@/components/jobs/JobApplicationForm'
import { RecruiterDashboard } from '@/components/jobs/RecruiterDashboard'
import { MyApplications } from '@/components/jobs/MyApplications'
import { JobRecommendations } from '@/components/jobs/JobRecommendations'
import { useAuth } from '@/contexts/AuthContext'

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
  description?: string
}

// Demo data - to be replaced with Supabase data
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
    applicants: 45,
    description: 'Rejoignez notre équipe dynamique pour développer des solutions innovantes.'
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
    applicants: 78,
    description: 'Gérez nos réseaux sociaux et développez notre communauté.'
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
    applicants: 32,
    description: 'Superviser les opérations comptables et financières.'
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
    applicants: 120,
    description: 'Stage de 6 mois pour apprendre le marketing digital.'
  },
  {
    id: '5',
    title: 'Chef de Projet IT',
    company: 'Digital Africa',
    location: 'Casablanca, Maroc',
    type: 'full-time',
    salary: '1M - 1.8M FCFA',
    posted_at: '2025-01-11',
    is_featured: true,
    category: 'Tech',
    applicants: 28,
    description: 'Piloter des projets de transformation digitale.'
  },
  {
    id: '6',
    title: 'Designer UX/UI',
    company: 'CreativeHub',
    location: 'Accra, Ghana',
    type: 'remote',
    salary: '500K - 800K FCFA',
    posted_at: '2025-01-10',
    category: 'Design',
    applicants: 65,
    description: 'Concevoir des expériences utilisateur exceptionnelles.'
  },
  {
    id: '7',
    title: 'Commercial B2B',
    company: 'AfriCommerce',
    location: 'Douala, Cameroun',
    type: 'full-time',
    salary: '400K + commissions',
    posted_at: '2025-01-09',
    category: 'Ventes',
    applicants: 42,
    description: 'Développer notre portefeuille clients entreprises.'
  },
  {
    id: '8',
    title: 'Data Analyst',
    company: 'DataLab Africa',
    location: 'Cape Town, Afrique du Sud',
    type: 'contract',
    salary: '700K - 1.2M FCFA',
    posted_at: '2025-01-08',
    category: 'Tech',
    applicants: 35,
    description: 'Analyser les données et produire des insights business.'
  }
]

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(demoJobs)
  const [dbJobs, setDbJobs] = useState<Job[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeType, setActiveType] = useState('all')
  const [activeTab, setActiveTab] = useState('jobs')
  const [loading, setLoading] = useState(true)
  const { t } = useTranslation()
  const { user } = useAuth()

  const fetchJobs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching jobs:', error)
        return
      }

      if (data && data.length > 0) {
        const formattedJobs: Job[] = data.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          type: job.job_type as Job['type'],
          salary: job.salary_min && job.salary_max 
            ? `${(job.salary_min / 1000).toFixed(0)}K - ${(job.salary_max / 1000).toFixed(0)}K ${job.salary_currency}`
            : job.salary_min 
              ? `${(job.salary_min / 1000).toFixed(0)}K+ ${job.salary_currency}`
              : undefined,
          posted_at: job.created_at,
          is_featured: job.is_featured,
          category: job.category,
          applicants: job.applicants_count,
          description: job.description
        }))
        setDbJobs(formattedJobs)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  // Combine demo jobs with DB jobs (DB jobs first)
  const allJobs = [...dbJobs, ...demoJobs]

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

  const filteredJobs = allJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = activeType === 'all' || job.type === activeType
    
    return matchesSearch && matchesType
  })

  const featuredJobs = filteredJobs.filter(job => job.is_featured)
  const regularJobs = filteredJobs.filter(job => !job.is_featured)

  const stats = {
    total: allJobs.length,
    remote: allJobs.filter(j => j.type === 'remote').length,
    internships: allJobs.filter(j => j.type === 'internship').length,
    featured: allJobs.filter(j => j.is_featured).length
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" />
            Offres d'emploi
          </h1>
          <p className="text-muted-foreground">
            Trouvez votre prochain emploi en Afrique
          </p>
        </div>
      </div>

      {/* Main Tabs: Jobs / Recruiter Dashboard */}
      {user && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="jobs" className="gap-2">
              <Search className="h-4 w-4" />
              Offres d'emploi
            </TabsTrigger>
            <TabsTrigger value="recruiter" className="gap-2">
              <Users className="h-4 w-4" />
              Tableau de bord recruteur
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {activeTab === 'recruiter' && user ? (
        <RecruiterDashboard />
      ) : (
        <>
          {/* Job Recommendations */}
          {user && <JobRecommendations />}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Offres actives</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Laptop className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                <p className="text-2xl font-bold">{stats.remote}</p>
                <p className="text-xs text-muted-foreground">Télétravail</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <GraduationCap className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                <p className="text-2xl font-bold">{stats.internships}</p>
                <p className="text-xs text-muted-foreground">Stages</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Globe className="h-5 w-5 mx-auto mb-1 text-green-500" />
                <p className="text-2xl font-bold">15+</p>
                <p className="text-xs text-muted-foreground">Pays</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un poste, entreprise, lieu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </Button>
                {user && <MyApplications />}
                <JobPostForm onSuccess={fetchJobs} />
              </div>
            </CardContent>
          </Card>

          {/* Type Tabs */}
          <Tabs value={activeType} onValueChange={setActiveType}>
            <TabsList className="grid w-full grid-cols-5 sm:grid-cols-6">
              <TabsTrigger value="all" className="text-xs">Tout</TabsTrigger>
              <TabsTrigger value="full-time" className="text-xs">CDI</TabsTrigger>
              <TabsTrigger value="remote" className="text-xs">Remote</TabsTrigger>
              <TabsTrigger value="contract" className="text-xs">CDD</TabsTrigger>
              <TabsTrigger value="internship" className="text-xs">Stage</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Featured Jobs */}
          {featuredJobs.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Offres à la une
              </h2>
              <div className="space-y-3">
                {featuredJobs.map(job => (
                  <JobCard key={job.id} job={job} formatDate={formatDate} getTypeLabel={getTypeLabel} getTypeVariant={getTypeVariant} />
                ))}
              </div>
            </section>
          )}

          {/* Regular Jobs */}
          <section>
            <h2 className="text-lg font-semibold mb-3">
              {activeType === 'all' ? 'Toutes les offres' : `Offres ${getTypeLabel(activeType as Job['type'])}`}
            </h2>
            <div className="space-y-3">
              {regularJobs.length > 0 ? (
                regularJobs.map(job => (
                  <JobCard key={job.id} job={job} formatDate={formatDate} getTypeLabel={getTypeLabel} getTypeVariant={getTypeVariant} />
                ))
              ) : (
                <Card className="border-dashed">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="font-semibold mb-2">Aucune offre trouvée</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Essayez de modifier vos critères de recherche
                    </p>
                    <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveType('all'); }}>
                      Réinitialiser les filtres
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

// Job Card Component
function JobCard({ 
  job, 
  formatDate, 
  getTypeLabel, 
  getTypeVariant 
}: { 
  job: Job
  formatDate: (date: string) => string
  getTypeLabel: (type: Job['type']) => string
  getTypeVariant: (type: Job['type']) => 'default' | 'secondary' | 'outline'
}) {
  const navigate = useNavigate()

  const handleCardClick = () => {
    // Only navigate to detail for DB jobs (UUID format)
    if (job.id.includes('-')) {
      navigate(`/jobs/${job.id}`)
    }
  }

  return (
    <Card 
      className={`transition-all hover:shadow-md cursor-pointer group ${
        job.is_featured ? 'border-primary/50 bg-primary/5' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
            {job.logo_url ? (
              <img 
                src={job.logo_url} 
                alt={job.company}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Building2 className="h-7 w-7 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              {job.is_featured && (
                <Badge className="text-xs bg-gradient-primary text-primary-foreground flex-shrink-0">
                  Featured
                </Badge>
              )}
            </div>
            
            {job.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {job.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mt-3 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
              <Badge variant={getTypeVariant(job.type)} className="text-xs">
                {getTypeLabel(job.type)}
              </Badge>
              {job.salary && (
                <span className="flex items-center gap-1 text-primary font-medium">
                  <DollarSign className="h-3.5 w-3.5" />
                  {job.salary}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(job.posted_at)}
                </span>
                {job.applicants && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {job.applicants} candidats
                  </span>
                )}
              </div>
              <div onClick={(e) => e.stopPropagation()}>
                <JobApplicationForm 
                  jobId={job.id}
                  jobTitle={job.title}
                  company={job.company}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default JobsPage
