
import React, { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoriesGrid from '@/components/CategoriesGrid';
import ContentCreation from '@/components/ContentCreation';
import SocialFeed from '@/components/SocialFeed';
import UserProfile from '@/components/UserProfile';
import LiveStreaming from '@/components/LiveStreaming';
import PaymentOptions from '@/components/PaymentOptions';
import Footer from '@/components/Footer';

const Index = () => {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  return (
    <div className="min-h-screen bg-background">
      <Header 
        language={language} 
        onLanguageChange={setLanguage} 
      />
      
      <main>
        <HeroSection language={language} />
        <CategoriesGrid language={language} />
        <ContentCreation language={language} />
        <SocialFeed language={language} />
        <UserProfile language={language} />
        <LiveStreaming language={language} />
        <PaymentOptions language={language} />
      </main>
      
      <Footer language={language} />
    </div>
  );
};

export default Index;
