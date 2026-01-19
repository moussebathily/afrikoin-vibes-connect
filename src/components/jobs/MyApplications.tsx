import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  History, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  FileText,
  Calendar,
  Building2,
  MapPin,
  Loader2,
  AlertCircle,
  Trash2
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface Application {
  id: string
  job_id: string
  cover_letter: string
  resume_url: string | null
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted'
  created_at: string
  updated_at: string
  job?: {
    title: string
    company: string
    location: string
    job_type: string
  }
}

export function MyApplications() {
  const [open, setOpen] = useState(false)
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [withdrawing, setWithdrawing] = useState<string | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchApplications = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Fetch user's applications
      const { data: appsData, error: appsError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (appsError) throw appsError

      // Fetch job details for each application
      if (appsData && appsData.length > 0) {
        const jobIds = appsData.map(a => a.job_id)
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('id, title, company, location, job_type')
          .in('id', jobIds)

        const enrichedApps = appsData.map(app => ({
          ...app,
          status: app.status as Application['status'],
          job: jobsData?.find(j => j.id === app.job_id)
        }))

        setApplications(enrichedApps)
      } else {
        setApplications([])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (open) {
      fetchApplications()
    }
  }, [open, fetchApplications])

  const withdrawApplication = async (applicationId: string, jobTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir retirer votre candidature pour "${jobTitle}" ?`)) {
      return
    }

    setWithdrawing(applicationId)
    try {
      // Delete the resume from storage if exists
      const application = applications.find(a => a.id === applicationId)
      if (application?.resume_url) {
        const urlParts = application.resume_url.split('/')
        const fileName = urlParts[urlParts.length - 1]
        if (user) {
          await supabase.storage
            .from('resumes')
            .remove([`${user.id}/${fileName}`])
        }
      }

      // Delete the application
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationId)

      if (error) throw error

      setApplications(prev => prev.filter(a => a.id !== applicationId))
      
      toast({
        title: "Candidature retirée",
        description: `Votre candidature pour "${jobTitle}" a été retirée avec succès.`
      })
    } catch (error) {
      console.error('Error withdrawing application:', error)
      toast({
        title: "Erreur",
        description: "Impossible de retirer la candidature",
        variant: "destructive"
      })
    } finally {
      setWithdrawing(null)
    }
  }

  const getStatusLabel = (status: Application['status']) => {
    const labels = {
      pending: 'En attente',
      reviewed: 'Examinée',
      shortlisted: 'Présélectionné',
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

  const getStatusIcon = (status: Application['status']) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      reviewed: <Eye className="h-4 w-4" />,
      shortlisted: <CheckCircle className="h-4 w-4" />,
      rejected: <XCircle className="h-4 w-4" />,
      accepted: <CheckCircle className="h-4 w-4" />
    }
    return icons[status]
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

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

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <History className="h-4 w-4" />
          Mes candidatures
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Historique de mes candidatures
          </DialogTitle>
          <DialogDescription>
            Suivez le statut de toutes vos candidatures
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="py-12 text-center">
              <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="py-12 text-center">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="font-semibold mb-2">Aucune candidature</h3>
              <p className="text-sm text-muted-foreground">
                Vous n'avez pas encore postulé à des offres d'emploi
              </p>
            </div>
          ) : (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-4 gap-2 p-3 bg-muted/50 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold">{applications.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-500">
                    {applications.filter(a => a.status === 'pending').length}
                  </p>
                  <p className="text-xs text-muted-foreground">En attente</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-primary">
                    {applications.filter(a => a.status === 'shortlisted').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Présélectionné</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-500">
                    {applications.filter(a => a.status === 'accepted').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Acceptée</p>
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-3">
                {applications.map(app => (
                  <Card key={app.id} className="transition-all hover:shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold leading-tight">
                                {app.job?.title || 'Poste inconnu'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {app.job?.company || 'Entreprise'}
                              </p>
                            </div>
                            <Badge 
                              variant={getStatusVariant(app.status)}
                              className="flex items-center gap-1 flex-shrink-0"
                            >
                              {getStatusIcon(app.status)}
                              {getStatusLabel(app.status)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                            {app.job?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {app.job.location}
                              </span>
                            )}
                            {app.job?.job_type && (
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(app.job.job_type)}
                              </Badge>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Candidature le {formatDate(app.created_at)}
                            </span>
                          </div>

                          {/* Status Timeline */}
                          <div className="mt-3 p-2 bg-muted/30 rounded-md">
                            <div className="flex items-center gap-2 text-xs">
                              {app.status === 'pending' && (
                                <>
                                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                  <span>Votre candidature est en cours d'examen</span>
                                </>
                              )}
                              {app.status === 'reviewed' && (
                                <>
                                  <Eye className="h-3.5 w-3.5 text-blue-500" />
                                  <span>Le recruteur a consulté votre profil</span>
                                </>
                              )}
                              {app.status === 'shortlisted' && (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                  <span>Félicitations ! Vous êtes présélectionné</span>
                                </>
                              )}
                              {app.status === 'accepted' && (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                                  <span>🎉 Votre candidature a été acceptée !</span>
                                </>
                              )}
                              {app.status === 'rejected' && (
                                <>
                                  <XCircle className="h-3.5 w-3.5 text-destructive" />
                                  <span>Votre candidature n'a pas été retenue</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3">
                            {app.resume_url && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 text-xs gap-1"
                                asChild
                              >
                                <a href={app.resume_url} target="_blank" rel="noopener noreferrer">
                                  <FileText className="h-3.5 w-3.5" />
                                  Voir mon CV
                                </a>
                              </Button>
                            )}
                            {app.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => withdrawApplication(app.id, app.job?.title || 'ce poste')}
                                disabled={withdrawing === app.id}
                              >
                                {withdrawing === app.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5" />
                                )}
                                Retirer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MyApplications
