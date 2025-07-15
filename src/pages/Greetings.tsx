import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationPreferences } from '@/components/NotificationPreferences';
import { GreetingNotifications } from '@/components/GreetingNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Settings, Calendar, Globe, Heart, Bell, Sparkles } from 'lucide-react';

export const Greetings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <MessageCircle className="h-16 w-16 text-primary" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Messages de Vœux Intelligents</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Recevez des messages de vœux personnalisés et culturellement appropriés 
            pour toutes les fêtes importantes de votre région
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <CardHeader>
              <Globe className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Personnalisation Culturelle</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Messages adaptés à votre pays, religion et langue préférée
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Calendrier Intelligent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Détection automatique des fêtes nationales, religieuses et internationales
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-8 w-8 mx-auto text-primary mb-2" />
              <CardTitle className="text-lg">Messages Personnalisés</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                IA générative pour des vœux uniques et chaleureux
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Mes Messages
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Préférences
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="mt-6">
            <GreetingNotifications />
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <NotificationPreferences />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};