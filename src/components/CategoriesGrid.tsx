
import React from 'react';
import { Card } from '@/components/ui/card';
import { Language } from '@/types/language';

interface CategoriesGridProps {
  language: Language;
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({ language }) => {
  const text = {
    fr: {
      title: 'Catégories populaires',
      subtitle: 'Découvrez les meilleures offres dans toutes les catégories',
      categories: [
        { name: 'Immobilier', emoji: '🏠', count: '12.5K annonces' },
        { name: 'Véhicules', emoji: '🚗', count: '8.2K annonces' },
        { name: 'Mode & Beauté', emoji: '👗', count: '15.1K annonces' },
        { name: 'Électronique', emoji: '📱', count: '9.8K annonces' },
        { name: 'Emploi', emoji: '💼', count: '5.4K offres' },
        { name: 'Services', emoji: '🔧', count: '7.9K prestataires' },
        { name: 'Art & Culture', emoji: '🎨', count: '3.2K créations' },
        { name: 'Alimentation', emoji: '🍽️', count: '11.6K produits' }
      ]
    },
    en: {
      title: 'Popular categories',
      subtitle: 'Discover the best deals in all categories',
      categories: [
        { name: 'Real Estate', emoji: '🏠', count: '12.5K ads' },
        { name: 'Vehicles', emoji: '🚗', count: '8.2K ads' },
        { name: 'Fashion & Beauty', emoji: '👗', count: '15.1K ads' },
        { name: 'Electronics', emoji: '📱', count: '9.8K ads' },
        { name: 'Jobs', emoji: '💼', count: '5.4K offers' },
        { name: 'Services', emoji: '🔧', count: '7.9K providers' },
        { name: 'Art & Culture', emoji: '🎨', count: '3.2K creations' },
        { name: 'Food', emoji: '🍽️', count: '11.6K products' }
      ]
    }
  };

  const currentText = text[language] || text.fr;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {currentText.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Grille de catégories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {currentText.categories.map((category, index) => (
            <Card
              key={index}
              className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group"
            >
              <div className="space-y-3">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                  {category.emoji}
                </div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bouton voir plus */}
        <div className="text-center mt-12">
          <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            {language === 'fr' ? 'Voir toutes les catégories' : 'View all categories'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
