
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Star, 
  MapPin, 
  Calendar, 
  Wallet, 
  Settings, 
  Shield, 
  Award,
  Heart,
  MessageSquare,
  Phone,
  Mail
} from 'lucide-react';
import { Language } from '@/types/language';

interface ProfileProps {
  language: Language;
}

const Profile: React.FC<ProfileProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const text = {
    fr: {
      title: 'Mon Profil',
      overview: 'Aperçu',
      transactions: 'Transactions',
      favorites: 'Favoris',
      settings: 'Paramètres',
      verified: 'Vérifié',
      trustLevel: 'Niveau de confiance',
      joinedDate: 'Membre depuis',
      location: 'Localisation',
      completedSales: 'Ventes réalisées',
      rating: 'Évaluation',
      balance: 'Solde',
      recentActivity: 'Activité récente',
      editProfile: 'Modifier le profil',
      contact: 'Contacter'
    },
    en: {
      title: 'My Profile',
      overview: 'Overview',
      transactions: 'Transactions',
      favorites: 'Favorites',
      settings: 'Settings',
      verified: 'Verified',
      trustLevel: 'Trust Level',
      joinedDate: 'Member since',
      location: 'Location',
      completedSales: 'Completed Sales',
      rating: 'Rating',
      balance: 'Balance',
      recentActivity: 'Recent Activity',
      editProfile: 'Edit Profile',
      contact: 'Contact'
    }
  };

  const currentText = text[language] || text.fr;

  const userStats = {
    name: 'Aminata Kone',
    avatar: '/placeholder.svg',
    verified: true,
    trustLevel: 'Gold',
    rating: 4.9,
    completedSales: 127,
    joinedDate: 'Mars 2023',
    location: 'Abidjan, Côte d\'Ivoire',
    balance: '2,450,000 FCFA',
    phone: '+225 07 XX XX XX XX',
    email: 'aminata.kone@email.com'
  };

  const recentTransactions = [
    {
      id: 1,
      type: 'sale',
      item: 'Smartphone Samsung',
      amount: '+250,000 FCFA',
      date: '15 Nov 2024',
      status: 'completed'
    },
    {
      id: 2,
      type: 'purchase',
      item: 'Sac à main designer',
      amount: '-85,000 FCFA',
      date: '12 Nov 2024',
      status: 'completed'
    },
    {
      id: 3,
      type: 'sale',
      item: 'Ordinateur portable',
      amount: '+450,000 FCFA',
      date: '08 Nov 2024',
      status: 'pending'
    }
  ];

  const favoriteItems = [
    {
      id: 1,
      title: 'Villa moderne 4 chambres',
      price: '45,000,000 FCFA',
      image: '/placeholder.svg',
      location: 'Cocody, Abidjan'
    },
    {
      id: 2,
      title: 'MacBook Pro M3',
      price: '1,200,000 FCFA',
      image: '/placeholder.svg',
      location: 'Dakar, Sénégal'
    },
    {
      id: 3,
      title: 'Robe traditionnelle Kente',
      price: '75,000 FCFA',
      image: '/placeholder.svg',
      location: 'Accra, Ghana'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{currentText.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={userStats.avatar} alt={userStats.name} />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{userStats.name}</h2>
                  {userStats.verified && (
                    <Badge className="bg-green-500">
                      <Shield className="w-3 h-3 mr-1" />
                      {currentText.verified}
                    </Badge>
                  )}
                  <Badge className="bg-yellow-500">
                    <Award className="w-3 h-3 mr-1" />
                    {userStats.trustLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {userStats.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {currentText.joinedDate} {userStats.joinedDate}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-4">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-semibold">{userStats.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({userStats.completedSales} {currentText.completedSales.toLowerCase()})
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex-1" />
            
            <div className="flex flex-col gap-3">
              <Button className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {currentText.editProfile}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 text-center">
            <Wallet className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="font-semibold text-lg">{currentText.balance}</h3>
            <p className="text-2xl font-bold text-primary">{userStats.balance}</p>
          </Card>
          <Card className="p-6 text-center">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">{currentText.rating}</h3>
            <p className="text-2xl font-bold">{userStats.rating}/5</p>
          </Card>
          <Card className="p-6 text-center">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-lg">{currentText.completedSales}</h3>
            <p className="text-2xl font-bold">{userStats.completedSales}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{currentText.overview}</TabsTrigger>
            <TabsTrigger value="transactions">{currentText.transactions}</TabsTrigger>
            <TabsTrigger value="favorites">{currentText.favorites}</TabsTrigger>
            <TabsTrigger value="settings">{currentText.settings}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{currentText.recentActivity}</h3>
              <div className="space-y-4">
                {recentTransactions.slice(0, 3).map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        transaction.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">{transaction.item}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{currentText.transactions}</h3>
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">{transaction.item}</p>
                        <p className="text-sm text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </p>
                      <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteItems.map(item => (
                <Card key={item.id} className="overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-lg font-bold text-primary mb-2">{item.price}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {item.location}
                    </div>
                    <Button className="w-full mt-4">Voir détails</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">{currentText.settings}</h3>
              <p className="text-muted-foreground">Paramètres de profil et de compte à venir...</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
