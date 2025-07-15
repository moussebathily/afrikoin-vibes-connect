import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Coins, ShoppingCart, Gift, Star, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useInAppPurchase } from '@/hooks/useInAppPurchase';
import { Language } from '@/types/language';

interface LikeCreditsWidgetProps {
  language: Language;
  compact?: boolean;
}

interface LikeCredits {
  balance: number;
  total_purchased: number;
  total_used: number;
}

const LikeCreditsWidget: React.FC<LikeCreditsWidgetProps> = ({ language, compact = false }) => {
  const [credits, setCredits] = useState<LikeCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { isInitialized, LIKE_PACKS, purchasePack, isLoading: purchaseLoading } = useInAppPurchase();

  const text = {
    fr: {
      title: 'Mes Likes',
      balance: 'Solde',
      purchased: 'Achetés',
      used: 'Utilisés',
      buyPacks: 'Acheter des Likes',
      loading: 'Chargement...',
      error: 'Erreur de chargement',
      refresh: 'Actualiser',
      likes: 'likes',
      buy: 'Acheter',
      free: 'Gratuit',
      starter: 'Starter',
      pro: 'Pro',
      premium: 'Premium'
    },
    en: {
      title: 'My Likes',
      balance: 'Balance',
      purchased: 'Purchased',
      used: 'Used',
      buyPacks: 'Buy Likes',
      loading: 'Loading...',
      error: 'Loading error',
      refresh: 'Refresh',
      likes: 'likes',
      buy: 'Buy',
      free: 'Free',
      starter: 'Starter',
      pro: 'Pro',
      premium: 'Premium'
    }
  };

  const currentText = text[language] || text.fr;

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('like_credits')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading credits:', error);
        // Si aucun enregistrement, créer un avec des likes gratuits
        if (error.code === 'PGRST116') {
          const { data: newCredits, error: insertError } = await supabase
            .from('like_credits')
            .insert({
              user_id: user.id,
              balance: 10,
              total_purchased: 0,
              total_used: 0
            })
            .select()
            .single();

          if (insertError) throw insertError;
          setCredits(newCredits);
        } else {
          throw error;
        }
      } else {
        setCredits(data);
      }
    } catch (error) {
      console.error('Failed to load credits:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger votre solde de likes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (packId: string) => {
    try {
      await purchasePack(packId);
      // Recharger les crédits après achat
      setTimeout(() => loadCredits(), 2000);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2 bg-gradient-to-r from-pink-500/10 to-red-500/10 rounded-full px-3 py-1 border border-pink-200">
        <Heart className="w-4 h-4 text-pink-500" />
        <span className="font-medium text-sm">
          {isLoading ? '...' : credits?.balance || 0}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => window.location.href = '/profile'}
          className="h-6 px-2 text-xs"
        >
          <ShoppingCart className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold">{currentText.title}</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadCredits}
          disabled={isLoading}
        >
          {currentText.refresh}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>{currentText.loading}</span>
          </div>
        </div>
      ) : credits ? (
        <>
          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-green-50 rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{credits.balance.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{currentText.balance}</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{credits.total_purchased.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{currentText.purchased}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">{credits.total_used.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{currentText.used}</div>
            </div>
          </div>

          {/* Packs d'achat */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>{currentText.buyPacks}</span>
            </h4>

            <div className="grid gap-3">
              {LIKE_PACKS.map((pack, index) => {
                const icons = [Gift, Star, Zap];
                const Icon = icons[index];
                const variants = ['outline', 'default', 'default'] as const;
                const colors = ['border-green-200 bg-green-50', 'border-blue-200 bg-blue-50', 'border-purple-200 bg-purple-50'];
                
                return (
                  <Card key={pack.id} className={`p-4 ${colors[index]} transition-all hover:shadow-md`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-semibold">{pack.name}</h5>
                            {index === 2 && <Badge variant="secondary">Meilleure valeur</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {pack.likes.toLocaleString()} {currentText.likes}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{pack.price}</div>
                        <Button
                          size="sm"
                          variant={variants[index]}
                          onClick={() => handlePurchase(pack.id)}
                          disabled={!isInitialized || purchaseLoading}
                          className="mt-1"
                        >
                          <Coins className="w-3 h-3 mr-1" />
                          {currentText.buy}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bonus quotidien */}
          <Card className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center space-x-3">
              <Gift className="w-8 h-8 text-yellow-500" />
              <div>
                <h5 className="font-semibold">Bonus quotidien</h5>
                <p className="text-sm text-muted-foreground">
                  Revenez demain pour 5 likes gratuits !
                </p>
              </div>
            </div>
          </Card>
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {currentText.error}
        </div>
      )}
    </Card>
  );
};

export default LikeCreditsWidget;