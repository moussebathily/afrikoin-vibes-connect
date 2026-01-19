import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  MapPin, 
  Building2, 
  DollarSign,
  Briefcase,
  Clock,
  ChevronRight,
  Settings2,
  Loader2
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { JobApplicationForm } from './JobApplicationForm'
import { JobPreferencesDialog } from './JobPreferencesDialog'

interface RecommendedJob {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  category: string | null
  company_logo_url: string | null
  is_featured: boolean
  created_at: string
  match_score?: number
}

export function JobRecommendations() {
  const [jobs, setJobs] = useState<RecommendedJob[]>([])
  const [loading, setLoading] = useState(true)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchRecommendations = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      // Fetch user preferences
      const { data: preferences } = await supabase
        .from('user_job_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      // Fetch user's application history to get categories they're interested in
      const { data: applications } = await supabase
        .from('job_applications')
        .select('job_id')
        .eq('user_id', user.id)

      const appliedJobIds = applications?.map(a => a.job_id) || []

      // Fetch jobs user has viewed
      const { data: viewedJobs } = await supabase
        .from('job_views')
        .select('job_id')
        .eq('user_id', user.id)
        .order('viewed_at', { ascending: false })
        .limit(20)

      const viewedJobIds = viewedJobs?.map(v => v.job_id) || []

      // Build query for recommended jobs
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10)

      // Exclude already applied jobs
      if (appliedJobIds.length > 0) {
        query = query.not('id', 'in', `(${appliedJobIds.join(',')})`)
      }

      // Apply preference filters if they exist
      if (preferences) {
        if (preferences.preferred_categories?.length > 0) {
          query = query.in('category', preferences.preferred_categories)
        }
        if (preferences.preferred_locations?.length > 0) {
          query = query.or(
            preferences.preferred_locations.map((loc: string) => `location.ilike.%${loc}%`).join(',')
          )
        }
        if (preferences.preferred_job_types?.length > 0) {
          query = query.in('job_type', preferences.preferred_job_types)
        }
        if (preferences.min_salary) {
          query = query.gte('salary_min', preferences.min_salary)
        }
        if (preferences.remote_only) {
          query = query.eq('job_type', 'remote')
        }
      }

      const { data: recommendedJobs, error } = await query

      if (error) throw error

      // Calculate match score based on preferences and history
      const scoredJobs = (recommendedJobs || []).map(job => {
        let score = 0
        
        // Boost featured jobs
        if (job.is_featured) score += 20

        // Boost jobs matching preferences
        if (preferences) {
          if (preferences.preferred_categories?.includes(job.category)) score += 30
          if (preferences.preferred_job_types?.includes(job.job_type)) score += 20
          if (preferences.preferred_locations?.some((loc: string) => 
            job.location.toLowerCase().includes(loc.toLowerCase())
          )) score += 25
        }

        // Boost recently viewed categories (from job views)
        if (viewedJobIds.includes(job.id)) score -= 10 // Lower score for already viewed

        return { ...job, match_score: score }
      })

      // Sort by match score
      scoredJobs.sort((a, b) => (b.match_score || 0) - (a.match_score || 0))

      setJobs(scoredJobs.slice(0, 6))
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'full-time': 'CDI',
      'part-time': 'Temps partiel',
      'contract': 'CDD',
      'internship': 'Stage',
      'remote': 'Télétravail'
    }
    return labels[type] || type
  }

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return null
    if (min && max) return `${(min / 1000).toFixed(0)}K - ${(max / 1000).toFixed(0)}K ${currency}`
    if (min) return `${(min / 1000).toFixed(0)}K+ ${currency}`
    return null
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

  if (!user) return null

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-6 w-6 mx-auto animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Recommandés pour vous
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setPreferencesOpen(true)}
            className="gap-1 text-muted-foreground"
          >
            <Settings2 className="h-4 w-4" />
            Préférences
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {jobs.length === 0 ? (
          <div className="text-center py-6">
            <Briefcase className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-sm text-muted-foreground mb-3">
              Configurez vos préférences pour recevoir des recommandations personnalisées
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPreferencesOpen(true)}
            >
              Configurer mes préférences
            </Button>
          </div>
        ) : (
          <>
            {jobs.map(job => (
              <div 
                key={job.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  {job.company_logo_url ? (
                    <img 
                      src={job.company_logo_url} 
                      alt={job.company}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                    {job.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] h-5">
                      {getTypeLabel(job.job_type)}
                    </Badge>
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency) && (
                      <span className="text-[10px] text-primary font-medium">
                        {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                      </span>
                    )}
                    {job.match_score && job.match_score > 50 && (
                      <Badge className="text-[10px] h-5 bg-green-500/10 text-green-700 border-green-500/20">
                        {job.match_score}% match
                      </Badge>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full mt-2"
              onClick={() => navigate('/jobs')}
            >
              Voir toutes les offres
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        )}
      </CardContent>

      <JobPreferencesDialog 
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        onSave={fetchRecommendations}
      />
    </Card>
  )
}

export default JobRecommendations
