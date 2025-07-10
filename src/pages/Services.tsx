import React, { useState, useEffect } from 'react';
import { MapPin, Star, Shield, Clock, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useMonetizationStore } from '@/store/monetizationStore';
import { Service } from '@/types/monetization';
import { Language } from '@/types/language';

interface ServicesProps {
  language: Language;
}

const Services: React.FC<ServicesProps> = ({ language }) => {
  const { services, setServices } = useMonetizationStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  const text = {
    fr: {
      title: 'Services Locaux',
      subtitle: 'Trouvez des professionnels certifiés près de chez vous',
      search: 'Rechercher un service...',
      allCategories: 'Toutes catégories',
      certified: 'Certifié',
      from: 'À partir de',
      book: 'Réserver',
      rating: 'avis',
      location: 'Localisation',
      available: 'Disponible'
    },
    en: {
      title: 'Local Services',
      subtitle: 'Find certified professionals near you',
      search: 'Search for a service...',
      allCategories: 'All Categories',
      certified: 'Certified',
      from: 'From',
      book: 'Book',
      rating: 'reviews',
      location: 'Location',
      available: 'Available'
    }
  };

  const currentText = text[language] || text.fr;

  const categories = [
    { id: 'all', name: currentText.allCategories },
    { id: 'delivery', name: 'Livraison' },
    { id: 'repair', name: 'Réparation' },
    { id: 'cleaning', name: 'Nettoyage' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'tutoring', name: 'Cours particuliers' },
    { id: 'beauty', name: 'Beauté & Bien-être' },
    { id: 'photography', name: 'Photographie' }
  ];

  // Mock services data
  const mockServices: Service[] = [
    {
      id: '1',
      title: 'Livraison Express 24h',
      description: 'Service de livraison rapide et fiable dans toute la ville',
      category: 'delivery',
      price: 2500,
      currency: 'FCFA',
      providerId: 'provider-1',
      location: {
        address: 'Dakar, Plateau',
        coordinates: [14.6937, -17.4441]
      },
      rating: 4.8,
      reviews: 127,
      certified: true,
      images: ['/api/placeholder/300/200'],
      availability: ['Lun-Dim 24h/24'],
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Réparation Smartphones',
      description: 'Réparation professionnelle de tous types de smartphones',
      category: 'repair',
      price: 15000,
      currency: 'FCFA',
      providerId: 'provider-2',
      location: {
        address: 'Abidjan, Cocody',
        coordinates: [5.3600, -4.0083]
      },
      rating: 4.9,
      reviews: 89,
      certified: true,
      images: ['/api/placeholder/300/200'],
      availability: ['Lun-Sam 8h-18h'],
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Ménage à Domicile',
      description: 'Service de ménage professionnel avec produits inclus',
      category: 'cleaning',
      price: 8000,
      currency: 'FCFA',
      providerId: 'provider-3',
      location: {
        address: 'Casablanca, Centre',
        coordinates: [33.5731, -7.5898]
      },
      rating: 4.7,
      reviews: 156,
      certified: false,
      images: ['/api/placeholder/300/200'],
      availability: ['Lun-Ven 7h-17h'],
      createdAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    setServices(mockServices);
  }, [setServices]);

  useEffect(() => {
    let filtered = services.filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    setFilteredServices(filtered);
  }, [services, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-secondary/5 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {currentText.title}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={currentText.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={service.images[0]}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                {service.certified && (
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                    <Shield className="h-3 w-3 mr-1" />
                    {currentText.certified}
                  </Badge>
                )}
              </div>

              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{service.rating}</span>
                  <span className="text-muted-foreground">
                    ({service.reviews} {currentText.rating})
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {service.location.address}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {service.availability[0]}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-muted-foreground">{currentText.from}</span>
                      <div className="text-lg font-bold text-primary">
                        {service.price.toLocaleString()} {service.currency}
                      </div>
                    </div>

                    <Button size="sm" className="bg-accent hover:bg-accent/90">
                      {currentText.book}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Aucun service trouvé pour votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;