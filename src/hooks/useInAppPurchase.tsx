import { useState, useEffect } from 'react';
import { InAppPurchase2, IAPProduct } from '@awesome-cordova-plugins/in-app-purchase-2';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LikePack {
  id: string;
  name: string;
  likes: number;
  price: string;
  description: string;
}

export const useInAppPurchase = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [products, setProducts] = useState<IAPProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const LIKE_PACKS: LikePack[] = [
    {
      id: 'com.afrikoin.likes_1000',
      name: 'Pack Starter',
      likes: 1000,
      price: '9.99€',
      description: '1,000 likes pour booster vos publications'
    },
    {
      id: 'com.afrikoin.likes_5000',
      name: 'Pack Pro',
      likes: 5000,
      price: '39.99€',
      description: '5,000 likes pour une présence maximale'
    },
    {
      id: 'com.afrikoin.likes_10000',
      name: 'Pack Premium',
      likes: 10000,
      price: '69.99€',
      description: '10,000 likes pour devenir viral'
    }
  ];

  useEffect(() => {
    initializeStore();
  }, []);

  const initializeStore = async () => {
    try {
      console.log('Initializing in-app purchase store...');
      
      // Configuration du store
      InAppPurchase2.verbosity = InAppPurchase2.DEBUG;
      
      // Enregistrer les produits
      LIKE_PACKS.forEach(pack => {
        InAppPurchase2.register({
          id: pack.id,
          type: InAppPurchase2.CONSUMABLE,
        });
      });

      // Event handlers
      InAppPurchase2.when("product").updated((product: IAPProduct) => {
        console.log('Product updated:', product);
        setProducts(prev => {
          const filtered = prev.filter(p => p.id !== product.id);
          return [...filtered, product];
        });
      });

      InAppPurchase2.when("product").approved((product: IAPProduct) => {
        console.log('Product approved:', product);
        handlePurchaseApproved(product);
      });

      InAppPurchase2.when("product").verified((product: IAPProduct) => {
        console.log('Product verified:', product);
        product.finish();
      });

      InAppPurchase2.when("product").error((error: any) => {
        console.error('Product error:', error);
        toast({
          title: "Erreur d'achat",
          description: "Une erreur est survenue lors de l'achat. Veuillez réessayer.",
          variant: "destructive",
        });
      });

      // Rafraîchir les produits
      InAppPurchase2.refresh();
      setIsInitialized(true);
      
      console.log('In-app purchase store initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize store:', error);
      toast({
        title: "Erreur d'initialisation",
        description: "Impossible d'initialiser les achats in-app.",
        variant: "destructive",
      });
    }
  };

  const handlePurchaseApproved = async (product: IAPProduct) => {
    try {
      setIsLoading(true);
      
      console.log('Processing purchase approval:', product.id);
      
      // Vérifier l'achat côté serveur
      const { data, error } = await supabase.functions.invoke('verify-purchase', {
        body: {
          purchaseToken: product.transaction?.id || product.id,
          productId: product.id,
          packageName: 'app.lovable.627c2a1590254f3b8d084e5bbf9c4f69'
        }
      });

      if (error) throw error;

      if (data.success) {
        toast({
          title: "Achat réussi ! 🎉",
          description: data.message,
        });
        
        // Marquer le produit comme vérifié
        product.verify();
      } else {
        throw new Error(data.error || 'Échec de la vérification de l\'achat');
      }
      
    } catch (error) {
      console.error('Purchase verification failed:', error);
      toast({
        title: "Erreur de vérification",
        description: "Impossible de vérifier votre achat. Contactez le support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const purchasePack = async (packId: string) => {
    try {
      if (!isInitialized) {
        throw new Error('Store not initialized');
      }

      console.log('Purchasing pack:', packId);
      setIsLoading(true);

      const product = InAppPurchase2.get(packId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (product.canPurchase) {
        InAppPurchase2.order(packId);
      } else {
        throw new Error('Product cannot be purchased');
      }
      
    } catch (error) {
      console.error('Purchase failed:', error);
      toast({
        title: "Erreur d'achat",
        description: "Impossible d'effectuer l'achat. Veuillez réessayer.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const restorePurchases = async () => {
    try {
      console.log('Restoring purchases...');
      InAppPurchase2.refresh();
      toast({
        title: "Restauration en cours",
        description: "Vérification de vos achats précédents...",
      });
    } catch (error) {
      console.error('Restore failed:', error);
      toast({
        title: "Erreur de restauration",
        description: "Impossible de restaurer vos achats.",
        variant: "destructive",
      });
    }
  };

  return {
    isInitialized,
    products,
    isLoading,
    LIKE_PACKS,
    purchasePack,
    restorePurchases,
  };
};