import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FileUp, Loader2, Send, CheckCircle, Upload } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  company: string
  onSuccess?: () => void
}

export function JobApplicationForm({ jobId, jobTitle, company, onSuccess }: JobApplicationFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Format non supporté",
          description: "Veuillez télécharger un fichier PDF ou Word (.doc, .docx)",
          variant: "destructive"
        })
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximum est de 5 Mo",
          variant: "destructive"
        })
        return
      }
      setResumeFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour postuler",
        variant: "destructive"
      })
      return
    }

    if (!coverLetter.trim()) {
      toast({
        title: "Lettre de motivation requise",
        description: "Veuillez rédiger une lettre de motivation",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      let resumeUrl = null

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop()
        const fileName = `${user.id}/${jobId}_${Date.now()}.${fileExt}`
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(fileName, resumeFile)

        if (uploadError) {
          throw new Error('Erreur lors du téléchargement du CV: ' + uploadError.message)
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(uploadData.path)
        
        resumeUrl = urlData.publicUrl
      }

      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('job_applications')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .single()

      if (existingApplication) {
        toast({
          title: "Candidature existante",
          description: "Vous avez déjà postulé à cette offre",
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      // Create application
      const { error: applicationError } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          user_id: user.id,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
          status: 'pending'
        })

      if (applicationError) {
        throw new Error('Erreur lors de la candidature: ' + applicationError.message)
      }

      setSuccess(true)
      toast({
        title: "Candidature envoyée !",
        description: `Votre candidature pour ${jobTitle} chez ${company} a été soumise avec succès.`
      })

      setSuccess(true)
      toast({
        title: "Candidature envoyée !",
        description: `Votre candidature pour ${jobTitle} chez ${company} a été soumise avec succès.`
      })

      onSuccess?.()

      // Reset form after delay
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        setCoverLetter('')
        setResumeFile(null)
      }, 2000)

    } catch (error: any) {
      console.error('Application error:', error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline" className="h-8">
            Postuler
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Candidature envoyée !</h3>
            <p className="text-muted-foreground">
              Votre candidature a été soumise avec succès. L'entreprise vous contactera si votre profil correspond.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8">
          Postuler
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Postuler à l'offre
          </DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{jobTitle}</span> chez {company}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour postuler à cette offre.
            </p>
            <Button onClick={() => setOpen(false)}>
              Se connecter
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter">
                Lettre de motivation <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="coverLetter"
                placeholder="Présentez-vous et expliquez pourquoi vous êtes le candidat idéal pour ce poste..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                required
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Minimum 50 caractères. Soyez précis et personnalisez votre lettre.
              </p>
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label htmlFor="resume">
                CV (optionnel)
              </Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                {resumeFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileUp className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{resumeFile.name}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setResumeFile(null)}
                    >
                      Supprimer
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="resume" className="cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">Cliquez pour télécharger votre CV</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF ou Word (max 5 Mo)
                    </p>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
                disabled={loading}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="flex-1 gap-2"
                disabled={loading || coverLetter.length < 50}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Envoyer ma candidature
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default JobApplicationForm
