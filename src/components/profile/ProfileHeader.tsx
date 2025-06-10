
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  MapPin, 
  Calendar, 
  Settings, 
  Shield, 
  Award,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Language } from '@/types/language';

interface ProfileHeaderProps {
  language: Language;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ language }) => {
  const text = {
    fr: {
      verified: 'Vérifié',
      joinedDate: 'Membre depuis',
      completedSales: 'Ventes réalisées',
      editProfile: 'Modifier le profil',
      contact: 'Contacter'
    },
    en: {
      verified: 'Verified',
      joinedDate: 'Member since',
      completedSales: 'Completed Sales',
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
    phone: '+225 07 XX XX XX XX',
    email: 'aminata.kone@email.com'
  };

  return (
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
  );
};

export default ProfileHeader;
