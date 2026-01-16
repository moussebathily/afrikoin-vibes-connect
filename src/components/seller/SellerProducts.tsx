import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Plus, 
  Star,
  Eye,
  Edit,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

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

interface SellerProductsProps {
  products: Product[];
  isOwner?: boolean;
  onAddProduct?: () => void;
  onEditProduct?: (productId: string) => void;
}

export function SellerProducts({ 
  products, 
  isOwner, 
  onAddProduct,
  onEditProduct 
}: SellerProductsProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Produits ({products.length})
        </CardTitle>
        {isOwner && (
          <Button size="sm" onClick={onAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun produit pour le moment</p>
            {isOwner && (
              <Button onClick={onAddProduct} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un produit
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Product Image */}
                <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium truncate">{product.title}</h4>
                    {isOwner && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onEditProduct?.(product.id);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <p className="text-lg font-bold text-primary mt-1">
                    {product.price.toLocaleString()} {product.currency}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {product.average_rating !== undefined && product.average_rating > 0 && (
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        {product.average_rating.toFixed(1)}
                      </span>
                    )}
                    {product.views_count !== undefined && (
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {product.views_count}
                      </span>
                    )}
                    {product.stock !== undefined && (
                      <Badge variant={product.stock > 0 ? "secondary" : "destructive"} className="text-xs">
                        {product.stock > 0 ? `Stock: ${product.stock}` : "Rupture"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
