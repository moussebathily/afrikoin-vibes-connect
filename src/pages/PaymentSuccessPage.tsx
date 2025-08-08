import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PaymentSuccessPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [newBalance, setNewBalance] = useState(0);
  const [likesAdded, setLikesAdded] = useState(0);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get("session_id");
      
      if (!sessionId) {
        setLoading(false);
        toast.error(t("likes.payment.error_message"));
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke("verify-like-payment", {
          body: { session_id: sessionId }
        });

        if (error) throw error;

        if (data.success) {
          setSuccess(true);
          setNewBalance(data.new_balance);
          setLikesAdded(data.likes_added);
          
          if (!data.already_processed) {
            toast.success(t("likes.payment.success_message", { likes: data.likes_added }));
          }
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setSuccess(false);
        toast.error(t("likes.payment.error_message"));
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, t]);

  const handleReturnToWallet = () => {
    navigate("/wallet");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-center">{t("likes.payment.loading")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {success ? (
              <CheckCircle className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle>
            {success ? t("likes.payment.success_title") : t("likes.payment.error_title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {success ? (
            <div className="text-center space-y-2">
              <p>{t("likes.payment.success_message", { likes: likesAdded })}</p>
              <p className="font-semibold text-primary">
                {t("likes.payment.new_balance", { balance: newBalance })}
              </p>
            </div>
          ) : (
            <p className="text-center">{t("likes.payment.error_message")}</p>
          )}
          
          <Button 
            onClick={handleReturnToWallet} 
            className="w-full"
            variant="default"
          >
            {t("likes.payment.return_wallet")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}