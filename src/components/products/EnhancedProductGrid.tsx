import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Package, Sparkles, TrendingUp, Star, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from './ProductCard';
import { DEMO_PRODUCTS, PRODUCT_CATEGORIES } from '@/data/demoData';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/cart';

export const EnhancedProductGrid: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc'>('popular');

  const handleViewProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...DEMO_PRODUCTS];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
        p.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.country?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.views_count - a.views_count);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, sortBy]);

  const featuredProducts = DEMO_PRODUCTS.filter(p => p.is_featured).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 p-6 md:p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Marketplace AfriKoin</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Produits Africains Authentiques
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Découvrez les trésors du continent : fruits frais, mode traditionnelle, artisanat et plus encore.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="secondary" className="gap-1">
              <Package className="h-3 w-3" />
              {DEMO_PRODUCTS.length} produits
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              Livraison Afrique
            </Badge>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit, pays, catégorie..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-background/50 backdrop-blur-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="h-11 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="popular">Plus populaires</option>
            <option value="newest">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
          </select>
          <Button variant="outline" size="icon" className="h-11 w-11">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Category Chips */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {PRODUCT_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <Button
                key={cat.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex-shrink-0 gap-2 h-10 px-4 transition-all",
                  isActive && "shadow-md"
                )}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "ml-1 h-5 px-1.5 text-[10px]",
                    isActive && "bg-background/20"
                  )}
                >
                  {cat.count}
                </Badge>
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Featured Products */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h2 className="font-semibold text-foreground">Produits en vedette</h2>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {featuredProducts.map((product) => (
                <div key={product.id} className="w-[200px] flex-shrink-0">
                  <ProductCard product={product} onView={handleViewProduct} />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{filteredProducts.length}</span> produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </p>
        {searchQuery && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSearchQuery('')}
            className="text-primary"
          >
            Effacer la recherche
          </Button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Aucun produit trouvé</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Essayez de modifier vos critères de recherche
              </p>
            </div>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
              Réinitialiser les filtres
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onView={handleViewProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
