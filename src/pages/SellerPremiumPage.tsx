import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Check, ArrowLeft, Sparkles, TrendingUp, BadgeCheck, BarChart3, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  {
    id: "monthly",
    name: "Mensuel",
    price: 5000,
    period: "/mois",
    highlight: false,
    savings: null,
  },
  {
    id: "quarterly",
    name: "Trimestriel",
    price: 13500,
    period: "/3 mois",
    highlight: true,
    savings: "Économisez 10%",
  },
  {
    id: "yearly",
    name: "Annuel",
    price: 48000,
    period: "/an",
    highlight: false,
    savings: "Économisez 20%",
  },
];

const FEATURES = [
  { icon: Sparkles, text: "Produits en vedette dans le marketplace" },
  { icon: BadgeCheck, text: "Badge Premium vérifié sur votre boutique" },
  { icon: BarChart3, text: "Statistiques avancées et exports CSV" },
  { icon: TrendingUp, text: "Boost SEO + score de confiance +15 points" },
  { icon: Zap, text: "Réponse prioritaire au support" },
  { icon: Check, text: "Publications illimitées de produits" },
];

export default function SellerPremiumPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const subscribe = async (plan: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setLoading(plan);
    try {
      const { data, error } = await supabase.functions.invoke("seller-premium-subscribe", {
        body: { plan, payment_method: "mobile_money" },
      });
      if (error) throw error;
      toast({
        title: "Bienvenue chez Premium ! 🎉",
        description: `Votre abonnement ${data.plan} est actif jusqu'au ${new Date(data.expires_at).toLocaleDateString("fr-FR")}.`,
      });
      setTimeout(() => navigate("/seller"), 1500);
    } catch (e: any) {
      toast({
        title: "Erreur",
        description: e.message || "Impossible d'activer l'abonnement",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-safe-nav">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-500" />
            Premium Vendeur
          </h1>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto p-4 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3 py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
            <Crown className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold">Boostez votre boutique</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Augmentez votre visibilité, gagnez la confiance des acheteurs et vendez plus avec Premium.
          </p>
        </div>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Ce que vous obtenez</CardTitle>
            <CardDescription>Tous les avantages inclus dans chaque formule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-md bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm">{f.text}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${plan.highlight ? "border-primary shadow-lg scale-[1.02]" : ""}`}
            >
              {plan.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                  Populaire
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                {plan.savings && (
                  <CardDescription className="text-success font-medium">{plan.savings}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-3xl font-bold">{plan.price.toLocaleString("fr-FR")}</span>
                  <span className="text-muted-foreground"> XOF{plan.period}</span>
                </div>
                <Button
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => subscribe(plan.id)}
                  disabled={loading !== null}
                >
                  {loading === plan.id ? "Activation..." : "Choisir"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Paiement via Mobile Money (Orange, Wave, MTN). Annulation possible à tout moment.
        </p>
      </div>
    </div>
  );
}
