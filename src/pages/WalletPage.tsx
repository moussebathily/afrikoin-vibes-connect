import React, { useEffect, useState } from "react";
import {
  Wallet,
  Plus,
  Minus,
  TrendingUp,
  Clock,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function WalletPage() {
  const [balance, setBalance] = useState<any>(null);
  const [likeCredits, setLikeCredits] = useState<any>(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  const fetchWalletData = async () => {
    try {
      // Fetch user balance
      const { data: balanceData } = await supabase
        .from("user_balances")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      setBalance(balanceData);

      // Fetch like credits
      const { data: creditsData } = await supabase
        .from("like_credits")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      setLikeCredits(creditsData);

      // Fetch recent transactions
      const { data: transactionsData } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setTransactions(transactionsData || []);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyLikes = async () => {
    if (!user) return;

    setPurchaseLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-like-checkout",
        {
          body: { pack_id: "likes_1000" },
        },
      );

      if (error) throw error;

      if (data.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating checkout:", error);
      toast.error("Erreur lors de la création du paiement");
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-2xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-primary rounded-xl p-6 text-primary-foreground">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Wallet className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Mon Wallet</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30 border-0"
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            Statistiques
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-primary-foreground/80 text-sm">
              Solde disponible
            </p>
            <p className="text-2xl font-bold">
              {formatCurrency(balance?.available_balance || 0)}
            </p>
          </div>
          <div>
            <p className="text-primary-foreground/80 text-sm">En attente</p>
            <p className="text-2xl font-bold">
              {formatCurrency(balance?.pending_balance || 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Like Credits */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center">
            <span className="text-red-500 mr-2">❤️</span>
            Crédits de Likes
          </h3>
          <Button
            onClick={handleBuyLikes}
            disabled={purchaseLoading}
            variant="gradient"
            size="sm"
          >
            {purchaseLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
            ) : (
              <Plus className="h-4 w-4 mr-1" />
            )}
            {t("likes.purchase.button_buy", { likes: "1000", price: "2,99 €" })}
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">
              {likeCredits?.balance || 0}
            </p>
            <p className="text-sm text-muted-foreground">Disponibles</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {likeCredits?.total_purchased || 0}
            </p>
            <p className="text-sm text-muted-foreground">Achetés</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-muted-foreground">
              {likeCredits?.total_used || 0}
            </p>
            <p className="text-sm text-muted-foreground">Utilisés</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Plus className="h-6 w-6 text-success" />
          <span>Recharger</span>
        </Button>

        <Button variant="outline" className="h-20 flex-col space-y-2">
          <Minus className="h-6 w-6 text-destructive" />
          <span>Retirer</span>
        </Button>
      </div>

      {/* Payment Methods */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="font-semibold mb-4">Méthodes de paiement</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-500 text-white p-2 rounded-lg">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Orange Money</p>
                <p className="text-sm text-muted-foreground">Mobile Money</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Ajouter
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500 text-white p-2 rounded-lg">
                <Smartphone className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">MTN Money</p>
                <p className="text-sm text-muted-foreground">Mobile Money</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Ajouter
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Carte bancaire</p>
                <p className="text-sm text-muted-foreground">
                  Visa, Mastercard
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Ajouter
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Transactions récentes</h3>
          <Button variant="ghost" size="sm">
            Voir tout
          </Button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Aucune transaction pour le moment
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      transaction.transaction_type === "deposit"
                        ? "bg-success/20 text-success"
                        : transaction.transaction_type === "withdrawal"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-primary/20 text-primary"
                    }`}
                  >
                    {transaction.transaction_type === "deposit" ? (
                      <Plus className="h-4 w-4" />
                    ) : transaction.transaction_type === "withdrawal" ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <TrendingUp className="h-4 w-4" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium">
                      {transaction.transaction_type === "deposit"
                        ? "Dépôt"
                        : transaction.transaction_type === "withdrawal"
                          ? "Retrait"
                          : "Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatRelativeTime(transaction.created_at)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.transaction_type === "deposit"
                        ? "text-success"
                        : transaction.transaction_type === "withdrawal"
                          ? "text-destructive"
                          : "text-foreground"
                    }`}
                  >
                    {transaction.transaction_type === "withdrawal" ? "-" : "+"}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
