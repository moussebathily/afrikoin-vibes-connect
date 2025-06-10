
import React from 'react';
import { Language } from '@/types/language';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileTabs from '@/components/profile/ProfileTabs';

interface ProfileProps {
  language: Language;
}

const Profile: React.FC<ProfileProps> = ({ language }) => {
  const text = {
    fr: {
      title: 'Mon Profil'
    },
    en: {
      title: 'My Profile'
    }
  };

  const currentText = text[language] || text.fr;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{currentText.title}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <ProfileHeader language={language} />
        <ProfileStats language={language} />
        <ProfileTabs language={language} />
      </div>
    </div>
  );
};

export default Profile;
