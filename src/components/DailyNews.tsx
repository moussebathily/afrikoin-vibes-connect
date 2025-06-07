
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, Clock, Globe, TrendingUp } from 'lucide-react';
import { Language } from '@/types/language';

interface DailyNewsProps {
  language: Language;
}

const DailyNews: React.FC<DailyNewsProps> = ({ language }) => {
  const text = {
    fr: {
      title: 'Infos du jour',
      subtitle: 'Restez informé des dernières actualités africaines',
      categories: ['Politique', 'Économie', 'Sport', 'Culture', 'Tech', 'Santé'],
      readMore: 'Lire plus',
      trending: 'Tendance',
      latest: 'Dernières nouvelles'
    },
    en: {
      title: 'Daily News',
      subtitle: 'Stay informed with the latest African news',
      categories: ['Politics', 'Economy', 'Sports', 'Culture', 'Tech', 'Health'],
      readMore: 'Read more',
      trending: 'Trending',
      latest: 'Latest news'
    },
    bm: {
      title: 'Don kuntaafew',
      subtitle: 'Afrika kɔrɔlen kuntaafew dɔn',
      categories: ['Politiki', 'Nafolo', 'Farikoloban', 'Laada', 'Fɛɛrɛ', 'Kɛnɛya'],
      readMore: 'Kalan ka tɛmɛ',
      trending: 'Ka ɲɛ',
      latest: 'Kuntafe koraw'
    },
    ar: {
      title: 'أخبار اليوم',
      subtitle: 'ابق على اطلاع بآخر الأخبار الأفريقية',
      categories: ['سياسة', 'اقتصاد', 'رياضة', 'ثقافة', 'تقنية', 'صحة'],
      readMore: 'اقرأ المزيد',
      trending: 'رائج',
      latest: 'آخر الأخبار'
    },
    ti: {
      title: 'ናይ ሎሚ ዜናታት',
      subtitle: 'ብዝሓደሽ ኣፍሪቃዊ ዜናታት ሓበሬታ ተቐበል',
      categories: ['ፖለቲካ', 'ቁጠባ', 'ስፖርት', 'ባህሊ', 'ቴክኖሎጂ', 'ጥዕና'],
      readMore: 'ዝያዳ ኣንብብ',
      trending: 'ግሉጽ',
      latest: 'ሓደሽ ዜናታት'
    },
    pt: {
      title: 'Notícias do dia',
      subtitle: 'Mantenha-se informado com as últimas notícias africanas',
      categories: ['Política', 'Economia', 'Esportes', 'Cultura', 'Tecnologia', 'Saúde'],
      readMore: 'Ler mais',
      trending: 'Em alta',
      latest: 'Últimas notícias'
    },
    es: {
      title: 'Noticias del día',
      subtitle: 'Manténgase informado con las últimas noticias africanas',
      categories: ['Política', 'Economía', 'Deportes', 'Cultura', 'Tecnología', 'Salud'],
      readMore: 'Leer más',
      trending: 'Tendencia',
      latest: 'Últimas noticias'
    },
    zh: {
      title: '今日新闻',
      subtitle: '了解最新的非洲新闻',
      categories: ['政治', '经济', '体育', '文化', '科技', '健康'],
      readMore: '阅读更多',
      trending: '热门',
      latest: '最新消息'
    },
    ru: {
      title: 'Новости дня',
      subtitle: 'Будьте в курсе последних африканских новостей',
      categories: ['Политика', 'Экономика', 'Спорт', 'Культура', 'Технологии', 'Здоровье'],
      readMore: 'Читать далее',
      trending: 'В тренде',
      latest: 'Последние новости'
    },
    hi: {
      title: 'आज की खबरें',
      subtitle: 'नवीनतम अफ्रीकी समाचारों से अवगत रहें',
      categories: ['राजनीति', 'अर्थव्यवस्था', 'खेल', 'संस्कृति', 'तकनीक', 'स्वास्थ्य'],
      readMore: 'और पढ़ें',
      trending: 'ट्रेंडिंग',
      latest: 'ताज़ा खबर'
    }
  };

  const currentText = text[language] || text.fr;

  const newsItems = [
    {
      title: 'Sommet économique panafricain 2024',
      summary: 'Les leaders africains se réunissent pour discuter de l\'intégration économique...',
      category: currentText.categories[1],
      time: '2h',
      trending: true
    },
    {
      title: 'Innovation technologique en Afrique de l\'Ouest',
      summary: 'De nouvelles startups révolutionnent le secteur fintech...',
      category: currentText.categories[4],
      time: '4h',
      trending: false
    },
    {
      title: 'Festival culturel continental',
      summary: 'Célébration de la diversité culturelle africaine...',
      category: currentText.categories[3],
      time: '6h',
      trending: true
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Newspaper className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold">{currentText.title}</h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {currentText.subtitle}
          </p>
        </div>

        {/* Catégories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {currentText.categories.map((category, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Articles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                  {item.category}
                </span>
                {item.trending && (
                  <div className="flex items-center space-x-1 text-accent">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs">{currentText.trending}</span>
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {item.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{item.time}</span>
                </div>
                <Button variant="ghost" size="sm">
                  {currentText.readMore}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Section Live News */}
        <div className="mt-12">
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">{currentText.latest}</h3>
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm">• Conférence sur le climat à Marrakech - En cours</p>
              <p className="text-sm">• Élections présidentielles au Ghana - Résultats attendus</p>
              <p className="text-sm">• Nouveau partenariat commercial Nigeria-Sénégal</p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DailyNews;
