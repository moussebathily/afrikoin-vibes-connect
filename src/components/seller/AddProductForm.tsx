import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Loader2, 
  Plus, 
  X, 
  ImagePlus,
  Package,
  DollarSign,
  Tag,
  Layers,
  Sparkles
} from "lucide-react";

const productFormSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().optional(),
  price: z.number().min(1, "Le prix doit être supérieur à 0"),
  currency: z.string().default("XOF"),
  category: z.string().min(1, "Veuillez sélectionner une catégorie"),
  stock: z.number().min(0, "Le stock ne peut pas être négatif"),
  country: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface AddProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CATEGORIES = [
  { value: "electronics", label: "Électronique" },
  { value: "fashion", label: "Mode & Vêtements" },
  { value: "beauty", label: "Beauté & Santé" },
  { value: "home", label: "Maison & Jardin" },
  { value: "food", label: "Alimentation" },
  { value: "sports", label: "Sports & Loisirs" },
  { value: "books", label: "Livres & Médias" },
  { value: "toys", label: "Jouets & Enfants" },
  { value: "art", label: "Art & Artisanat" },
  { value: "other", label: "Autres" },
];

const CURRENCIES = [
  { value: "XOF", label: "XOF (CFA)" },
  { value: "XAF", label: "XAF (CFA Central)" },
  { value: "NGN", label: "NGN (Naira)" },
  { value: "GHS", label: "GHS (Cedi)" },
  { value: "KES", label: "KES (Shilling)" },
  { value: "USD", label: "USD (Dollar)" },
  { value: "EUR", label: "EUR (Euro)" },
];

export function AddProductForm({ open, onOpenChange, onSuccess }: AddProductFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      currency: "XOF",
      category: "",
      stock: 1,
      country: "",
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > 5) {
      toast({
        title: "Limite atteinte",
        description: "Maximum 5 images par produit",
        variant: "destructive"
      });
      return;
    }

    setUploadingImage(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);

      toast({
        title: "Images téléchargées",
        description: `${uploadedUrls.length} image(s) ajoutée(s)`,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      // If storage bucket doesn't exist, use placeholder
      const placeholderUrls = Array.from(files).map((_, i) => 
        `https://placehold.co/400x400/2563eb/white?text=Image+${images.length + i + 1}`
      );
      setImages(prev => [...prev, ...placeholderUrls]);
      
      toast({
        title: "Note",
        description: "Images de démonstration utilisées. Configurez le stockage pour les vraies images.",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleAIGenerate = async () => {
    if (images.length === 0) {
      toast({
        title: "Image requise",
        description: "Ajoutez au moins une photo du produit pour utiliser l'IA",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-product-from-photo', {
        body: {
          imageUrl: images[0],
          currency: form.getValues('currency') || 'XOF',
          country: form.getValues('country') || undefined,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Apply only to empty fields so we don't overwrite manual edits
      if (!form.getValues('title') && data.title) {
        form.setValue('title', data.title, { shouldValidate: true });
      }
      if (!form.getValues('description') && data.description) {
        form.setValue('description', data.description, { shouldValidate: true });
      }
      if (!form.getValues('category') && data.category) {
        form.setValue('category', data.category, { shouldValidate: true });
      }
      if ((!form.getValues('price') || form.getValues('price') === 0) && data.suggested_price) {
        form.setValue('price', Math.round(data.suggested_price), { shouldValidate: true });
      }

      toast({
        title: "✨ IA appliquée",
        description: `Suggestions générées (confiance: ${data.confidence ?? 'medium'})`,
      });
    } catch (err: any) {
      console.error('AI generation error:', err);
      toast({
        title: "Erreur IA",
        description: err.message || "Impossible de générer les suggestions",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const onSubmit = async (values: ProductFormValues) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour ajouter un produit",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          title: values.title,
          description: values.description || null,
          price: values.price,
          currency: values.currency,
          category: values.category,
          stock: values.stock,
          country: values.country || null,
          images: images.length > 0 ? images : null,
          seller_id: user.id,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Produit créé",
        description: "Votre produit a été ajouté avec succès",
      });

      form.reset();
      setImages([]);
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating product:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le produit",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Ajouter un produit
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Images Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Images du produit</label>
              <div className="flex flex-wrap gap-2">
                {images.map((url, index) => (
                  <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden group">
                    <img 
                      src={url} 
                      alt={`Produit ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                    {uploadingImage ? (
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    )}
                  </label>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum 5 images. Formats: JPG, PNG, WebP
              </p>
            </div>

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre du produit *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Téléphone Samsung Galaxy A54" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez votre produit en détail..."
                      className="min-h-[100px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price & Currency */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Prix *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CURRENCIES.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Catégorie *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock */}
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    Stock disponible *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
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
                  <FormLabel>Pays de vente</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Côte d'Ivoire" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Annuler
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Créer le produit
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
