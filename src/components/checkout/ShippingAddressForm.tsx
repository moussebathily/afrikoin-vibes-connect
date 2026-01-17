import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Loader2 } from 'lucide-react';
import type { ShippingAddress } from '@/types/checkout';

const addressSchema = z.object({
  full_name: z.string().min(2, 'Nom requis'),
  phone: z.string().min(8, 'Numéro de téléphone invalide'),
  address_line1: z.string().min(5, 'Adresse requise'),
  address_line2: z.string().optional(),
  city: z.string().min(2, 'Ville requise'),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(2, 'Pays requis'),
});

type AddressFormData = z.infer<typeof addressSchema>;

interface ShippingAddressFormProps {
  onSubmit: (data: AddressFormData) => void;
  defaultValues?: Partial<ShippingAddress>;
  isLoading?: boolean;
}

const AFRICAN_COUNTRIES = [
  { code: 'CI', name: "Côte d'Ivoire" },
  { code: 'SN', name: 'Sénégal' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'GH', name: 'Ghana' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'KE', name: 'Kenya' },
  { code: 'TZ', name: 'Tanzanie' },
  { code: 'ZA', name: 'Afrique du Sud' },
  { code: 'MA', name: 'Maroc' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'EG', name: 'Égypte' },
];

export const ShippingAddressForm: React.FC<ShippingAddressFormProps> = ({
  onSubmit,
  defaultValues,
  isLoading = false
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      full_name: defaultValues?.full_name || '',
      phone: defaultValues?.phone || '',
      address_line1: defaultValues?.address_line1 || '',
      address_line2: defaultValues?.address_line2 || '',
      city: defaultValues?.city || '',
      state: defaultValues?.state || '',
      postal_code: defaultValues?.postal_code || '',
      country: defaultValues?.country || 'CI',
    }
  });

  const selectedCountry = watch('country');

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MapPin className="h-5 w-5 text-primary" />
          Adresse de livraison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nom complet *</Label>
              <Input
                id="full_name"
                placeholder="Jean Kouassi"
                {...register('full_name')}
                className={errors.full_name ? 'border-destructive' : ''}
              />
              {errors.full_name && (
                <p className="text-xs text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                placeholder="+225 07 00 00 00 00"
                {...register('phone')}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line1">Adresse *</Label>
            <Input
              id="address_line1"
              placeholder="Rue, numéro, quartier"
              {...register('address_line1')}
              className={errors.address_line1 ? 'border-destructive' : ''}
            />
            {errors.address_line1 && (
              <p className="text-xs text-destructive">{errors.address_line1.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Complément d'adresse</Label>
            <Input
              id="address_line2"
              placeholder="Appartement, bâtiment, étage..."
              {...register('address_line2')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                placeholder="Abidjan"
                {...register('city')}
                className={errors.city ? 'border-destructive' : ''}
              />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">Région</Label>
              <Input
                id="state"
                placeholder="Lagunes"
                {...register('state')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Pays *</Label>
              <Select
                value={selectedCountry}
                onValueChange={(value) => setValue('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un pays" />
                </SelectTrigger>
                <SelectContent>
                  {AFRICAN_COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country && (
                <p className="text-xs text-destructive">{errors.country.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              'Continuer vers le paiement'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
