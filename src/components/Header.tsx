
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LikeCreditsWidget from '@/components/LikeCreditsWidget';
import { Mic, Video, Upload, MapPin, Shield, CreditCard, LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LanguageSelector from '@/components/LanguageSelector';
import { Language } from '@/types/language';
import { useSafeArea } from '@/hooks/useSafeArea';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, onLanguageChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { safeAreaClasses, isEdgeToEdge } = useSafeArea();

  const handleSignOut = async () => {
    await signOut();
  };

  const text = {
    fr: {
      title: 'AfriKoin',
      subtitle: 'Votre marché panafricain',
      publish: 'Publier',
      live: 'Live',
      voice: 'Vocal',
      locate: 'Localiser',
      secure: 'Sécurisé',
      payment: 'Paiement'
    },
    en: {
      title: 'AfriKoin',
      subtitle: 'Your Pan-African marketplace',
      publish: 'Publish',
      live: 'Live',
      voice: 'Voice',
      locate: 'Locate',
      secure: 'Secure',
      payment: 'Payment'
    },
    bm: {
      title: 'AfriKoin',
      subtitle: 'I panafrika sugu yɔrɔ',
      publish: 'Bila',
      live: 'Live',
      voice: 'Kumakan',
      locate: 'Yɔrɔ',
      secure: 'Lakana',
      payment: 'Sara'
    },
    ar: {
      title: 'Afريكوين',
      subtitle: 'سوقكم الأفريقي الشامل',
      publish: 'نشر',
      live: 'مباشر',
      voice: 'صوت',
      locate: 'موقع',
      secure: 'آمن',
      payment: 'دفع'
    },
    ti: {
      title: 'AfriKoin',
      subtitle: 'ናትኩም ፓን-አፍሪካዊ ገበያ',
      publish: 'ኣተንብብ',
      live: 'ቀጥታ',
      voice: 'ድምጺ',
      locate: 'ቦታ',
      secure: 'ውሑስ',
      payment: 'ክፍሊት'
    },
    pt: {
      title: 'AfriKoin',
      subtitle: 'Seu mercado pan-africano',
      publish: 'Publicar',
      live: 'Ao vivo',
      voice: 'Voz',
      locate: 'Localizar',
      secure: 'Seguro',
      payment: 'Pagamento'
    },
    es: {
      title: 'AfriKoin',
      subtitle: 'Tu mercado panafricano',
      publish: 'Publicar',
      live: 'En vivo',
      voice: 'Voz',
      locate: 'Localizar',
      secure: 'Seguro',
      payment: 'Pago'
    },
    zh: {
      title: 'AfriKoin',
      subtitle: '您的泛非市场',
      publish: '发布',
      live: '直播',
      voice: '语音',
      locate: '定位',
      secure: '安全',
      payment: '支付'
    },
    ru: {
      title: 'AfriKoin',
      subtitle: 'Ваш панафриканский рынок',
      publish: 'Опубликовать',
      live: 'Прямой эфир',
      voice: 'Голос',
      locate: 'Локация',
      secure: 'Безопасно',
      payment: 'Оплата'
    },
    hi: {
      title: 'AfriKoin',
      subtitle: 'आपका पैन-अफ्रीकी बाजार',
      publish: 'प्रकाशित',
      live: 'लाइव',
      voice: 'आवाज',
      locate: 'स्थान',
      secure: 'सुरक्षित',
      payment: 'भुगतान'
    }
  };

  return (
    <header className={`bg-afrikoin-gradient shadow-lg sticky top-0 z-50 ${isEdgeToEdge ? safeAreaClasses : ''}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo et titre */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-afrikoin-gradient rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{text[language].title}</h1>
              <p className="text-white/80 text-sm">{text[language].subtitle}</p>
            </div>
          </div>

          {/* Actions principales */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Upload className="w-4 h-4 mr-2" />
              {text[language].publish}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Video className="w-4 h-4 mr-2" />
              {text[language].live}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Mic className="w-4 h-4 mr-2" />
              {text[language].voice}
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {user && <LikeCreditsWidget language={language} compact />}
            {user && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <User className="w-4 h-4 mr-2" />
                  {user.email?.split('@')[0]}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
            {/* Sélecteur de langue */}
            <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
          </div>
        </div>

        {/* Barre de fonctionnalités */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Card className="px-3 py-2 bg-white/10 border-white/20">
            <div className="flex items-center space-x-2 text-white text-sm">
              <MapPin className="w-4 h-4" />
              <span>{text[language].locate}</span>
            </div>
          </Card>
          <Card className="px-3 py-2 bg-white/10 border-white/20">
            <div className="flex items-center space-x-2 text-white text-sm">
              <Shield className="w-4 h-4" />
              <span>{text[language].secure}</span>
            </div>
          </Card>
          <Card className="px-3 py-2 bg-white/10 border-white/20">
            <div className="flex items-center space-x-2 text-white text-sm">
              <CreditCard className="w-4 h-4" />
              <span>{text[language].payment}</span>
            </div>
          </Card>
        </div>
      </div>
    </header>
  );
};

export default Header;
