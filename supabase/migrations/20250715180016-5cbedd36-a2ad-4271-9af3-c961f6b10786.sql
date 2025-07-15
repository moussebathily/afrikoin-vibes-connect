-- Créer une table pour les fêtes et événements
CREATE TABLE public.holidays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  date_formula TEXT, -- Format: "MM-DD" pour date fixe, ou formule pour dates variables
  type TEXT NOT NULL DEFAULT 'religious', -- religious, national, international, cultural
  countries TEXT[], -- Codes pays ISO (ex: ['FR', 'MA', 'DZ'])
  religions TEXT[], -- Pour fêtes religieuses: ['islam', 'christianity', 'judaism']
  is_lunar BOOLEAN DEFAULT false, -- Pour les fêtes basées sur le calendrier lunaire
  celebration_duration INTEGER DEFAULT 1, -- Nombre de jours
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer une table pour les préférences de notification des utilisateurs
CREATE TABLE public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  country_code TEXT NOT NULL, -- Code pays ISO (ex: 'FR', 'MA')
  timezone TEXT NOT NULL DEFAULT 'UTC',
  language_code TEXT NOT NULL DEFAULT 'fr', -- Code langue (fr, ar, en)
  religion TEXT, -- Religion de l'utilisateur pour les fêtes religieuses
  receive_religious BOOLEAN DEFAULT true,
  receive_national BOOLEAN DEFAULT true,
  receive_international BOOLEAN DEFAULT true,
  receive_cultural BOOLEAN DEFAULT true,
  receive_birthday BOOLEAN DEFAULT true,
  birthday DATE,
  notification_time TIME DEFAULT '09:00:00', -- Heure d'envoi des notifications
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Créer une table pour les notifications de vœux envoyées
CREATE TABLE public.holiday_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  holiday_id UUID REFERENCES public.holidays(id),
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL, -- 'holiday', 'birthday'
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent', -- sent, failed, pending
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holiday_notifications ENABLE ROW LEVEL SECURITY;

-- Politiques pour holidays (lecture publique, modification admin seulement)
CREATE POLICY "Anyone can view holidays" 
ON public.holidays 
FOR SELECT 
USING (true);

CREATE POLICY "Only system can manage holidays" 
ON public.holidays 
FOR ALL 
USING (false)
WITH CHECK (false);

-- Politiques pour user_notification_preferences
CREATE POLICY "Users can manage their own notification preferences" 
ON public.user_notification_preferences 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Politiques pour holiday_notifications
CREATE POLICY "Users can view their own notifications" 
ON public.holiday_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
ON public.holiday_notifications 
FOR INSERT 
WITH CHECK (true);

-- Créer des triggers pour updated_at
CREATE TRIGGER update_holidays_updated_at
BEFORE UPDATE ON public.holidays
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_notification_preferences_updated_at
BEFORE UPDATE ON public.user_notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer quelques fêtes de base
INSERT INTO public.holidays (name, description, date_formula, type, countries, religions) VALUES
('Nouvel An', 'Célébration du Nouvel An', '01-01', 'international', ARRAY['FR', 'MA', 'DZ', 'TN', 'SN'], NULL),
('Aïd al-Fitr', 'Fête de la fin du Ramadan', 'lunar_eid_fitr', 'religious', ARRAY['MA', 'DZ', 'TN', 'SN', 'TR'], ARRAY['islam']),
('Aïd al-Adha', 'Fête du sacrifice', 'lunar_eid_adha', 'religious', ARRAY['MA', 'DZ', 'TN', 'SN', 'TR'], ARRAY['islam']),
('Noël', 'Naissance de Jésus Christ', '12-25', 'religious', ARRAY['FR', 'US', 'CA', 'DE'], ARRAY['christianity']),
('Fête nationale française', 'Fête nationale de la France', '07-14', 'national', ARRAY['FR'], NULL),
('Fête de l''indépendance du Maroc', 'Indépendance du Maroc', '11-18', 'national', ARRAY['MA'], NULL),
('Fête de l''indépendance de l''Algérie', 'Indépendance de l''Algérie', '07-05', 'national', ARRAY['DZ'], NULL),
('Ramadan', 'Mois de jeûne musulman', 'lunar_ramadan_start', 'religious', ARRAY['MA', 'DZ', 'TN', 'SN', 'TR'], ARRAY['islam']),
('Tabaski', 'Aïd al-Adha (appellation locale)', 'lunar_eid_adha', 'religious', ARRAY['SN', 'ML', 'BF'], ARRAY['islam']),
('Journée internationale de la femme', 'Journée dédiée aux droits des femmes', '03-08', 'international', NULL, NULL);