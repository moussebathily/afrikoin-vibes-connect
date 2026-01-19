import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Users, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  FileText,
  Download,
  Mail,
  Calendar,
  TrendingUp,
  UserCheck,
  UserX,
  Loader2,
  Building2
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface Application {
  id: string
  job_id: string
  user_id: string
  cover_letter: string
  resume_url: string | null
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
  created_at: string
  updated_at: string
  job?: {
    title: string
    company: string
  }
  profile?: {
    display_name: string | null
    avatar_url: string | null
  }
}

interface Job {
  id: string
  title: string
  company: string
  applicants_count: number
  created_at: string
  is_active: boolean
}

export function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    if (!user) return

    try {
      // Fetch recruiter's jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('id, title, company, applicants_count, created_at, is_active')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (jobsError) throw jobsError
      setJobs(jobsData || [])

      // Fetch applications for recruiter's jobs
      const jobIds = (jobsData || []).map(j => j.id)
      
      if (jobIds.length > 0) {
        const { data: appsData, error: appsError } = await supabase
          .from('job_applications')
          .select('*')
          .in('job_id', jobIds)
          .order('created_at', { ascending: false })

        if (appsError) throw appsError

        // Enrich with job info
        const enrichedApps = (appsData || []).map(app => ({
          ...app,
          status: app.status as Application['status'],
          job: jobsData?.find(j => j.id === app.job_id)
        }))

        setApplications(enrichedApps)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const updateApplicationStatus = async (appId: string, newStatus: Application['status']) => {
    setUpdating(appId)
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appId)

      if (error) throw error

      setApplications(prev => 
        prev.map(app => app.id === appId ? { ...app, status: newStatus } : app)
      )

      toast({
        title: "Statut mis à jour",
        description: `La candidature a été marquée comme "${getStatusLabel(newStatus)}"`
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      })
    } finally {
      setUpdating(null)
    }
  }

  const getStatusLabel = (status: Application['status']) => {
    const labels = {
      pending: 'En attente',
      reviewed: 'Examinée',
      shortlisted: 'Présélectionnée',
      rejected: 'Refusée',
      accepted: 'Acceptée'
    }
    return labels[status]
  }

  const getStatusVariant = (status: Application['status']): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const variants: Record<Application['status'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      reviewed: 'outline',
      shortlisted: 'default',
      rejected: 'destructive',
      accepted: 'default'
    }
    return variants[status]
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const filteredApplications = selectedJob === 'all' 
    ? applications 
    : applications.filter(app => app.job_id === selectedJob)

  const stats = {
    totalJobs: jobs.length,
    totalApplications: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    accepted: applications.filter(a => a.status === 'accepted').length
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Connexion requise</h3>
          <p className="text-sm text-muted-foreground">
            Connectez-vous pour accéder au tableau de bord recruteur
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <Briefcase className="h-5 w-5 mx-auto mb-1 text-primary" />
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
            <p className="text-xs text-muted-foreground">Offres publiées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-5 w-5 mx-auto mb-1 text-blue-500" />
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
            <p className="text-xs text-muted-foreground">Candidatures</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-5 w-5 mx-auto mb-1 text-amber-500" />
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <UserCheck className="h-5 w-5 mx-auto mb-1 text-green-500" />
            <p className="text-2xl font-bold">{stats.shortlisted}</p>
            <p className="text-xs text-muted-foreground">Présélectionnés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
            <p className="text-2xl font-bold">{stats.accepted}</p>
            <p className="text-xs text-muted-foreground">Acceptés</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter by job */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Filtrer par offre :</label>
            <Select value={selectedJob} onValueChange={setSelectedJob}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Toutes les offres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les offres</SelectItem>
                {jobs.map(job => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Candidatures ({filteredApplications.length})
        </h2>

        {filteredApplications.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">Aucune candidature</h3>
              <p className="text-sm text-muted-foreground">
                {jobs.length === 0 
                  ? "Publiez une offre d'emploi pour recevoir des candidatures"
                  : "Aucune candidature reçue pour le moment"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map(app => (
            <ApplicationCard 
              key={app.id}
              application={app}
              updating={updating === app.id}
              onStatusChange={(status) => updateApplicationStatus(app.id, status)}
              getStatusLabel={getStatusLabel}
              getStatusVariant={getStatusVariant}
              formatDate={formatDate}
            />
          ))
        )}
      </div>
    </div>
  )
}

function ApplicationCard({
  application,
  updating,
  onStatusChange,
  getStatusLabel,
  getStatusVariant,
  formatDate
}: {
  application: Application
  updating: boolean
  onStatusChange: (status: Application['status']) => void
  getStatusLabel: (status: Application['status']) => string
  getStatusVariant: (status: Application['status']) => 'default' | 'secondary' | 'destructive' | 'outline'
  formatDate: (date: string) => string
}) {
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {application.profile?.display_name?.[0]?.toUpperCase() || 'C'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">
                  {application.profile?.display_name || 'Candidat'}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {application.job?.title || 'Offre inconnue'}
                </p>
              </div>
              <Badge variant={getStatusVariant(application.status)}>
                {getStatusLabel(application.status)}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {application.cover_letter}
            </p>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(application.created_at)}
                </span>
                {application.resume_url && (
                  <a 
                    href={application.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    CV
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8 gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      Voir
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Candidature</DialogTitle>
                      <DialogDescription>
                        Pour le poste : {application.job?.title}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <h4 className="font-medium mb-2">Lettre de motivation</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {application.cover_letter}
                        </p>
                      </div>
                      {application.resume_url && (
                        <div>
                          <h4 className="font-medium mb-2">CV</h4>
                          <Button asChild variant="outline" className="gap-2">
                            <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                              Télécharger le CV
                            </a>
                          </Button>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium mb-2">Changer le statut</h4>
                        <Select 
                          value={application.status} 
                          onValueChange={(value) => onStatusChange(value as Application['status'])}
                          disabled={updating}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">En attente</SelectItem>
                            <SelectItem value="reviewed">Examinée</SelectItem>
                            <SelectItem value="shortlisted">Présélectionnée</SelectItem>
                            <SelectItem value="accepted">Acceptée</SelectItem>
                            <SelectItem value="rejected">Refusée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Select 
                  value={application.status} 
                  onValueChange={(value) => onStatusChange(value as Application['status'])}
                  disabled={updating}
                >
                  <SelectTrigger className="h-8 w-[130px]">
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="reviewed">Examinée</SelectItem>
                    <SelectItem value="shortlisted">Présélectionnée</SelectItem>
                    <SelectItem value="accepted">Acceptée</SelectItem>
                    <SelectItem value="rejected">Refusée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecruiterDashboard
