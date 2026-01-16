import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SellerProfile } from "@/components/seller/SellerProfile";
import { SellerStats } from "@/components/seller/SellerStats";
import { SellerProducts } from "@/components/seller/SellerProducts";
import { SellerOrders } from "@/components/seller/SellerOrders";
import { SalesChart } from "@/components/seller/SalesChart";
import { CreateStoreForm } from "@/components/seller/CreateStoreForm";
import { AddProductForm } from "@/components/seller/AddProductForm";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Store, 
  Package, 
  BarChart3, 
  ShoppingCart,
  ArrowLeft,
  Loader2,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface SellerProfileData {
  id: string;
  user_id: string;
  store_name: string;
  store_description?: string;
  logo_url?: string;
  banner_url?: string;
  business_type?: string;
  country?: string;
  city?: string;
  phone?: string;
  email?: string;
  website?: string;
  is_verified?: boolean;
  rating: number;
  total_reviews: number;
  total_sales: number;
  total_revenue: number;
  joined_at: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  currency: string;
  images?: string[];
  stock?: number;
  is_active?: boolean;
  average_rating?: number;
  reviews_count?: number;
  views_count?: number;
}

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_status: string;
  created_at: string;
}

export default function SellerPage() {
  const { sellerId } = useParams<{ sellerId?: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [sellerProfile, setSellerProfile] = useState<SellerProfileData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("boutique");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(false);

  // Determine if viewing own profile or another seller's
  const targetSellerId = sellerId || user?.id;
  const isOwner = user?.id === sellerProfile?.user_id;

  // Sample chart data (would be calculated from orders in real scenario)
  const salesChartData = [
    { name: "Lun", sales: 4, revenue: 45000 },
    { name: "Mar", sales: 7, revenue: 85000 },
    { name: "Mer", sales: 3, revenue: 32000 },
    { name: "Jeu", sales: 5, revenue: 55000 },
    { name: "Ven", sales: 8, revenue: 120000 },
    { name: "Sam", sales: 12, revenue: 180000 },
    { name: "Dim", sales: 6, revenue: 75000 },
  ];

  useEffect(() => {
    if (targetSellerId) {
      fetchSellerData();
    }
  }, [targetSellerId]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);

      // Fetch seller profile
      const { data: profileData, error: profileError } = await supabase
        .from("seller_profiles")
        .select("*")
        .eq("user_id", targetSellerId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      if (profileData) {
        setSellerProfile(profileData as SellerProfileData);
      }

      // Fetch seller's products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", targetSellerId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch orders if owner
      if (user?.id === targetSellerId) {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("seller_id", targetSellerId)
          .order("created_at", { ascending: false })
          .limit(10);

        if (!ordersError) {
          setOrders(ordersData || []);
        }
      }
    } catch (error: any) {
      console.error("Error fetching seller data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du vendeur",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate total views from products
  const totalViews = products.reduce((sum, p) => sum + (p.views_count || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!sellerProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
        <Store className="h-16 w-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Profil vendeur non trouvé</h2>
        <p className="text-muted-foreground text-center">
          Ce profil vendeur n'existe pas encore.
        </p>
        {user && !sellerId && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer ma boutique
          </Button>
        )}
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        
        <CreateStoreForm 
          open={showCreateForm} 
          onOpenChange={setShowCreateForm}
          onSuccess={() => fetchSellerData()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-safe-nav">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-4 p-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold">{isOwner ? "Ma boutique" : sellerProfile.store_name}</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Seller Profile Card */}
        <SellerProfile
          storeName={sellerProfile.store_name}
          storeDescription={sellerProfile.store_description}
          logoUrl={sellerProfile.logo_url}
          bannerUrl={sellerProfile.banner_url}
          businessType={sellerProfile.business_type}
          country={sellerProfile.country}
          city={sellerProfile.city}
          phone={sellerProfile.phone}
          email={sellerProfile.email}
          website={sellerProfile.website}
          isVerified={sellerProfile.is_verified}
          rating={sellerProfile.rating}
          totalReviews={sellerProfile.total_reviews}
          joinedAt={sellerProfile.joined_at}
          isOwner={isOwner}
          onEdit={() => {/* TODO: Edit modal */}}
        />

        {/* Stats (visible to owner) */}
        {isOwner && (
          <SellerStats
            totalSales={sellerProfile.total_sales}
            totalRevenue={sellerProfile.total_revenue}
            totalProducts={products.length}
            rating={sellerProfile.rating}
            totalReviews={sellerProfile.total_reviews}
            totalViews={totalViews}
          />
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="boutique" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Produits</span>
            </TabsTrigger>
            {isOwner && (
              <>
                <TabsTrigger value="commandes" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="hidden sm:inline">Commandes</span>
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Stats</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="boutique" className="mt-4">
            <SellerProducts 
              products={products}
              isOwner={isOwner}
              onAddProduct={() => setShowAddProductForm(true)}
              onEditProduct={(id) => {/* TODO: Edit product */}}
            />
          </TabsContent>

          {isOwner && (
            <>
              <TabsContent value="commandes" className="mt-4">
                <SellerOrders 
                  orders={orders}
                  onViewOrder={(id) => {/* TODO: View order detail */}}
                />
              </TabsContent>

              <TabsContent value="stats" className="mt-4 space-y-4">
                <SalesChart data={salesChartData} />
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4">Performances</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taux de réponse</span>
                        <span className="font-medium">95%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Temps de réponse moyen</span>
                        <span className="font-medium">{"< 1 heure"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taux de livraison à temps</span>
                        <span className="font-medium">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Taux de retour</span>
                        <span className="font-medium">2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Add Product Form */}
      <AddProductForm
        open={showAddProductForm}
        onOpenChange={setShowAddProductForm}
        onSuccess={() => fetchSellerData()}
      />
    </div>
  );
}
