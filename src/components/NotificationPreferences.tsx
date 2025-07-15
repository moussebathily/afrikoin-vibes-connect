import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Bell, Globe, Heart, Flag, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface NotificationPrefs {
  country_code: string;
  timezone: string;
  language_code: string;
  religion?: string;
  receive_religious: boolean;
  receive_national: boolean;
  receive_international: boolean;
  receive_cultural: boolean;
  receive_birthday: boolean;
  birthday?: Date;
  notification_time: string;
  is_active: boolean;
}

const countries = [
  { code: 'FR', name: 'France' },
  { code: 'MA', name: 'Maroc' },
  { code: 'DZ', name: 'Algérie' },
  { code: 'TN', name: 'Tunisie' },
  { code: 'SN', name: 'Sénégal' },
  { code: 'ML', name: 'Mali' },
  { code: 'BF', name: 'Burkina Faso' },
  { code: 'CI', name: 'Côte d\'Ivoire' },
];

const languages = [
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
];

const religions = [
  { code: 'islam', name: 'Islam' },
  { code: 'christianity', name: 'Christianisme' },
  { code: 'judaism', name: 'Judaïsme' },
];

export const NotificationPreferences: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    country_code: 'FR',
    timezone: 'Europe/Paris',
    language_code: 'fr',
    receive_religious: true,
    receive_national: true,
    receive_international: true,
    receive_cultural: true,
    receive_birthday: true,
    notification_time: '09:00',
    is_active: true,
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPrefs({
          ...data,
          birthday: data.birthday ? new Date(data.birthday) : undefined,
        });
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger vos préférences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_notification_preferences')
        .upsert({
          user_id: user.id,
          ...prefs,
          birthday: prefs.birthday ? prefs.birthday.toISOString().split('T')[0] : null,
        });

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Vos préférences ont été sauvegardées',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder vos préférences',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
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
            <Bell className="h-5 w-5" />
            Préférences de Notifications
          </CardTitle>
          <CardDescription>
            Configurez vos préférences pour recevoir des messages de vœux personnalisés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Localisation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Localisation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Select value={prefs.country_code} onValueChange={(value) => setPrefs(prev => ({ ...prev, country_code: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map(country => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Langue</Label>
                <Select value={prefs.language_code} onValueChange={(value) => setPrefs(prev => ({ ...prev, language_code: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Religion */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Religion (optionnel)
            </h3>
            <Select value={prefs.religion || ''} onValueChange={(value) => setPrefs(prev => ({ ...prev, religion: value || undefined }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner votre religion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucune</SelectItem>
                {religions.map(religion => (
                  <SelectItem key={religion.code} value={religion.code}>
                    {religion.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Types de notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Types de Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fêtes religieuses</Label>
                  <p className="text-sm text-muted-foreground">Aïd, Noël, Pâques, etc.</p>
                </div>
                <Switch
                  checked={prefs.receive_religious}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, receive_religious: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fêtes nationales</Label>
                  <p className="text-sm text-muted-foreground">Fête de l'indépendance, fête nationale</p>
                </div>
                <Switch
                  checked={prefs.receive_national}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, receive_national: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fêtes internationales</Label>
                  <p className="text-sm text-muted-foreground">Nouvel An, Journée de la femme</p>
                </div>
                <Switch
                  checked={prefs.receive_international}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, receive_international: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Fêtes culturelles</Label>
                  <p className="text-sm text-muted-foreground">Événements culturels locaux</p>
                </div>
                <Switch
                  checked={prefs.receive_cultural}
                  onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, receive_cultural: checked }))}
                />
              </div>
            </div>
          </div>

          {/* Anniversaire */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Anniversaire
            </h3>
            <div className="flex items-center justify-between">
              <Label>Recevoir des vœux d'anniversaire</Label>
              <Switch
                checked={prefs.receive_birthday}
                onCheckedChange={(checked) => setPrefs(prev => ({ ...prev, receive_birthday: checked }))}
              />
            </div>
            {prefs.receive_birthday && (
              <div className="space-y-2">
                <Label>Date d'anniversaire</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !prefs.birthday && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {prefs.birthday ? format(prefs.birthday, "dd/MM/yyyy") : "Sélectionner une date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={prefs.birthday}
                      onSelect={(date) => setPrefs(prev => ({ ...prev, birthday: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Heure de notification */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="time">Heure de notification préférée</Label>
              <Input
                id="time"
                type="time"
                value={prefs.notification_time}
                onChange={(e) => setPrefs(prev => ({ ...prev, notification_time: e.target.value }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button onClick={savePreferences} disabled={saving}>
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};