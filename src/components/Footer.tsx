
import React from 'react';
import { MapPin, Shield, CreditCard } from 'lucide-react';
import { Language } from '@/types/language';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  const text = {
    fr: {
      description: 'AfriKoin connecte l\'Afrique par le commerce et la culture. Achetez, vendez et échangez en toute sécurité.',
      about: 'À propos',
      services: 'Services',
      support: 'Support',
      legal: 'Légal',
      aboutLinks: ['Notre mission', 'Équipe', 'Carrières', 'Presse'],
      servicesLinks: ['Petites annonces', 'Live streaming', 'Assistant vocal', 'Paiements'],
      supportLinks: ['Centre d\'aide', 'Contact', 'Communauté', 'Blog'],
      legalLinks: ['Conditions', 'Confidentialité', 'Sécurité', 'Signalement'],
      rights: 'Tous droits réservés',
      madeWith: 'Fait avec ❤️ pour l\'Afrique'
    },
    en: {
      description: 'AfriKoin connects Africa through commerce and culture. Buy, sell and trade securely.',
      about: 'About',
      services: 'Services',
      support: 'Support',
      legal: 'Legal',
      aboutLinks: ['Our mission', 'Team', 'Careers', 'Press'],
      servicesLinks: ['Classifieds', 'Live streaming', 'Voice assistant', 'Payments'],
      supportLinks: ['Help center', 'Contact', 'Community', 'Blog'],
      legalLinks: ['Terms', 'Privacy', 'Security', 'Report'],
      rights: 'All rights reserved',
      madeWith: 'Made with ❤️ for Africa'
    },
    bm: {
      description: 'AfriKoin bɛ Afrika ma ɲɔgɔn ma juguma la ani laada la. San, feere ani falen lakana la.',
      about: 'Anw kan',
      services: 'Baarakɛlaw',
      support: 'Dɛmɛ',
      legal: 'Sariya',
      aboutLinks: ['An laɲini', 'Gɛlɛya', 'Baara', 'Gɛlɛya'],
      servicesLinks: ['Misaliw', 'Live streaming', 'Kumakan dɛmɛbaga', 'Saraw'],
      supportLinks: ['Dɛmɛ yɔrɔ', 'Jogin', 'Sigida', 'Blog'],
      legalLinks: ['Sariyaw', 'Dogolen', 'Lakana', 'Kɔlɔsili'],
      rights: 'Iko bɛɛ tun bɛ yen',
      madeWith: 'Kɛra ni ❤️ ye Afrika kama'
    },
    ar: {
      description: 'يربط AfriKoin أفريقيا من خلال التجارة والثقافة. اشتري واعرض وتبادل بأمان.',
      about: 'حول',
      services: 'الخدمات',
      support: 'الدعم',
      legal: 'قانوني',
      aboutLinks: ['مهمتنا', 'الفريق', 'الوظائف', 'الصحافة'],
      servicesLinks: ['الإعلانات المبوبة', 'البث المباشر', 'المساعد الصوتي', 'المدفوعات'],
      supportLinks: ['مركز المساعدة', 'اتصل', 'المجتمع', 'المدونة'],
      legalLinks: ['الشروط', 'الخصوصية', 'الأمان', 'الإبلاغ'],
      rights: 'جميع الحقوق محفوظة',
      madeWith: 'صنع بـ ❤️ لأفريقيا'
    },
    ti: {
      description: 'AfriKoin ንኣፍሪካ ብንግዲ ን ባህሊ የራኸብ። ብውሑስነት ዕደጋ፣ ሸጣን ርክብን።',
      about: 'ብዛዕባ',
      services: 'ኣገልግሎታት',
      support: 'ደገፍ',
      legal: 'ሕጋዊ',
      aboutLinks: ['ተልእኮና', 'ጋንታ', 'ስራሕ', 'ጋዜጣ'],
      servicesLinks: ['መወዓውዒ', 'ቀጥታ ስርጭት', 'ድምጻዊ ሓገዝ', 'ክፍሊት'],
      supportLinks: ['ሓገዝ ማእከል', 'ርኽክብ', 'ማሕበረሰብ', 'ብሎግ'],
      legalLinks: ['ኩነታት', 'ምስጢራዊነት', 'ድሕነት', 'ጸብጻብ'],
      rights: 'ኩሉ መሰላት ተሓልዩ',
      madeWith: 'ብ ❤️ ንኣፍሪካ ተሰሪሑ'
    },
    pt: {
      description: 'AfriKoin conecta África através do comércio e cultura. Compre, venda e negocie com segurança.',
      about: 'Sobre',
      services: 'Serviços',
      support: 'Suporte',
      legal: 'Legal',
      aboutLinks: ['Nossa missão', 'Equipe', 'Carreiras', 'Imprensa'],
      servicesLinks: ['Classificados', 'Transmissão ao vivo', 'Assistente de voz', 'Pagamentos'],
      supportLinks: ['Central de ajuda', 'Contato', 'Comunidade', 'Blog'],
      legalLinks: ['Termos', 'Privacidade', 'Segurança', 'Denunciar'],
      rights: 'Todos os direitos reservados',
      madeWith: 'Feito com ❤️ para África'
    },
    es: {
      description: 'AfriKoin conecta África a través del comercio y la cultura. Compra, vende e intercambia de forma segura.',
      about: 'Acerca de',
      services: 'Servicios',
      support: 'Soporte',
      legal: 'Legal',
      aboutLinks: ['Nuestra misión', 'Equipo', 'Carreras', 'Prensa'],
      servicesLinks: ['Clasificados', 'Transmisión en vivo', 'Asistente de voz', 'Pagos'],
      supportLinks: ['Centro de ayuda', 'Contacto', 'Comunidad', 'Blog'],
      legalLinks: ['Términos', 'Privacidad', 'Seguridad', 'Reportar'],
      rights: 'Todos los derechos reservados',
      madeWith: 'Hecho con ❤️ para África'
    },
    zh: {
      description: 'AfriKoin通过商业和文化连接非洲。安全地买卖和交易。',
      about: '关于',
      services: '服务',
      support: '支持',
      legal: '法律',
      aboutLinks: ['我们的使命', '团队', '职业', '新闻'],
      servicesLinks: ['分类广告', '直播', '语音助手', '支付'],
      supportLinks: ['帮助中心', '联系', '社区', '博客'],
      legalLinks: ['条款', '隐私', '安全', '举报'],
      rights: '版权所有',
      madeWith: '用 ❤️ 为非洲制作'
    },
    ru: {
      description: 'AfriKoin соединяет Африку через торговлю и культуру. Покупайте, продавайте и торгуйте безопасно.',
      about: 'О нас',
      services: 'Услуги',
      support: 'Поддержка',
      legal: 'Правовая информация',
      aboutLinks: ['Наша миссия', 'Команда', 'Карьера', 'Пресса'],
      servicesLinks: ['Объявления', 'Прямые трансляции', 'Голосовой помощник', 'Платежи'],
      supportLinks: ['Центр помощи', 'Контакты', 'Сообщество', 'Блог'],
      legalLinks: ['Условия', 'Конфиденциальность', 'Безопасность', 'Сообщить'],
      rights: 'Все права защищены',
      madeWith: 'Сделано с ❤️ для Африки'
    },
    hi: {
      description: 'AfriKoin वाणिज्य और संस्कृति के माध्यम से अफ्रीका को जोड़ता है। सुरक्षित रूप से खरीदें, बेचें और व्यापार करें।',
      about: 'के बारे में',
      services: 'सेवाएं',
      support: 'सहायता',
      legal: 'कानूनी',
      aboutLinks: ['हमारा मिशन', 'टीम', 'करियर', 'प्रेस'],
      servicesLinks: ['वर्गीकृत विज्ञापन', 'लाइव स्ट्रीमिंग', 'वॉयस असिस्टेंट', 'भुगतान'],
      supportLinks: ['सहायता केंद्र', 'संपर्क', 'समुदाय', 'ब्लॉग'],
      legalLinks: ['नियम', 'गोपनीयता', 'सुरक्षा', 'रिपोर्ट'],
      rights: 'सभी अधिकार सुरक्षित',
      madeWith: 'अफ्रीका के लिए ❤️ के साथ बनाया गया'
    }
  };

  const currentText = text[language] || text.fr;

  const footerSections = [
    { title: currentText.about, links: currentText.aboutLinks },
    { title: currentText.services, links: currentText.servicesLinks },
    { title: currentText.support, links: currentText.supportLinks },
    { title: currentText.legal, links: currentText.legalLinks }
  ];

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 py-12">
        {/* Section principale */}
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-8 mb-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-afrikoin-gradient rounded-full"></div>
              <span className="text-2xl font-bold">AfriKoin</span>
            </div>
            <p className="text-muted-foreground mb-6">
              {currentText.description}
            </p>
            
            {/* Indicateurs de confiance */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>25+ pays</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>100% sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Paiements locaux</span>
              </div>
            </div>
          </div>

          {/* Liens */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section du bas */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 AfriKoin. {currentText.rights}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentText.madeWith}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
