import React, { useState } from 'react';
import { format, addDays, isBefore, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Phone, 
  Truck,
  Star,
  Shield,
  Clock,
  Heart,
  Loader2,
  ClipboardList
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Types
interface LivestockItem {
  id: string;
  name: string;
  type: 'mouton' | 'chevre' | 'vache';
  breed: string;
  age: string;
  weight: string;
  price: number;
  image: string;
  seller: string;
  location: string;
  rating: number;
  isReserved: boolean;
  isPremium: boolean;
  description: string;
}

// Demo data for Tabaski livestock
const TABASKI_LIVESTOCK: LivestockItem[] = [
  {
    id: 'tab-1',
    name: 'Mouton Ladoum Royal',
    type: 'mouton',
    breed: 'Ladoum',
    age: '2 ans',
    weight: '85 kg',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?w=600',
    seller: 'Ferme Diallo',
    location: 'Dakar, Sénégal',
    rating: 4.9,
    isReserved: false,
    isPremium: true,
    description: 'Magnifique mouton Ladoum de race pure. Cornes imposantes, pelage blanc immaculé. Idéal pour Tabaski.'
  },
  {
    id: 'tab-2',
    name: 'Bélier Touabire',
    type: 'mouton',
    breed: 'Touabire',
    age: '18 mois',
    weight: '65 kg',
    price: 280000,
    image: 'https://images.unsplash.com/photo-1558618047-f4b5d1c7f5a0?w=600',
    seller: 'Élevage Sow',
    location: 'Thiès, Sénégal',
    rating: 4.7,
    isReserved: false,
    isPremium: false,
    description: 'Bélier robuste et bien nourri. Race Touabire très prisée pour sa viande tendre.'
  },
  {
    id: 'tab-3',
    name: 'Mouton Bali-Bali Premium',
    type: 'mouton',
    breed: 'Bali-Bali',
    age: '2.5 ans',
    weight: '90 kg',
    price: 380000,
    image: 'https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=600',
    seller: 'Ranch Niamey',
    location: 'Niamey, Niger',
    rating: 4.8,
    isReserved: true,
    isPremium: true,
    description: 'Superbe bélier Bali-Bali avec cornes torsadées. Très imposant et majestueux.'
  },
  {
    id: 'tab-4',
    name: 'Chèvre Rousse du Maradi',
    type: 'chevre',
    breed: 'Maradi',
    age: '14 mois',
    weight: '35 kg',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600',
    seller: 'Ferme Bio Niger',
    location: 'Maradi, Niger',
    rating: 4.6,
    isReserved: false,
    isPremium: false,
    description: 'Chèvre rousse du Maradi, réputée pour sa viande savoureuse et son cuir de qualité.'
  },
  {
    id: 'tab-5',
    name: 'Bouc Sahélien',
    type: 'chevre',
    breed: 'Sahélien',
    age: '2 ans',
    weight: '45 kg',
    price: 120000,
    image: 'https://images.unsplash.com/photo-1560781290-7dc94c0f8f4f?w=600',
    seller: 'Élevage Traoré',
    location: 'Bamako, Mali',
    rating: 4.5,
    isReserved: false,
    isPremium: false,
    description: 'Bouc robuste adapté au climat sahélien. Excellente viande pour méchoui.'
  },
  {
    id: 'tab-6',
    name: 'Vache N\'Dama Pure Race',
    type: 'vache',
    breed: 'N\'Dama',
    age: '4 ans',
    weight: '320 kg',
    price: 850000,
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=600',
    seller: 'Ranch Casamance',
    location: 'Ziguinchor, Sénégal',
    rating: 4.9,
    isReserved: false,
    isPremium: true,
    description: 'Vache N\'Dama trypanotolérante, race endémique africaine. Viande exceptionnelle.'
  },
  {
    id: 'tab-7',
    name: 'Mouton Peul Blanc',
    type: 'mouton',
    breed: 'Peul',
    age: '16 mois',
    weight: '55 kg',
    price: 195000,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600',
    seller: 'Ferme Peulh',
    location: 'Ouagadougou, Burkina',
    rating: 4.6,
    isReserved: false,
    isPremium: false,
    description: 'Mouton de race Peulh, élevé en plein air. Chair tendre et savoureuse.'
  },
  {
    id: 'tab-8',
    name: 'Bélier Djallonké',
    type: 'mouton',
    breed: 'Djallonké',
    age: '20 mois',
    weight: '40 kg',
    price: 145000,
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=600',
    seller: 'Élevage Conakry',
    location: 'Conakry, Guinée',
    rating: 4.4,
    isReserved: false,
    isPremium: false,
    description: 'Mouton Djallonké résistant aux maladies. Race rustique et viande goûteuse.'
  }
];

const LIVESTOCK_CATEGORIES = [
  { id: 'all', name: 'Tous', icon: '🐑', count: TABASKI_LIVESTOCK.length },
  { id: 'mouton', name: 'Moutons', icon: '🐏', count: TABASKI_LIVESTOCK.filter(l => l.type === 'mouton').length },
  { id: 'chevre', name: 'Chèvres', icon: '🐐', count: TABASKI_LIVESTOCK.filter(l => l.type === 'chevre').length },
  { id: 'vache', name: 'Vaches', icon: '🐄', count: TABASKI_LIVESTOCK.filter(l => l.type === 'vache').length },
];

// Tabaski 2025 date (approximate - Eid al-Adha)
const TABASKI_DATE = new Date(2025, 5, 7); // June 7, 2025

// Generate unique reservation number
const generateReservationNumber = () => {
  const prefix = 'TAB';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export default function TabaskiPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<LivestockItem | null>(null);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const filteredLivestock = selectedCategory === 'all' 
    ? TABASKI_LIVESTOCK 
    : TABASKI_LIVESTOCK.filter(l => l.type === selectedCategory);

  const daysUntilTabaski = Math.ceil((TABASKI_DATE.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleReservation = (item: LivestockItem) => {
    setSelectedItem(item);
    setIsReservationOpen(true);
  };

  const submitReservation = async () => {
    if (!deliveryDate || !formData.fullName || !formData.phone || !formData.address) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    if (!selectedItem) return;

    setIsSubmitting(true);

    try {
      const reservationNumber = generateReservationNumber();

      // Save reservation to database
      const { error: dbError } = await supabase
        .from('tabaski_reservations')
        .insert({
          reservation_number: reservationNumber,
          user_id: user?.id || null,
          livestock_id: selectedItem.id,
          livestock_name: selectedItem.name,
          livestock_type: selectedItem.type,
          livestock_breed: selectedItem.breed,
          livestock_weight: selectedItem.weight,
          livestock_price: selectedItem.price,
          seller_name: selectedItem.seller,
          seller_location: selectedItem.location,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_email: formData.email || null,
          delivery_address: formData.address,
          delivery_date: format(deliveryDate, 'yyyy-MM-dd'),
          notes: formData.notes || null,
          status: 'pending',
          payment_status: 'pending',
          currency: 'XOF'
        });

      if (dbError) {
        throw new Error(dbError.message);
      }

      // Send email notification if email provided
      if (formData.email) {
        try {
          await supabase.functions.invoke('send-tabaski-notification', {
            body: {
              reservationNumber,
              customerName: formData.fullName,
              customerEmail: formData.email,
              customerPhone: formData.phone,
              livestockName: selectedItem.name,
              livestockBreed: selectedItem.breed,
              livestockPrice: selectedItem.price,
              sellerName: selectedItem.seller,
              deliveryDate: format(deliveryDate, 'yyyy-MM-dd'),
              deliveryAddress: formData.address
            }
          });
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
          // Don't fail the reservation if email fails
        }
      }

      toast({
        title: "Réservation confirmée ! 🎉",
        description: `N° ${reservationNumber} - ${selectedItem.name} réservé pour le ${format(deliveryDate, 'PPP', { locale: fr })}`,
      });

      setIsReservationOpen(false);
      setSelectedItem(null);
      setDeliveryDate(undefined);
      setFormData({ fullName: '', phone: '', email: '', address: '', notes: '' });
    } catch (error: any) {
      console.error('Reservation error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la réservation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Disable dates before today and after Tabaski
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return isBefore(date, today) || isAfter(date, addDays(TABASKI_DATE, 1));
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />
        <div className="relative px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="text-2xl">🐑</span>
              <span className="font-medium">Tabaski 2025</span>
              <Badge variant="secondary" className="bg-white/30">
                J-{daysUntilTabaski}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Bétail Tabaski Premium
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
              Réservez dès maintenant votre mouton, chèvre ou vache pour l'Aïd al-Adha. 
              Livraison garantie avant le jour J !
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">{TABASKI_LIVESTOCK.length}</div>
                <div className="text-xs text-white/80">Animaux</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">5</div>
                <div className="text-xs text-white/80">Pays</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-xs text-white/80">Certifié</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* My Reservations Link */}
        {user && (
          <Button 
            variant="outline" 
            onClick={() => navigate('/my-tabaski-reservations')}
            className="w-full gap-2"
          >
            <ClipboardList className="h-4 w-4" />
            Voir mes réservations
          </Button>
        )}

        {/* Guarantees */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Shield, label: 'Animaux certifiés', color: 'text-green-500' },
            { icon: Truck, label: 'Livraison à domicile', color: 'text-blue-500' },
            { icon: Clock, label: 'Livraison J-1', color: 'text-orange-500' },
            { icon: Star, label: 'Vendeurs vérifiés', color: 'text-amber-500' },
          ].map((item, i) => (
            <Card key={i} className="border-dashed">
              <CardContent className="p-3 flex flex-col items-center text-center gap-1">
                <item.icon className={cn("h-5 w-5", item.color)} />
                <span className="text-xs font-medium">{item.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Category Filter */}
        <ScrollArea className="w-full">
          <div className="flex gap-2 pb-2">
            {LIVESTOCK_CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className="flex-shrink-0 gap-2"
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
                <Badge variant="secondary" className={cn(
                  "h-5 px-1.5 text-[10px]",
                  selectedCategory === cat.id && "bg-background/20"
                )}>
                  {cat.count}
                </Badge>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Livestock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLivestock.map((item) => (
            <Card key={item.id} className={cn(
              "overflow-hidden transition-all hover:shadow-lg",
              item.isReserved && "opacity-60"
            )}>
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                {item.isPremium && (
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                    ⭐ Premium
                  </Badge>
                )}
                {item.isReserved && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Réservé
                    </Badge>
                  </div>
                )}
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                >
                  <Heart className={cn(
                    "h-5 w-5 transition-colors",
                    favorites.includes(item.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                  )} />
                </button>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">{item.breed} • {item.age} • {item.weight}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">FCFA</span>
                  </div>
                  <Button 
                    onClick={() => handleReservation(item)}
                    disabled={item.isReserved}
                    className="gap-2"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    Réserver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              Comment ça marche ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { step: '1', title: 'Choisissez', desc: 'Sélectionnez votre animal parmi notre catalogue certifié' },
                { step: '2', title: 'Réservez', desc: 'Choisissez votre date de livraison et confirmez' },
                { step: '3', title: 'Recevez', desc: 'Livraison à domicile la veille de Tabaski' },
              ].map((s) => (
                <div key={s.step} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    {s.step}
                  </div>
                  <div>
                    <h4 className="font-semibold">{s.title}</h4>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reservation Dialog */}
      <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Réserver {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              {/* Selected Item Preview */}
              <Card className="bg-muted/50">
                <CardContent className="p-3 flex gap-3">
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{selectedItem.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedItem.breed} • {selectedItem.weight}</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.seller}</p>
                    <p className="text-lg font-bold text-primary mt-1">
                      {selectedItem.price.toLocaleString()} FCFA
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Date */}
              <div className="space-y-2">
                <Label>Date de livraison souhaitée *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !deliveryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deliveryDate ? format(deliveryDate, 'PPP', { locale: fr }) : "Choisir une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deliveryDate}
                      onSelect={setDeliveryDate}
                      disabled={disabledDays}
                      locale={fr}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <p className="text-xs text-muted-foreground">
                  Livraison possible jusqu'au {format(TABASKI_DATE, 'PPP', { locale: fr })}
                </p>
              </div>

              {/* Contact Form */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Votre nom complet"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+221 77 123 45 67"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (pour confirmation)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse de livraison *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Adresse complète de livraison"
                      className="pl-10 min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes supplémentaires</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Instructions spéciales, préférences..."
                    className="min-h-[60px]"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total à payer</span>
                    <span className="text-2xl font-bold text-primary">
                      {selectedItem.price.toLocaleString()} FCFA
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Paiement à la livraison
                  </p>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button 
                onClick={submitReservation} 
                className="w-full gap-2"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Réservation en cours...
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-4 w-4" />
                    Confirmer la réservation
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                En confirmant, vous acceptez nos conditions de réservation. 
                Le vendeur vous contactera pour confirmer la disponibilité.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
