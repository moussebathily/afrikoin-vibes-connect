
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, Tablet, Monitor, QrCode } from 'lucide-react';
import { Language } from '@/types/language';

interface AppDownloadProps {
  language: Language;
}

const AppDownload: React.FC<AppDownloadProps> = ({ language }) => {
  const text = {
    fr: {
      title: 'Télécharger AfriKoin',
      subtitle: 'Accédez à AfriKoin partout, à tout moment',
      mobile: 'Application Mobile',
      tablet: 'Application Tablette',
      desktop: 'Application Bureau',
      webApp: 'Application Web',
      scanQR: 'Scanner le QR Code',
      downloadNow: 'Télécharger maintenant',
      comingSoon: 'Bientôt disponible',
      features: ['Notifications en temps réel', 'Mode hors ligne', 'Synchronisation automatique', 'Interface optimisée'],
      platforms: 'Disponible sur toutes les plateformes'
    },
    en: {
      title: 'Download AfriKoin',
      subtitle: 'Access AfriKoin everywhere, anytime',
      mobile: 'Mobile App',
      tablet: 'Tablet App',
      desktop: 'Desktop App',
      webApp: 'Web App',
      scanQR: 'Scan QR Code',
      downloadNow: 'Download now',
      comingSoon: 'Coming soon',
      features: ['Real-time notifications', 'Offline mode', 'Auto-sync', 'Optimized interface'],
      platforms: 'Available on all platforms'
    },
    bm: {
      title: 'AfriKoin Ziirikɛ',
      subtitle: 'AfriKoin kɛ yɔrɔ bɛɛ la, waati bɛɛ',
      mobile: 'Telefɔni App',
      tablet: 'Tablet App',
      desktop: 'Ordinatɛ App',
      webApp: 'Web App',
      scanQR: 'QR Code kalan',
      downloadNow: 'Sisan ziirikɛ',
      comingSoon: 'A na taa yen',
      features: ['Waati kelen kɔlɔsili', 'Internet tɛ cogo', 'Automatique sync', 'Interface ɲuman'],
      platforms: 'Platform bɛɛ kan'
    },
    ar: {
      title: 'تحميل AfriKoin',
      subtitle: 'اوصل إلى AfriKoin في كل مكان، في أي وقت',
      mobile: 'تطبيق الهاتف',
      tablet: 'تطبيق اللوحي',
      desktop: 'تطبيق سطح المكتب',
      webApp: 'تطبيق الويب',
      scanQR: 'مسح رمز QR',
      downloadNow: 'حمل الآن',
      comingSoon: 'قريباً',
      features: ['إشعارات فورية', 'وضع غير متصل', 'مزامنة تلقائية', 'واجهة محسنة'],
      platforms: 'متاح على جميع المنصات'
    },
    ti: {
      title: 'AfriKoin ኣውርድ',
      subtitle: 'AfriKoin ኣብ ኩሉ ቦታ፣ ኩሉ ግዜ',
      mobile: 'ሞባይል አፕ',
      tablet: 'ታብሌት አፕ',
      desktop: 'ዴስክቶፕ አፕ',
      webApp: 'ዌብ አፕ',
      scanQR: 'QR ኮድ ስከን',
      downloadNow: 'ሕጂ ኣውርድ',
      comingSoon: 'ቀርባ ይመጽእ',
      features: ['ቅጽበታዊ ምልክታት', 'ኦፍላይን ሞድ', 'ሰንሰለት ሲንክ', 'ምሉእ ኢንተርፌስ'],
      platforms: 'ኣብ ኩሉ መድረኽ'
    },
    pt: {
      title: 'Baixar AfriKoin',
      subtitle: 'Acesse AfriKoin em qualquer lugar, a qualquer hora',
      mobile: 'App Mobile',
      tablet: 'App Tablet',
      desktop: 'App Desktop',
      webApp: 'App Web',
      scanQR: 'Escanear QR Code',
      downloadNow: 'Baixar agora',
      comingSoon: 'Em breve',
      features: ['Notificações em tempo real', 'Modo offline', 'Sincronização automática', 'Interface otimizada'],
      platforms: 'Disponível em todas as plataformas'
    },
    es: {
      title: 'Descargar AfriKoin',
      subtitle: 'Accede a AfriKoin en cualquier lugar, en cualquier momento',
      mobile: 'App Móvil',
      tablet: 'App Tablet',
      desktop: 'App Escritorio',
      webApp: 'App Web',
      scanQR: 'Escanear código QR',
      downloadNow: 'Descargar ahora',
      comingSoon: 'Próximamente',
      features: ['Notificaciones en tiempo real', 'Modo sin conexión', 'Sincronización automática', 'Interfaz optimizada'],
      platforms: 'Disponible en todas las plataformas'
    },
    zh: {
      title: '下载 AfriKoin',
      subtitle: '随时随地访问 AfriKoin',
      mobile: '手机应用',
      tablet: '平板应用',
      desktop: '桌面应用',
      webApp: '网页应用',
      scanQR: '扫描二维码',
      downloadNow: '立即下载',
      comingSoon: '即将推出',
      features: ['实时通知', '离线模式', '自动同步', '优化界面'],
      platforms: '适用于所有平台'
    },
    ru: {
      title: 'Скачать AfriKoin',
      subtitle: 'Доступ к AfriKoin везде, в любое время',
      mobile: 'Мобильное приложение',
      tablet: 'Приложение для планшета',
      desktop: 'Десктопное приложение',
      webApp: 'Веб-приложение',
      scanQR: 'Сканировать QR-код',
      downloadNow: 'Скачать сейчас',
      comingSoon: 'Скоро',
      features: ['Уведомления в реальном времени', 'Офлайн режим', 'Автосинхронизация', 'Оптимизированный интерфейс'],
      platforms: 'Доступно на всех платформах'
    },
    hi: {
      title: 'AfriKoin डाउनलोड करें',
      subtitle: 'कहीं भी, कभी भी AfriKoin तक पहुंचें',
      mobile: 'मोबाइल ऐप',
      tablet: 'टैबलेट ऐप',
      desktop: 'डेस्कटॉप ऐप',
      webApp: 'वेब ऐप',
      scanQR: 'QR कोड स्कैन करें',
      downloadNow: 'अभी डाउनलोड करें',
      comingSoon: 'जल्द आ रहा है',
      features: ['रियल-टाइम नोटिफिकेशन', 'ऑफलाइन मोड', 'ऑटो-सिंक', 'अनुकूलित इंटरफेस'],
      platforms: 'सभी प्लेटफॉर्म पर उपलब्ध'
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{text[language].title}</h2>
          <p className="text-xl text-muted-foreground mb-6">{text[language].subtitle}</p>
          <p className="text-lg text-primary font-semibold">{text[language].platforms}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Mobile App */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{text[language].mobile}</h3>
            <Button className="w-full mb-2">
              <Download className="w-4 h-4 mr-2" />
              {text[language].downloadNow}
            </Button>
            <p className="text-sm text-muted-foreground">{text[language].comingSoon}</p>
          </Card>

          {/* Tablet App */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tablet className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{text[language].tablet}</h3>
            <Button className="w-full mb-2">
              <Download className="w-4 h-4 mr-2" />
              {text[language].downloadNow}
            </Button>
            <p className="text-sm text-muted-foreground">{text[language].comingSoon}</p>
          </Card>

          {/* Desktop App */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Monitor className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{text[language].desktop}</h3>
            <Button className="w-full mb-2">
              <Download className="w-4 h-4 mr-2" />
              {text[language].downloadNow}
            </Button>
            <p className="text-sm text-muted-foreground">{text[language].comingSoon}</p>
          </Card>

          {/* QR Code */}
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{text[language].scanQR}</h3>
            <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground">{text[language].webApp}</p>
          </Card>
        </div>

        {/* Fonctionnalités */}
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {text[language].features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Download className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AppDownload;
