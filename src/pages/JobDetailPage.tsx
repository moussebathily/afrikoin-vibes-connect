import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Building2, 
  DollarSign,
  Users,
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  Loader2,
  Share2,
  Heart,
  ExternalLink
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { JobApplicationForm } from '@/components/jobs/JobApplicationForm'
import { useToast } from '@/hooks/use-toast'
import { EntitySEO } from '@/components/seo/EntitySEO'

interface JobDetails {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  description: string
  requirements: string | null
  benefits: string | null
  experience_level: string | null
  category: string | null
  company_logo_url: string | null
  company_website: string | null
  contact_email: string | null
  contact_phone: string | null
  applicants_count: number
  views_count: number
  is_featured: boolean
  created_at: string
  expires_at: string | null
}

export function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [job, setJob] = useState<JobDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return

      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single()

        if (error) throw error
        setJob(data)

        // Increment view count
        await supabase
          .from('jobs')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', id)

      } catch (error) {
        console.error('Error fetching job:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger l'offre d'emploi",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id, toast])

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'full-time': 'CDI - Temps plein',
      'part-time': 'Temps partiel',
      'contract': 'CDD',
      'internship': 'Stage',
      'remote': 'Télétravail'
    }
    return labels[type] || type
  }

  const getExperienceLabel = (level: string | null) => {
    if (!level) return null
    const labels: Record<string, string> = {
      'junior': 'Junior (0-2 ans)',
      'mid': 'Intermédiaire (2-5 ans)',
      'senior': 'Senior (5+ ans)',
      'lead': 'Lead / Manager'
    }
    return labels[level] || level
  }

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return null
    if (min && max) {
      return `${(min / 1000).toFixed(0)}K - ${(max / 1000).toFixed(0)}K ${currency}`
    }
    if (min) return `${(min / 1000).toFixed(0)}K+ ${currency}`
    return null
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: job?.title,
        text: `${job?.title} chez ${job?.company}`,
        url: window.location.href
      })
    } catch {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Lien copié",
        description: "Le lien de l'offre a été copié dans le presse-papier"
      })
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-semibold mb-2">Offre introuvable</h2>
            <p className="text-muted-foreground mb-4">
              Cette offre n'existe pas ou n'est plus disponible.
            </p>
            <Button onClick={() => navigate('/jobs')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux offres
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const salary = formatSalary(job.salary_min, job.salary_max, job.salary_currency)

  const canonicalUrl = `https://afrikoin.online/jobs/${job.id}`
  const jobLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.created_at,
    ...(job.expires_at && { validThrough: job.expires_at }),
    employmentType: (job.job_type || '').toUpperCase().replace('-', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
      ...(job.company_logo_url && { logo: job.company_logo_url }),
      ...(job.company_website && { sameAs: job.company_website }),
    },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location },
    },
    ...(job.salary_min || job.salary_max
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: job.salary_currency,
            value: {
              '@type': 'QuantitativeValue',
              ...(job.salary_min && { minValue: job.salary_min }),
              ...(job.salary_max && { maxValue: job.salary_max }),
              unitText: 'YEAR',
            },
          },
        }
      : {}),
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
      <EntitySEO
        title={`${job.title} — ${job.company}`}
        description={job.description?.slice(0, 200)}
        image={job.company_logo_url || undefined}
        url={canonicalUrl}
        type="article"
        jsonLd={jobLd}
      />
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/jobs')}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux offres
      </Button>

      {/* Header Card */}
      <Card className={job.is_featured ? 'border-primary/50 bg-primary/5' : ''}>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              {job.company_logo_url ? (
                <img 
                  src={job.company_logo_url} 
                  alt={job.company}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Building2 className="h-8 w-8 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  <p className="text-lg text-muted-foreground">{job.company}</p>
                </div>
                {job.is_featured && (
                  <Badge className="bg-gradient-primary text-primary-foreground">
                    Featured
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Badge variant="outline" className="gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {getTypeLabel(job.job_type)}
                </Badge>
                {salary && (
                  <Badge className="gap-1 bg-green-500/10 text-green-700 border-green-500/20">
                    <DollarSign className="h-3.5 w-3.5" />
                    {salary}
                  </Badge>
                )}
                {job.category && (
                  <Badge variant="outline">{job.category}</Badge>
                )}
              </div>

              <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Publié le {formatDate(job.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {job.applicants_count || 0} candidats
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t">
            <JobApplicationForm 
              jobId={job.id}
              jobTitle={job.title}
              company={job.company}
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Description du poste</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                {job.description.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Exigences et qualifications</h2>
                <ul className="space-y-2">
                  {job.requirements.split('\n').filter(r => r.trim()).map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{req.replace(/^[-•]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Avantages</h2>
                <ul className="space-y-2">
                  {job.benefits.split('\n').filter(b => b.trim()).map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit.replace(/^[-•]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">Informations</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Type de contrat</span>
                  <span className="font-medium">{getTypeLabel(job.job_type)}</span>
                </div>
                
                {getExperienceLabel(job.experience_level) && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expérience</span>
                    <span className="font-medium">{getExperienceLabel(job.experience_level)}</span>
                  </div>
                )}

                {salary && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Salaire</span>
                    <span className="font-medium text-primary">{salary}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Localisation</span>
                  <span className="font-medium">{job.location}</span>
                </div>

                {job.expires_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Expire le</span>
                    <span className="font-medium">{formatDate(job.expires_at)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="font-semibold">À propos de l'entreprise</h3>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                  {job.company_logo_url ? (
                    <img 
                      src={job.company_logo_url} 
                      alt={job.company}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{job.company}</p>
                  <p className="text-sm text-muted-foreground">{job.location}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 text-sm">
                {job.company_website && (
                  <a 
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Site web
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {job.contact_email && (
                  <a 
                    href={`mailto:${job.contact_email}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Mail className="h-4 w-4" />
                    {job.contact_email}
                  </a>
                )}

                {job.contact_phone && (
                  <a 
                    href={`tel:${job.contact_phone}`}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    {job.contact_phone}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Apply CTA */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Intéressé par ce poste ?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Postulez maintenant et rejoignez {job.company}
              </p>
              <JobApplicationForm 
                jobId={job.id}
                jobTitle={job.title}
                company={job.company}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default JobDetailPage
