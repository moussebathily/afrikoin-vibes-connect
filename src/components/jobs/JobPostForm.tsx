import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText,
  Plus,
  Loader2,
  CheckCircle,
  X
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

const jobFormSchema = z.object({
  title: z.string().min(5, 'Le titre doit contenir au moins 5 caractères').max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  company: z.string().min(2, 'Le nom de l\'entreprise est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  location: z.string().min(2, 'La localisation est requise').max(100, 'La localisation ne peut pas dépasser 100 caractères'),
  job_type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'remote']),
  category: z.string().min(1, 'La catégorie est requise'),
  experience_level: z.enum(['junior', 'mid', 'senior', 'lead', 'executive']),
  salary_min: z.coerce.number().min(0).optional(),
  salary_max: z.coerce.number().min(0).optional(),
  salary_currency: z.string().default('XOF'),
  description: z.string().min(50, 'La description doit contenir au moins 50 caractères').max(5000, 'La description ne peut pas dépasser 5000 caractères'),
  requirements: z.string().max(3000, 'Les exigences ne peuvent pas dépasser 3000 caractères').optional(),
  benefits: z.string().max(2000, 'Les avantages ne peuvent pas dépasser 2000 caractères').optional(),
  contact_email: z.string().email('Email invalide').optional().or(z.literal('')),
  contact_phone: z.string().max(20, 'Numéro trop long').optional(),
  company_website: z.string().url('URL invalide').optional().or(z.literal('')),
})

type JobFormData = z.infer<typeof jobFormSchema>

interface JobPostFormProps {
  onSuccess?: () => void
}

export function JobPostForm({ onSuccess }: JobPostFormProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      job_type: 'full-time',
      category: '',
      experience_level: 'mid',
      salary_currency: 'XOF',
      description: '',
      requirements: '',
      benefits: '',
      contact_email: '',
      contact_phone: '',
      company_website: '',
    }
  })

  const onSubmit = async (data: JobFormData) => {
    if (!user) {
      toast.error('Vous devez être connecté pour publier une offre')
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('jobs').insert({
        user_id: user.id,
        title: data.title.trim(),
        company: data.company.trim(),
        location: data.location.trim(),
        job_type: data.job_type,
        category: data.category,
        experience_level: data.experience_level,
        salary_min: data.salary_min || null,
        salary_max: data.salary_max || null,
        salary_currency: data.salary_currency,
        description: data.description.trim(),
        requirements: data.requirements?.trim() || null,
        benefits: data.benefits?.trim() || null,
        contact_email: data.contact_email?.trim() || null,
        contact_phone: data.contact_phone?.trim() || null,
        company_website: data.company_website?.trim() || null,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      })

      if (error) throw error

      setSuccess(true)
      toast.success('Offre d\'emploi publiée avec succès!')
      
      setTimeout(() => {
        form.reset()
        setSuccess(false)
        setOpen(false)
        onSuccess?.()
      }, 1500)
    } catch (error: any) {
      console.error('Error posting job:', error)
      toast.error('Erreur lors de la publication: ' + error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const jobTypes = [
    { value: 'full-time', label: 'Temps plein (CDI)' },
    { value: 'part-time', label: 'Temps partiel' },
    { value: 'contract', label: 'Contrat (CDD)' },
    { value: 'internship', label: 'Stage' },
    { value: 'remote', label: 'Télétravail' },
  ]

  const experienceLevels = [
    { value: 'junior', label: 'Junior (0-2 ans)' },
    { value: 'mid', label: 'Intermédiaire (2-5 ans)' },
    { value: 'senior', label: 'Senior (5-10 ans)' },
    { value: 'lead', label: 'Lead / Manager' },
    { value: 'executive', label: 'Directeur / Exécutif' },
  ]

  const categories = [
    'Tech & IT',
    'Marketing',
    'Finance',
    'Ventes',
    'RH',
    'Design',
    'Juridique',
    'Santé',
    'Education',
    'Ingénierie',
    'Logistique',
    'Service client',
    'Administration',
    'Autre',
  ]

  const currencies = [
    { value: 'XOF', label: 'FCFA (XOF)' },
    { value: 'XAF', label: 'FCFA (XAF)' },
    { value: 'NGN', label: 'Naira (NGN)' },
    { value: 'KES', label: 'Shilling (KES)' },
    { value: 'ZAR', label: 'Rand (ZAR)' },
    { value: 'MAD', label: 'Dirham (MAD)' },
    { value: 'USD', label: 'Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
  ]

  if (success) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="gap-2 bg-gradient-primary">
            <Plus className="h-4 w-4" />
            Publier une offre
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <div className="py-12 text-center">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-success" />
            <h3 className="text-xl font-semibold mb-2">Offre publiée!</h3>
            <p className="text-muted-foreground">Votre offre d'emploi est maintenant visible par tous.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-primary">
          <Plus className="h-4 w-4" />
          Publier une offre
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Publier une offre d'emploi
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informations de base
              </h3>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du poste *</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Développeur Full Stack" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entreprise *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nom de l'entreprise" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localisation *</FormLabel>
                      <FormControl>
                        <Input placeholder="ex: Dakar, Sénégal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="job_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de contrat *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Catégorie *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expérience *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceLevels.map(level => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Salary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Rémunération (optionnel)
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="salary_min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salaire min</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salaire max</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary_currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Devise</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map(curr => (
                            <SelectItem key={curr.value} value={curr.value}>
                              {curr.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description du poste *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez le poste, les missions, l'environnement de travail..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Minimum 50 caractères
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="requirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exigences / Qualifications</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Compétences requises, diplômes, expérience..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avantages</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Avantages sociaux, télétravail, formation..."
                        className="min-h-[60px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Contact (optionnel)
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email de contact</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="rh@entreprise.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input placeholder="+221 77 123 45 67" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="company_website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site web de l'entreprise</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.entreprise.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-primary">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Publier l'offre
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
