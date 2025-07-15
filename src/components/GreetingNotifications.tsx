import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Calendar, Globe, Heart, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  message: string;
  notification_type: string;
  sent_at: string;
  holiday_id?: string;
  holiday?: {
    name: string;
    type: string;
    description?: string;
  };
}

export const GreetingNotifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('holiday_notifications')
        .select(`
          *,
          holiday:holidays(name, type, description)
        `)
        .eq('user_id', user!.id)
        .order('sent_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTestGreeting = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      // Get user preferences
      const { data: prefs, error: prefsError } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (prefsError) throw prefsError;

      if (!prefs) {
        toast({
          title: 'Configuration requise',
          description: 'Veuillez d\'abord configurer vos préférences de notification',
          variant: 'destructive',
        });
        return;
      }

      // Generate a test greeting
      const { data: greetingData, error: greetingError } = await supabase.functions.invoke('generate-greeting', {
        body: {
          holiday: {
            name: 'Test de vœux personnalisés',
            description: 'Message de test pour vérifier votre configuration',
            type: 'test'
          },
          userPrefs: prefs,
          type: 'holiday'
        }
      });

      if (greetingError) throw greetingError;

      // Save the test notification
      const { error: saveError } = await supabase
        .from('holiday_notifications')
        .insert({
          user_id: user.id,
          message: greetingData.message,
          notification_type: 'test',
          status: 'sent'
        });

      if (saveError) throw saveError;

      toast({
        title: 'Message généré !',
        description: 'Un message de test a été créé avec succès',
      });

      // Reload notifications
      loadNotifications();
    } catch (error) {
      console.error('Error generating test greeting:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le message de test',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Heart className="h-4 w-4" />;
      case 'test':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Badge variant="secondary">Anniversaire</Badge>;
      case 'test':
        return <Badge variant="outline">Test</Badge>;
      default:
        return <Badge variant="default">Fête</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages de Vœux
          </CardTitle>
          <CardDescription>
            Vos messages de vœux personnalisés générés par l'IA
          </CardDescription>
          <div className="flex justify-end">
            <Button 
              onClick={generateTestGreeting} 
              disabled={generating}
              variant="outline"
            >
              {generating ? 'Génération...' : 'Générer un message test'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun message pour le moment</h3>
              <p className="text-muted-foreground mb-4">
                Vos messages de vœux personnalisés apparaîtront ici
              </p>
              <Button onClick={generateTestGreeting} disabled={generating}>
                {generating ? 'Génération...' : 'Générer un message test'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className="border-l-4 border-l-primary/20">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.notification_type)}
                        <span className="font-medium">
                          {notification.holiday?.name || 'Message personnalisé'}
                        </span>
                        {getNotificationBadge(notification.notification_type)}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(notification.sent_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </span>
                    </div>
                    
                    {notification.holiday?.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {notification.holiday.description}
                      </p>
                    )}
                    
                    <Separator className="my-3" />
                    
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};