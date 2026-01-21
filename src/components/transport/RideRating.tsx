import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Star, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RideRatingProps {
  rideId: string;
  rideNumber: string;
  driverId: string;
  onRatingSubmitted?: () => void;
}

const RideRating = ({ rideId, rideNumber, driverId, onRatingSubmitted }: RideRatingProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  const handleSubmit = async () => {
    if (!user || rating === 0) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ride_reviews')
        .insert({
          ride_id: rideId,
          driver_id: driverId,
          reviewer_id: user.id,
          rating,
          comment: comment.trim() || null
        });

      if (error) {
        // Check if already reviewed
        if (error.code === '23505') {
          toast({
            title: "Déjà noté",
            description: "Vous avez déjà évalué cette course",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Merci ! ⭐",
          description: "Votre avis a été enregistré avec succès",
        });
        setHasRated(true);
        setIsOpen(false);
        onRatingSubmitted?.();
      }
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre avis",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (interactive: boolean = true) => {
    const currentRating = hoverRating || rating;
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            className={`transition-all ${interactive ? 'hover:scale-110 cursor-pointer' : ''}`}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            onClick={() => interactive && setRating(star)}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= currentRating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const getRatingLabel = (value: number) => {
    const labels: Record<number, string> = {
      1: 'Très insatisfait 😞',
      2: 'Insatisfait 😕',
      3: 'Correct 😐',
      4: 'Satisfait 😊',
      5: 'Excellent ! 🤩'
    };
    return labels[value] || 'Évaluez votre course';
  };

  if (hasRated) {
    return (
      <Button variant="ghost" size="sm" disabled className="gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        Noté
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Star className="h-4 w-4" />
          Noter le chauffeur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Évaluez votre course
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Ride info */}
          <div className="text-center text-sm text-muted-foreground">
            Course {rideNumber}
          </div>

          {/* Star rating */}
          <div className="flex flex-col items-center gap-3">
            {renderStars()}
            <p className="text-sm font-medium min-h-6">
              {rating > 0 ? getRatingLabel(rating) : 'Touchez pour évaluer'}
            </p>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Partagez votre expérience (optionnel)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {comment.length}/500
            </p>
          </div>

          {/* Quick feedback chips */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['Ponctuel', 'Conduite sûre', 'Véhicule propre', 'Sympathique', 'Bon itinéraire'].map((chip) => (
              <Button
                key={chip}
                variant={comment.includes(chip) ? "default" : "outline"}
                size="sm"
                className="text-xs"
                onClick={() => {
                  if (comment.includes(chip)) {
                    setComment(comment.replace(chip + ' ', '').replace(chip, ''));
                  } else {
                    setComment(prev => prev ? `${prev} ${chip}` : chip);
                  }
                }}
              >
                {chip}
              </Button>
            ))}
          </div>

          {/* Submit button */}
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer mon avis
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RideRating;
