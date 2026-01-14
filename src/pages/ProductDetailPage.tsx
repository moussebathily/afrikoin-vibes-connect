import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, ShoppingCart, Truck, Shield, MapPin, Package, Star, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ImageGallery } from '@/components/products/ImageGallery';
import { ProductReviews } from '@/components/products/ProductReviews';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import type { Product } from '@/types/cart';

interface ExtendedProduct extends Product {
  average_rating?: number;
  reviews_count?: number;
}

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
  profiles?: {
    name?: string;
    display_name?: string;
    avatar_url?: string;
  };
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
      incrementViewCount();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProduct(data as ExtendedProduct);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Produit non trouvé');
      navigate('/marketplace');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await supabase
        .from('product_reviews')
        .select('*, profiles:user_id(name, display_name, avatar_url)')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      setReviews((data || []) as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const incrementViewCount = async () => {
    // Skip view count increment - would need a database function
    // This is handled separately or can be added later
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency === 'XOF' ? 'XOF' : currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
      toast.success(`${quantity} article(s) ajouté(s) au panier`);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.title,
        text: product?.description,
        url: window.location.href
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Lien copié !');
    }
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-12 bg-muted rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="-ml-2">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <ImageGallery images={product.images || []} title={product.title} />

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Rating */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl lg:text-3xl font-bold">{product.title}</h1>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsLiked(!isLiked)}
                  className={isLiked ? 'text-red-500' : ''}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(product.average_rating || 0) 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {(product.average_rating || 0).toFixed(1)} ({product.reviews_count || 0} avis)
              </span>
            </div>

            {/* Location */}
            {product.country && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                <MapPin className="w-4 h-4" />
                {product.country}
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(product.price, product.currency)}
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.is_featured && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Produit vedette
              </Badge>
            )}
            {product.category && (
              <Badge variant="secondary">{product.category}</Badge>
            )}
            {product.stock > 0 && product.stock < 5 && (
              <Badge variant="destructive">Plus que {product.stock} en stock</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary">Rupture de stock</Badge>
            )}
          </div>

          <div className="h-px bg-border my-4" />

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>
          )}

          <div className="h-px bg-border my-4" />

          {/* Quantity Selector */}
          <div>
            <h3 className="font-semibold mb-3">Quantité</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} disponible(s)
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3">
            <Button 
              size="lg" 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
            >
              <ShoppingCart className={`w-5 h-5 mr-2 ${isAddingToCart ? 'animate-bounce' : ''}`} />
              {isAddingToCart ? 'Ajout...' : 'Ajouter au panier'}
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <Card>
              <CardContent className="flex items-center gap-3 p-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Livraison rapide</p>
                  <p className="text-xs text-muted-foreground">2-5 jours ouvrés</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">Paiement sécurisé</p>
                  <p className="text-xs text-muted-foreground">Escrow protection</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ProductReviews 
        productId={product.id}
        reviews={reviews}
        averageRating={product.average_rating || 0}
        reviewsCount={product.reviews_count || 0}
        onReviewAdded={fetchReviews}
      />
    </div>
  );
}
