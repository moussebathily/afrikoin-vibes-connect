import React, { useState } from 'react';
import { Star, ThumbsUp, User, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { formatRelativeTime } from '@/lib/utils';

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

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  reviewsCount: number;
  onReviewAdded: () => void;
}

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg'; interactive?: boolean; onChange?: (rating: number) => void }> = ({ 
  rating, 
  size = 'md', 
  interactive = false,
  onChange 
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const sizes = { sm: 'w-3 h-3', md: 'w-5 h-5', lg: 'w-6 h-6' };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
        >
          <Star 
            className={`${sizes[size]} ${
              star <= (hoverRating || rating) 
                ? 'text-amber-400 fill-amber-400' 
                : 'text-muted-foreground/30'
            } transition-colors`} 
          />
        </button>
      ))}
    </div>
  );
};

const RatingDistribution: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
  const distribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="space-y-2">
      {distribution.map(({ rating, count, percentage }) => (
        <div key={rating} className="flex items-center gap-2 text-sm">
          <span className="w-3">{rating}</span>
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="w-8 text-muted-foreground text-right">{count}</span>
        </div>
      ))}
    </div>
  );
};

export const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId, 
  reviews, 
  averageRating, 
  reviewsCount,
  onReviewAdded 
}) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasUserReviewed = reviews.some(r => (r as any).user_id === user?.id);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Connectez-vous pour laisser un avis');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating: newRating,
          title: newTitle || null,
          comment: newComment || null
        } as any);

      if (error) throw error;

      toast.success('Avis publié avec succès !');
      setShowForm(false);
      setNewRating(5);
      setNewTitle('');
      setNewComment('');
      onReviewAdded();
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Vous avez déjà laissé un avis pour ce produit');
      } else {
        toast.error('Erreur lors de la publication de l\'avis');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Avis clients ({reviewsCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="text-5xl font-bold">{averageRating.toFixed(1)}</span>
                <div>
                  <StarRating rating={Math.round(averageRating)} size="lg" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Basé sur {reviewsCount} avis
                  </p>
                </div>
              </div>
            </div>

            {/* Distribution */}
            <RatingDistribution reviews={reviews} />
          </div>

          {/* Write Review Button */}
          {user && !hasUserReviewed && !showForm && (
            <Button 
              onClick={() => setShowForm(true)} 
              className="w-full mt-6"
              variant="outline"
            >
              <Star className="w-4 h-4 mr-2" />
              Écrire un avis
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Review Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Votre avis</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Note</label>
                <StarRating 
                  rating={newRating} 
                  size="lg" 
                  interactive 
                  onChange={setNewRating} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Titre (optionnel)</label>
                <Input 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Résumez votre expérience"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Commentaire</label>
                <Textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Publication...' : 'Publier'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucun avis pour le moment</h3>
              <p className="text-muted-foreground">Soyez le premier à donner votre avis !</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>
                      <User className="w-5 h-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">
                        {review.profiles?.display_name || review.profiles?.name || 'Client'}
                      </span>
                      {review.is_verified_purchase && (
                        <Badge variant="secondary" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Achat vérifié
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(review.created_at)}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-medium mt-2">{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className="text-muted-foreground mt-1">{review.comment}</p>
                    )}
                    <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      Utile ({review.helpful_count})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
