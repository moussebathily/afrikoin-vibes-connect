import React, { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { 
  Car, Plus, Pencil, Trash2, CheckCircle, Ban, 
  Users, AlertTriangle
} from 'lucide-react'
import type { Vehicle, Driver, VehicleType } from '@/types/transport'

interface AdminVehicleManagementProps {
  vehicles: Vehicle[]
  drivers: Driver[]
  onRefresh: () => void
}

interface VehicleFormData {
  driver_id: string
  vehicle_type: VehicleType
  brand: string
  model: string
  year: number | null
  color: string
  plate_number: string
  seats: number
  luggage_capacity: number
  has_ac: boolean
  max_weight_kg: number | null
  cargo_volume_m3: number | null
}

const defaultFormData: VehicleFormData = {
  driver_id: '',
  vehicle_type: 'taxi',
  brand: '',
  model: '',
  year: null,
  color: '',
  plate_number: '',
  seats: 4,
  luggage_capacity: 2,
  has_ac: false,
  max_weight_kg: null,
  cargo_volume_m3: null,
}

export function AdminVehicleManagement({ vehicles, drivers, onRefresh }: AdminVehicleManagementProps) {
  const { toast } = useToast()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState<VehicleFormData>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const vehicleTypeLabels: Record<VehicleType, string> = {
    moto: 'Moto',
    taxi: 'Taxi',
    utility: 'Utilitaire',
    rental: 'Location'
  }

  const resetForm = () => {
    setFormData(defaultFormData)
    setSelectedVehicle(null)
  }

  const openEditDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setFormData({
      driver_id: vehicle.driver_id,
      vehicle_type: vehicle.vehicle_type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year || null,
      color: vehicle.color || '',
      plate_number: vehicle.plate_number,
      seats: vehicle.seats || 4,
      luggage_capacity: vehicle.luggage_capacity || 2,
      has_ac: vehicle.has_ac || false,
      max_weight_kg: vehicle.max_weight_kg || null,
      cargo_volume_m3: vehicle.cargo_volume_m3 || null,
    })
    setIsEditOpen(true)
  }

  const openDeleteDialog = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle)
    setIsDeleteOpen(true)
  }

  const handleAddVehicle = async () => {
    if (!formData.driver_id || !formData.brand || !formData.model || !formData.plate_number) {
      toast({ title: 'Erreur', description: 'Veuillez remplir tous les champs obligatoires', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('vehicles').insert({
        driver_id: formData.driver_id,
        vehicle_type: formData.vehicle_type,
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        color: formData.color || null,
        plate_number: formData.plate_number,
        seats: formData.seats,
        luggage_capacity: formData.luggage_capacity,
        has_ac: formData.has_ac,
        max_weight_kg: formData.max_weight_kg,
        cargo_volume_m3: formData.cargo_volume_m3,
        is_active: true,
        is_verified: false,
      })

      if (error) throw error

      toast({ title: 'Succès', description: 'Véhicule ajouté avec succès' })
      setIsAddOpen(false)
      resetForm()
      onRefresh()
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message || 'Impossible d\'ajouter le véhicule', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateVehicle = async () => {
    if (!selectedVehicle) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          driver_id: formData.driver_id,
          vehicle_type: formData.vehicle_type,
          brand: formData.brand,
          model: formData.model,
          year: formData.year,
          color: formData.color || null,
          plate_number: formData.plate_number,
          seats: formData.seats,
          luggage_capacity: formData.luggage_capacity,
          has_ac: formData.has_ac,
          max_weight_kg: formData.max_weight_kg,
          cargo_volume_m3: formData.cargo_volume_m3,
        })
        .eq('id', selectedVehicle.id)

      if (error) throw error

      toast({ title: 'Succès', description: 'Véhicule mis à jour avec succès' })
      setIsEditOpen(false)
      resetForm()
      onRefresh()
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message || 'Impossible de mettre à jour le véhicule', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', selectedVehicle.id)

      if (error) throw error

      toast({ title: 'Succès', description: 'Véhicule supprimé avec succès' })
      setIsDeleteOpen(false)
      resetForm()
      onRefresh()
    } catch (error: any) {
      toast({ title: 'Erreur', description: error.message || 'Impossible de supprimer le véhicule', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateVehicleStatus = async (vehicleId: string, isActive: boolean, isVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_active: isActive, is_verified: isVerified })
        .eq('id', vehicleId)

      if (error) throw error

      toast({ title: 'Succès', description: 'Statut du véhicule mis à jour' })
      onRefresh()
    } catch (error) {
      toast({ title: 'Erreur', description: 'Impossible de mettre à jour le statut', variant: 'destructive' })
    }
  }

  const VehicleForm = ({ onSubmit, submitLabel }: { onSubmit: () => void; submitLabel: string }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="driver">Chauffeur *</Label>
          <Select value={formData.driver_id} onValueChange={(value) => setFormData({ ...formData, driver_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un chauffeur" />
            </SelectTrigger>
            <SelectContent>
              {drivers.map(driver => (
                <SelectItem key={driver.id} value={driver.id}>
                  {driver.full_name} - {driver.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="vehicle_type">Type *</Label>
          <Select value={formData.vehicle_type} onValueChange={(value: VehicleType) => setFormData({ ...formData, vehicle_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="moto">Moto</SelectItem>
              <SelectItem value="taxi">Taxi</SelectItem>
              <SelectItem value="utility">Utilitaire</SelectItem>
              <SelectItem value="rental">Location</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="plate_number">Immatriculation *</Label>
          <Input
            id="plate_number"
            value={formData.plate_number}
            onChange={(e) => setFormData({ ...formData, plate_number: e.target.value.toUpperCase() })}
            placeholder="AB-123-CD"
          />
        </div>

        <div>
          <Label htmlFor="brand">Marque *</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="Toyota"
          />
        </div>

        <div>
          <Label htmlFor="model">Modèle *</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            placeholder="Corolla"
          />
        </div>

        <div>
          <Label htmlFor="year">Année</Label>
          <Input
            id="year"
            type="number"
            value={formData.year || ''}
            onChange={(e) => setFormData({ ...formData, year: e.target.value ? parseInt(e.target.value) : null })}
            placeholder="2020"
          />
        </div>

        <div>
          <Label htmlFor="color">Couleur</Label>
          <Input
            id="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="Blanc"
          />
        </div>

        <div>
          <Label htmlFor="seats">Places</Label>
          <Input
            id="seats"
            type="number"
            value={formData.seats}
            onChange={(e) => setFormData({ ...formData, seats: parseInt(e.target.value) || 4 })}
          />
        </div>

        <div>
          <Label htmlFor="luggage">Bagages</Label>
          <Input
            id="luggage"
            type="number"
            value={formData.luggage_capacity}
            onChange={(e) => setFormData({ ...formData, luggage_capacity: parseInt(e.target.value) || 2 })}
          />
        </div>

        {(formData.vehicle_type === 'utility') && (
          <>
            <div>
              <Label htmlFor="max_weight">Poids max (kg)</Label>
              <Input
                id="max_weight"
                type="number"
                value={formData.max_weight_kg || ''}
                onChange={(e) => setFormData({ ...formData, max_weight_kg: e.target.value ? parseInt(e.target.value) : null })}
                placeholder="1000"
              />
            </div>
            <div>
              <Label htmlFor="cargo_volume">Volume cargo (m³)</Label>
              <Input
                id="cargo_volume"
                type="number"
                step="0.1"
                value={formData.cargo_volume_m3 || ''}
                onChange={(e) => setFormData({ ...formData, cargo_volume_m3: e.target.value ? parseFloat(e.target.value) : null })}
                placeholder="5.0"
              />
            </div>
          </>
        )}

        <div className="col-span-2 flex items-center gap-2">
          <input
            type="checkbox"
            id="has_ac"
            checked={formData.has_ac}
            onChange={(e) => setFormData({ ...formData, has_ac: e.target.checked })}
            className="rounded"
          />
          <Label htmlFor="has_ac">Climatisation</Label>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" onClick={resetForm}>Annuler</Button>
        </DialogClose>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'En cours...' : submitLabel}
        </Button>
      </DialogFooter>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Add Vehicle Button */}
      <div className="flex justify-end">
        <Dialog open={isAddOpen} onOpenChange={(open) => { setIsAddOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un véhicule</DialogTitle>
            </DialogHeader>
            <VehicleForm onSubmit={handleAddVehicle} submitLabel="Ajouter" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Vehicles List */}
      {vehicles.map(vehicle => {
        const driver = vehicle.driver || drivers.find(d => d.id === vehicle.driver_id)
        
        return (
          <Card key={vehicle.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{vehicle.brand} {vehicle.model}</h4>
                    <p className="text-sm text-muted-foreground font-mono">{vehicle.plate_number}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{vehicleTypeLabels[vehicle.vehicle_type]}</Badge>
                      {vehicle.is_verified ? (
                        <Badge className="bg-green-500/20 text-green-700">Vérifié</Badge>
                      ) : (
                        <Badge variant="destructive">Non vérifié</Badge>
                      )}
                      {!vehicle.is_active && (
                        <Badge variant="secondary">Inactif</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {vehicle.year && <p className="text-sm">{vehicle.year}</p>}
                  {vehicle.color && <p className="text-sm text-muted-foreground">{vehicle.color}</p>}
                  <p className="text-sm">{vehicle.seats} places</p>
                </div>
              </div>

              {driver && (
                <div className="flex items-center gap-2 mt-3 p-2 bg-muted/50 rounded">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{driver.full_name}</span>
                  <span className="text-xs text-muted-foreground">{driver.phone}</span>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {!vehicle.is_verified && (
                  <Button 
                    size="sm" 
                    onClick={() => updateVehicleStatus(vehicle.id, true, true)}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Vérifier
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant={vehicle.is_active ? "outline" : "default"}
                  onClick={() => updateVehicleStatus(vehicle.id, !vehicle.is_active, vehicle.is_verified)}
                  className="flex-1"
                >
                  {vehicle.is_active ? <Ban className="h-4 w-4 mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                  {vehicle.is_active ? 'Désactiver' : 'Activer'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => openEditDialog(vehicle)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => openDeleteDialog(vehicle)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {vehicles.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Car className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Aucun véhicule trouvé</p>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => { setIsEditOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le véhicule</DialogTitle>
          </DialogHeader>
          <VehicleForm onSubmit={handleUpdateVehicle} submitLabel="Enregistrer" />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={(open) => { setIsDeleteOpen(open); if (!open) resetForm(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Supprimer le véhicule
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer le véhicule{' '}
            <strong>{selectedVehicle?.brand} {selectedVehicle?.model}</strong> ({selectedVehicle?.plate_number}) ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteVehicle} disabled={isSubmitting}>
              {isSubmitting ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
