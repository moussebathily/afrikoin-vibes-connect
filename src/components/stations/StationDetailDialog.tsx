import React, { useState } from 'react'
import type { Station } from '@/pages/StationsPage'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Clock, Phone, Navigation, Fuel, MessageSquare } from 'lucide-react'

const statusConfig = {
  libre: { emoji: '🟢', label: 'Libre', class: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  moyen: { emoji: '🟠', label: 'Moyen', class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  bonde: { emoji: '🔴', label: 'Bondé', class: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
}

const reportOptions = [
  { value: 'libre', emoji: '🟢', label: 'Libre' },
  { value: 'moyen', emoji: '🟠', label: 'Un peu de monde' },
  { value: 'bonde', emoji: '🔴', label: "Trop d'attente" },
]

interface Props {
  station: Station
  open: boolean
  onClose: () => void
}

export default function StationDetailDialog({ station, open, onClose }: Props) {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [reportStatus, setReportStatus] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [showReport, setShowReport] = useState(false)

  const status = statusConfig[station.current_status as keyof typeof statusConfig] || statusConfig.libre

  const reportMutation = useMutation({
    mutationFn: async () => {
      if (!user || !reportStatus) throw new Error('Connexion requise')
      const { error } = await supabase.from('station_reports').insert({
        station_id: station.id,
        user_id: user.id,
        status: reportStatus,
        comment: comment || null,
      })
      if (error) throw error
    },
    onSuccess: () => {
      toast({ title: '✅ Signalement envoyé', description: 'Merci pour votre contribution !' })
      queryClient.invalidateQueries({ queryKey: ['stations'] })
      setShowReport(false)
      setReportStatus(null)
      setComment('')
    },
    onError: () => {
      toast({ title: 'Erreur', description: "Impossible d'envoyer le signalement", variant: 'destructive' })
    },
  })

  const openNavigation = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{station.type === 'kiosque' ? '🏪' : '⛽'}</span>
            {station.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge className={`${status.class} border-0`}>
              {status.emoji} {status.label}
            </Badge>
            {station.brand && (
              <span className="text-sm font-medium text-muted-foreground">{station.brand}</span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
            <div>
              <p>{station.address}</p>
              <p className="text-muted-foreground">{station.city}, {station.country}</p>
            </div>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>{station.is_24h ? '24h/24 - Toujours ouvert' : station.opening_hours || 'Horaires non renseignés'}</span>
          </div>

          {/* Phone */}
          {station.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
              <a href={`tel:${station.phone}`} className="text-primary underline">{station.phone}</a>
            </div>
          )}

          {/* Fuel types */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Fuel className="h-4 w-4" /> Carburants disponibles
            </h4>
            <div className="flex flex-wrap gap-2">
              {station.fuel_types?.map(f => (
                <Badge key={f} variant="secondary" className="capitalize">{f}</Badge>
              ))}
            </div>
          </div>

          {/* Products */}
          {station.products && station.products.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">🛒 Produits & Services</h4>
              <div className="flex flex-wrap gap-2">
                {station.products.map(p => (
                  <Badge key={p} variant="outline" className="capitalize">{p}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Prices */}
          {(station.price_essence || station.price_diesel || station.price_gaz) && (
            <div>
              <h4 className="text-sm font-medium mb-2">💰 Prix</h4>
              <div className="grid grid-cols-3 gap-2">
                {station.price_essence && (
                  <div className="bg-muted rounded-lg p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Essence</p>
                    <p className="font-bold text-sm">{station.price_essence} F</p>
                  </div>
                )}
                {station.price_diesel && (
                  <div className="bg-muted rounded-lg p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Diesel</p>
                    <p className="font-bold text-sm">{station.price_diesel} F</p>
                  </div>
                )}
                {station.price_gaz && (
                  <div className="bg-muted rounded-lg p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">Gaz</p>
                    <p className="font-bold text-sm">{station.price_gaz} F</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation button */}
          <Button onClick={openNavigation} className="w-full" variant="default">
            <Navigation className="h-4 w-4 mr-2" />
            Itinéraire Google Maps
          </Button>

          {/* Community report */}
          {user && !showReport && (
            <Button onClick={() => setShowReport(true)} variant="outline" className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Signaler l'affluence
            </Button>
          )}

          {showReport && (
            <div className="border border-border rounded-lg p-3 space-y-3">
              <h4 className="text-sm font-medium">📢 Signaler l'état actuel</h4>
              <div className="flex gap-2">
                {reportOptions.map(opt => (
                  <Button
                    key={opt.value}
                    variant={reportStatus === opt.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReportStatus(opt.value)}
                    className="flex-1 text-xs"
                  >
                    {opt.emoji} {opt.label}
                  </Button>
                ))}
              </div>
              <Textarea
                placeholder="Commentaire optionnel..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={2}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => { setShowReport(false); setReportStatus(null) }}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={() => reportMutation.mutate()}
                  disabled={!reportStatus || reportMutation.isPending}
                  className="flex-1"
                >
                  {reportMutation.isPending ? 'Envoi...' : 'Envoyer'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
