
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language } from '@/types/language';
import EntertainmentHeader from '@/components/entertainment/EntertainmentHeader';
import MusicTab from '@/components/entertainment/MusicTab';
import VideosTab from '@/components/entertainment/VideosTab';
import RadioTab from '@/components/entertainment/RadioTab';
import GamesTab from '@/components/entertainment/GamesTab';
import EventsTab from '@/components/entertainment/EventsTab';

interface EntertainmentProps {
  language: Language;
}

const Entertainment: React.FC<EntertainmentProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState('music');

  const text = {
    fr: {
      music: 'Musique',
      videos: 'Vidéos',
      radio: 'Radio',
      games: 'Jeux',
      events: 'Événements'
    },
    en: {
      music: 'Music',
      videos: 'Videos',
      radio: 'Radio',
      games: 'Games',
      events: 'Events'
    }
  };

  const currentText = text[language] || text.fr;

  return (
    <div className="min-h-screen bg-background">
      <EntertainmentHeader language={language} />

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="music">{currentText.music}</TabsTrigger>
            <TabsTrigger value="videos">{currentText.videos}</TabsTrigger>
            <TabsTrigger value="radio">{currentText.radio}</TabsTrigger>
            <TabsTrigger value="games">{currentText.games}</TabsTrigger>
            <TabsTrigger value="events">{currentText.events}</TabsTrigger>
          </TabsList>

          <TabsContent value="music" className="mt-6">
            <MusicTab language={language} />
          </TabsContent>

          <TabsContent value="videos" className="mt-6">
            <VideosTab language={language} />
          </TabsContent>

          <TabsContent value="radio" className="mt-6">
            <RadioTab language={language} />
          </TabsContent>

          <TabsContent value="games" className="mt-6">
            <GamesTab />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <EventsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Entertainment;
