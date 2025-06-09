
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Star, MessageSquare, Heart } from 'lucide-react';
import { Language } from '@/types/language';

interface MarketplaceProps {
  language: Language;
}

const Marketplace: React.FC<MarketplaceProps> = ({ language }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const text = {
    fr: {
      title: 'Marketplace AfriKoin',
      subtitle: 'Achetez et vendez partout en Afrique',
      search: 'Rechercher des produits...',
      categories: 'Catégories',
      filters: 'Filtres',
      location: 'Localisation',
      featured: 'À la une',
      new: 'Nouveau',
      verified: 'Vérifié',
      chat: 'Discuter',
      favorite: 'Favoris'
    },
    en: {
      title: 'AfriKoin Marketplace',
      subtitle: 'Buy and sell across Africa',
      search: 'Search products...',
      categories: 'Categories',
      filters: 'Filters',
      location: 'Location',
      featured: 'Featured',
      new: 'New',
      verified: 'Verified',
      chat: 'Chat',
      favorite: 'Favorites'
    }
  };

  const currentText = text[language] || text.fr;

  const categories = [
    { id: 'all', name: 'Tout', icon: '🏪' },
    { id: 'electronics', name: 'Électronique', icon: '📱' },
    { id: 'fashion', name: 'Mode', icon: '👗' },
    { id: 'home', name: 'Maison', icon: '🏠' },
    { id: 'vehicles', name: 'Véhicules', icon: '🚗' },
    { id: 'food', name: 'Alimentation', icon: '🍽️' },
    { id: 'art', name: 'Art & Culture', icon: '🎨' },
    { id: 'services', name: 'Services', icon: '🔧' }
  ];

  const products = [
    {
      id: 1,
      title: 'iPhone 15 Pro Max',
      price: '850,000 FCFA',
      location: 'Dakar, Sénégal',
      image: '/placeholder.svg',
      rating: 4.8,
      seller: 'Tech Store Dakar',
      verified: true,
      featured: true,
      new: true
    },
    {
      id: 2,
      title: 'Boubou Traditionnel',
      price: '45,000 FCFA',
      location: 'Bamako, Mali',
      image: '/placeholder.svg',
      rating: 4.9,
      seller: 'Artisan Malien',
      verified: true,
      featured: false,
      new: false
    },
    {
      id: 3,
      title: 'Toyota Camry 2020',
      price: '15,500,000 FCFA',
      location: 'Abidjan, Côte d\'Ivoire',
      image: '/placeholder.svg',
      rating: 4.6,
      seller: 'Auto Premium CI',
      verified: true,
      featured: true,
      new: false
    }
  ];

  const filteredProducts = products.filter(product => 
    selectedCategory === 'all' || product.title.toLowerCase().includes(selectedCategory)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{currentText.title}</h1>
          <p className="text-lg opacity-90">{currentText.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder={currentText.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {currentText.filters}
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {currentText.location}
          </Button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{currentText.categories}</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  {product.featured && (
                    <Badge className="bg-secondary text-white">
                      {currentText.featured}
                    </Badge>
                  )}
                  {product.new && (
                    <Badge className="bg-accent text-white">
                      {currentText.new}
                    </Badge>
                  )}
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-2xl font-bold text-primary mb-2">{product.price}</p>
                
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{product.location}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{product.seller}</span>
                    {product.verified && (
                      <Badge variant="secondary" className="text-xs">
                        {currentText.verified}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    Voir détails
                  </Button>
                  <Button variant="outline" size="icon">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
