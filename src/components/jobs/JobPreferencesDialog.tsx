import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, X, Sparkles } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface JobPreferencesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

const JOB_CATEGORIES = [
  'Tech', 'Marketing', 'Finance', 'Design', 'Ventes', 
  'RH', 'Juridique', 'Santé', 'Éducation', 'Ingénierie'
]

const JOB_TYPES = [
  { value: 'full-time', label: 'CDI - Temps plein' },
  { value: 'part-time', label: 'Temps partiel' },
  { value: 'contract', label: 'CDD' },
  { value: 'internship', label: 'Stage' },
  { value: 'remote', label: 'Télétravail' }
]

const EXPERIENCE_LEVELS = [
  { value: 'junior', label: 'Junior (0-2 ans)' },
  { value: 'mid', label: 'Intermédiaire (2-5 ans)' },
  { value: 'senior', label: 'Senior (5+ ans)' },
  { value: 'lead', label: 'Lead / Manager' }
]

const AFRICAN_LOCATIONS = [
  'Dakar', 'Lagos', 'Nairobi', 'Casablanca', 'Abidjan', 
  'Accra', 'Johannesburg', 'Le Caire', 'Douala', 'Tunis'
]

export function JobPreferencesDialog({ open, onOpenChange, onSave }: JobPreferencesDialogProps) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [jobTypes, setJobTypes] = useState<string[]>([])
  const [minSalary, setMinSalary] = useState('')
  const [experienceLevel, setExperienceLevel] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (open && user) {
      fetchPreferences()
    }
  }, [open, user])

  const fetchPreferences = async () => {
    if (!user) return
    setLoading(true)

    try {
      const { data, error } = await supabase
        .from('user_job_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setCategories(data.preferred_categories || [])
        setLocations(data.preferred_locations || [])
        setJobTypes(data.preferred_job_types || [])
        setMinSalary(data.min_salary?.toString() || '')
        setExperienceLevel(data.experience_level || '')
        setRemoteOnly(data.remote_only || false)
      }
    } catch (error) {
      // No preferences yet, that's ok
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)

    try {
      const preferences = {
        user_id: user.id,
        preferred_categories: categories,
        preferred_locations: locations,
        preferred_job_types: jobTypes,
        min_salary: minSalary ? parseFloat(minSalary) : null,
        experience_level: experienceLevel || null,
        remote_only: remoteOnly
      }

      const { error } = await supabase
        .from('user_job_preferences')
        .upsert(preferences, { onConflict: 'user_id' })

      if (error) throw error

      toast({
        title: "Préférences enregistrées",
        description: "Vos recommandations seront mises à jour"
      })

      onSave?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les préférences",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const toggleCategory = (category: string) => {
    setCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleLocation = (location: string) => {
    setLocations(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    )
  }

  const toggleJobType = (type: string) => {
    setJobTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Préférences d'emploi
          </DialogTitle>
          <DialogDescription>
            Personnalisez vos recommandations d'offres d'emploi
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <Loader2 className="h-6 w-6 mx-auto animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            {/* Categories */}
            <div className="space-y-2">
              <Label>Catégories préférées</Label>
              <div className="flex flex-wrap gap-2">
                {JOB_CATEGORIES.map(category => (
                  <Badge
                    key={category}
                    variant={categories.includes(category) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    {categories.includes(category) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-2">
              <Label>Localisations préférées</Label>
              <div className="flex flex-wrap gap-2">
                {AFRICAN_LOCATIONS.map(location => (
                  <Badge
                    key={location}
                    variant={locations.includes(location) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleLocation(location)}
                  >
                    {location}
                    {locations.includes(location) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Job Types */}
            <div className="space-y-2">
              <Label>Types de contrat</Label>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map(type => (
                  <Badge
                    key={type.value}
                    variant={jobTypes.includes(type.value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleJobType(type.value)}
                  >
                    {type.label}
                    {jobTypes.includes(type.value) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="space-y-2">
              <Label>Niveau d'expérience</Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les niveaux</SelectItem>
                  {EXPERIENCE_LEVELS.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Minimum Salary */}
            <div className="space-y-2">
              <Label>Salaire minimum (FCFA/mois)</Label>
              <Input
                type="number"
                placeholder="Ex: 500000"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
            </div>

            {/* Remote Only */}
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <Label htmlFor="remoteOnly" className="cursor-pointer">
                Uniquement les offres en télétravail
              </Label>
              <Button
                type="button"
                variant={remoteOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRemoteOnly(!remoteOnly)}
              >
                {remoteOnly ? 'Oui' : 'Non'}
              </Button>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={saving}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default JobPreferencesDialog
