
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language } from '@/types/language';
import OverviewTab from './OverviewTab';
import TransactionsTab from './TransactionsTab';
import FavoritesTab from './FavoritesTab';
import SettingsTab from './SettingsTab';

interface ProfileTabsProps {
  language: Language;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const text = {
    fr: {
      overview: 'Aperçu',
      transactions: 'Transactions',
      favorites: 'Favoris',
      settings: 'Paramètres'
    },
    en: {
      overview: 'Overview',
      transactions: 'Transactions',
      favorites: 'Favorites',
      settings: 'Settings'
    }
  };

  const currentText = text[language] || text.fr;

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">{currentText.overview}</TabsTrigger>
        <TabsTrigger value="transactions">{currentText.transactions}</TabsTrigger>
        <TabsTrigger value="favorites">{currentText.favorites}</TabsTrigger>
        <TabsTrigger value="settings">{currentText.settings}</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab language={language} />
      </TabsContent>

      <TabsContent value="transactions" className="mt-6">
        <TransactionsTab language={language} />
      </TabsContent>

      <TabsContent value="favorites" className="mt-6">
        <FavoritesTab language={language} />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <SettingsTab language={language} />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
