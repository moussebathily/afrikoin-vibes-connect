import React, { useState, useEffect } from 'react';
import { Search, Filter, SlidersHorizontal, Package, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from './ProductCard';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/types/cart';

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Tissu Wax Africain Premium',
    description: 'Tissu wax authentique de haute qualité',
    price: 15000,
    currency: 'XOF',
    country: 'Mali',
    images: ['https://images.unsplash.com/photo-1590735213920-68192a487bc2?w=400'],
    stock: 25,
    category: 'Mode',
    is_active: true,
    is_featured: true,
    views_count: 150,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Sac en cuir artisanal',
    description: 'Sac fait main par des artisans locaux',
    price: 45000,
    currency: 'XOF',
    country: 'Sénégal',
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400'],
    stock: 8,
    category: 'Accessoires',
    is_active: true,
    is_featured: false,
    views_count: 89,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Bijoux en or traditionnel',
    description: 'Collier en or 18 carats style africain',
    price: 250000,
    currency: 'XOF',
    country: 'Côte d\'Ivoire',
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400'],
    stock: 3,
    category: 'Bijoux',
    is_active: true,
    is_featured: true,
    views_count: 234,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Sculpture en bois d\'ébène',
    description: 'Œuvre d\'art sculptée à la main',
    price: 85000,
    currency: 'XOF',
    country: 'Ghana',
    images: ['https://images.unsplash.com/photo-1582582621959-48d27397dc69?w=400'],
    stock: 5,
    category: 'Art',
    is_active: true,
    is_featured: false,
    views_count: 67,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Café Arabica Bio',
    description: 'Café éthiopien torréfié artisanalement',
    price: 12000,
    currency: 'XOF',
    country: 'Éthiopie',
    images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400'],
    stock: 50,
    category: 'Alimentation',
    is_active: true,
    is_featured: false,
    views_count: 198,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    title: 'Huile d\'Argan Pure',
    description: 'Huile cosmétique 100% naturelle',
    price: 28000,
    currency: 'XOF',
    country: 'Maroc',
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400'],
    stock: 15,
    category: 'Beauté',
    is_active: true,
    is_featured: true,
    views_count: 312,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const CATEGORIES = ['Tous', 'Mode', 'Accessoires', 'Bijoux', 'Art', 'Alimentation', 'Beauté'];

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isLoading, setIsLoading] = useState(false);

  // Load products from Supabase (with fallback to sample data)
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setProducts(data as Product[]);
          setFilteredProducts(data as Product[]);
        }
      } catch (error) {
        console.log('Using sample products');
        // Keep sample products
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'Tous') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Marketplace</h2>
          <p className="text-muted-foreground text-sm">
            Découvrez les meilleurs produits africains
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
        </Button>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            className="flex-shrink-0"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des produits...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Aucun produit trouvé</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
