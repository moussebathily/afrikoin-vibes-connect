import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Store, 
  Upload, 
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2
} from "lucide-react";

const storeFormSchema = z.object({
  store_name: z
    .string()
    .trim()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  store_description: z
    .string()
    .trim()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
  business_type: z.enum(["individual", "business"]),
  country: z
    .string()
    .trim()
    .min(2, "Veuillez sélectionner un pays")
    .max(50, "Pays invalide"),
  city: z
    .string()
    .trim()
    .max(50, "La ville ne peut pas dépasser 50 caractères")
    .optional(),
  address: z
    .string()
    .trim()
    .max(200, "L'adresse ne peut pas dépasser 200 caractères")
    .optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{8,20}$/, "Numéro de téléphone invalide")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Email invalide")
    .max(100, "Email trop long")
    .optional()
    .or(z.literal("")),
  website: z
    .string()
    .trim()
    .url("URL invalide")
    .max(200, "URL trop longue")
    .optional()
    .or(z.literal("")),
});

type StoreFormData = z.infer<typeof storeFormSchema>;

const africanCountries = [
  "Sénégal", "Côte d'Ivoire", "Mali", "Burkina Faso", "Niger", "Guinée",
  "Bénin", "Togo", "Cameroun", "Gabon", "Congo", "RD Congo",
  "Nigeria", "Ghana", "Kenya", "Tanzanie", "Ouganda", "Rwanda",
  "Éthiopie", "Maroc", "Algérie", "Tunisie", "Égypte", "Afrique du Sud"
];

interface CreateStoreFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateStoreForm({ open, onOpenChange, onSuccess }: CreateStoreFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const form = useForm<StoreFormData>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      store_name: "",
      store_description: "",
      business_type: "individual",
      country: "",
      city: "",
      address: "",
      phone: "",
      email: "",
      website: "",
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "Le logo ne doit pas dépasser 2 Mo",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Format invalide",
          description: "Veuillez sélectionner une image",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: StoreFormData) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une boutique",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let logoUrl: string | undefined;

      // Upload logo if provided
      if (logoFile) {
        const fileExt = logoFile.name.split(".").pop();
        const fileName = `${user.id}-logo-${Date.now()}.${fileExt}`;
        
        // Note: In production, you'd upload to Supabase Storage
        // For now, we'll use the base64 preview as a placeholder
        logoUrl = logoPreview || undefined;
      }

      // Create seller profile
      const { error } = await supabase.from("seller_profiles").insert({
        user_id: user.id,
        store_name: data.store_name,
        store_description: data.store_description || null,
        logo_url: logoUrl,
        business_type: data.business_type,
        country: data.country,
        city: data.city || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        website: data.website || null,
      });

      if (error) {
        if (error.code === "23505") {
          throw new Error("Vous avez déjà une boutique");
        }
        throw error;
      }

      toast({
        title: "Boutique créée !",
        description: "Votre boutique a été créée avec succès",
      });

      form.reset();
      setLogoPreview(null);
      setLogoFile(null);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating store:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer la boutique",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Créer ma boutique
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations de votre boutique pour commencer à vendre
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Logo Upload */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-dashed border-primary/50">
                <AvatarImage src={logoPreview || ""} />
                <AvatarFallback className="bg-primary/10">
                  <Store className="h-10 w-10 text-primary" />
                </AvatarFallback>
              </Avatar>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {logoPreview ? "Changer le logo" : "Ajouter un logo"}
                  </span>
                </Button>
              </label>
            </div>

            {/* Store Name */}
            <FormField
              control={form.control}
              name="store_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la boutique *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ma Super Boutique" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="store_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez votre boutique et vos produits..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 caractères
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Business Type */}
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Type de vendeur *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="individual">Particulier</SelectItem>
                      <SelectItem value="business">Entreprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Pays *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre pays" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {africanCountries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Dakar, Abidjan, Lagos..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Contact Section */}
            <div className="space-y-4 pt-2 border-t">
              <h4 className="font-medium text-sm text-muted-foreground">
                Informations de contact (optionnel)
              </h4>

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+221 77 123 45 67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email professionnel
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="contact@maboutique.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Site web
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.maboutique.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Store className="h-4 w-4 mr-2" />
                    Créer ma boutique
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
