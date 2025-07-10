import React, { useState } from 'react';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMonetizationStore } from '@/store/monetizationStore';
import { useToast } from '@/hooks/use-toast';
import { Language } from '@/types/language';

interface SubscriptionProps {
  language: Language;
}

const Subscription: React.FC<SubscriptionProps> = ({ language }) => {
  const { subscriptionPlans, userSubscription, setUserSubscription } = useMonetizationStore();
  const [isLoading, setIsLoading] = useState<string>('');
  const { toast } = useToast();

  const text = {
    fr: {
      title: 'Choisissez votre plan',
      subtitle: 'Débloquez tout le potentiel d\'AfriKoin avec nos plans premium',
      currentPlan: 'Plan actuel',
      popular: 'Populaire',
      subscribe: 'S\'abonner',
      manage: 'Gérer l\'abonnement',
      features: 'Fonctionnalités incluses',
      monthlyBilling: '/mois',
      upgradeSuccess: 'Abonnement mis à jour avec succès !',
      upgradeError: 'Erreur lors de la mise à jour de l\'abonnement'
    },
    en: {
      title: 'Choose Your Plan',
      subtitle: 'Unlock the full potential of AfriKoin with our premium plans',
      currentPlan: 'Current Plan',
      popular: 'Popular',
      subscribe: 'Subscribe',
      manage: 'Manage Subscription',
      features: 'Included Features',
      monthlyBilling: '/month',
      upgradeSuccess: 'Subscription updated successfully!',
      upgradeError: 'Error updating subscription'
    }
  };

  const currentText = text[language] || text.fr;

  const handleSubscription = async (planId: string) => {
    setIsLoading(planId);
    
    try {
      // Simulate API call - replace with actual Stripe integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPlan = subscriptionPlans.find(plan => plan.id === planId);
      if (newPlan) {
        setUserSubscription(newPlan);
        toast({
          title: currentText.upgradeSuccess,
          description: `Plan ${newPlan.name} activé`,
        });
      }
    } catch (error) {
      toast({
        title: currentText.upgradeError,
        variant: 'destructive',
      });
    } finally {
      setIsLoading('');
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'basic': return <Star className="h-6 w-6" />;
      case 'premium': return <Crown className="h-6 w-6" />;
      case 'business': return <Zap className="h-6 w-6" />;
      default: return <Star className="h-6 w-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {currentText.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {subscriptionPlans.map((plan) => {
            const isCurrentPlan = userSubscription?.id === plan.id;
            const isPopular = plan.popular;
            
            return (
              <Card 
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  isCurrentPlan 
                    ? 'ring-2 ring-primary shadow-lg' 
                    : isPopular 
                      ? 'ring-2 ring-accent shadow-md' 
                      : 'hover:shadow-md'
                }`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                    {currentText.popular}
                  </Badge>
                )}
                
                {isCurrentPlan && (
                  <Badge className="absolute -top-3 right-4 bg-primary text-primary-foreground">
                    {currentText.currentPlan}
                  </Badge>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4 text-primary">
                    {getPlanIcon(plan.id)}
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">
                    {plan.name}
                  </CardTitle>
                  
                  <div className="text-3xl font-bold text-primary">
                    {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString()} ${plan.currency}`}
                    {plan.price > 0 && (
                      <span className="text-sm text-muted-foreground font-normal">
                        {currentText.monthlyBilling}
                      </span>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-foreground">
                      {currentText.features}:
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => handleSubscription(plan.id)}
                    disabled={isCurrentPlan || isLoading === plan.id}
                    className={`w-full ${
                      isCurrentPlan 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : isPopular
                          ? 'bg-accent hover:bg-accent/90'
                          : ''
                    }`}
                    variant={isCurrentPlan ? 'secondary' : isPopular ? 'default' : 'outline'}
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Chargement...
                      </div>
                    ) : isCurrentPlan ? (
                      currentText.manage
                    ) : (
                      currentText.subscribe
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Comparison Table */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-center">
              Comparaison détaillée des plans
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-semibold">Fonctionnalité</th>
                    {subscriptionPlans.map(plan => (
                      <th key={plan.id} className="p-4 text-center font-semibold">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 font-medium">Annonces par mois</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="p-4 text-center">
                        {plan.limits.listings === -1 ? 'Illimité' : plan.limits.listings}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="p-4 font-medium">Boosts</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="p-4 text-center">
                        {plan.limits.boosts === -1 ? 'Illimité' : plan.limits.boosts}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-medium">Analytics</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="p-4 text-center">
                        {plan.limits.analytics ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-muted/20">
                    <td className="p-4 font-medium">Support prioritaire</td>
                    {subscriptionPlans.map(plan => (
                      <td key={plan.id} className="p-4 text-center">
                        {plan.limits.priority ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;