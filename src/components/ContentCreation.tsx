import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Video, Music, Upload, MapPin, DollarSign, Users } from 'lucide-react';
import { Language } from '@/types/language';

interface ContentCreationProps {
  language: Language;
}

const ContentCreation: React.FC<ContentCreationProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
  const [monetizationEnabled, setMonetizationEnabled] = useState(false);

  const text = {
    fr: {
      title: 'Créer du contenu',
      subtitle: 'Partagez vos photos et vidéos avec la communauté',
      photo: 'Photo',
      video: 'Vidéo',
      addMusic: 'Ajouter musique',
      location: 'Localisation',
      description: 'Description',
      price: 'Prix (optionnel)',
      enableMonetization: 'Activer la monétisation',
      publish: 'Publier',
      followers: 'abonnés',
      uploading: 'Téléchargement...',
      selectFile: 'Sélectionner fichier',
      addLocation: 'Ajouter localisation',
      fcfa: 'FCFA'
    },
    en: {
      title: 'Create content',
      subtitle: 'Share your photos and videos with the community',
      photo: 'Photo',
      video: 'Video',
      addMusic: 'Add music',
      location: 'Location',
      description: 'Description',
      price: 'Price (optional)',
      enableMonetization: 'Enable monetization',
      publish: 'Publish',
      followers: 'followers',
      uploading: 'Uploading...',
      selectFile: 'Select file',
      addLocation: 'Add location',
      fcfa: 'FCFA'
    },
    bm: {
      title: 'Kɔnɔ dɔ',
      subtitle: 'I ja ni i filimu tɔgɔba ye jamana la',
      photo: 'Ja',
      video: 'Filimu',
      addMusic: 'Donkili fara a kan',
      location: 'Yɔrɔ',
      description: 'Kɔrɔlen',
      price: 'Sɔngɔ',
      enableMonetization: 'Wariko baara bila',
      publish: 'Kɛ',
      followers: 'tɔbɔla',
      uploading: 'Ka ta...',
      selectFile: 'Fiili sugandi',
      addLocation: 'Yɔrɔ fara a kan',
      fcfa: 'FCFA'
    },
    ar: {
      title: 'إنشاء محتوى',
      subtitle: 'شارك صورك ومقاطع الفيديو مع المجتمع',
      photo: 'صورة',
      video: 'فيديو',
      addMusic: 'إضافة موسيقى',
      location: 'الموقع',
      description: 'الوصف',
      price: 'السعر (اختياري)',
      enableMonetization: 'تفعيل الربح',
      publish: 'نشر',
      followers: 'متابعين',
      uploading: 'جاري الرفع...',
      selectFile: 'اختر ملف',
      addLocation: 'إضافة موقع',
      fcfa: 'فرنك'
    },
    ti: {
      title: 'ትሕዝቶ ፍጠር',
      subtitle: 'ዕስልታትኩምን ቪድዮታትኩምን ምስ ማሕበረሰብ ኣካፍሉ',
      photo: 'ስእሊ',
      video: 'ቪድዮ',
      addMusic: 'ሙዚቃ ወስኽ',
      location: 'ቦታ',
      description: 'መግለጺ',
      price: 'ዋጋ',
      enableMonetization: 'ገንዘብ ምክንያት ኣብጽሕ',
      publish: 'ዝርግሕ',
      followers: 'ተኸተልቲ',
      uploading: 'ከቐርብ...',
      selectFile: 'ፋይል ምረጽ',
      addLocation: 'ቦታ ወስኽ',
      fcfa: 'ፍራንክ'
    },
    pt: {
      title: 'Criar conteúdo',
      subtitle: 'Compartilhe suas fotos e vídeos com a comunidade',
      photo: 'Foto',
      video: 'Vídeo',
      addMusic: 'Adicionar música',
      location: 'Localização',
      description: 'Descrição',
      price: 'Preço (opcional)',
      enableMonetization: 'Ativar monetização',
      publish: 'Publicar',
      followers: 'seguidores',
      uploading: 'Enviando...',
      selectFile: 'Selecionar arquivo',
      addLocation: 'Adicionar localização',
      fcfa: 'FCFA'
    },
    es: {
      title: 'Crear contenido',
      subtitle: 'Comparte tus fotos y videos con la comunidad',
      photo: 'Foto',
      video: 'Video',
      addMusic: 'Agregar música',
      location: 'Ubicación',
      description: 'Descripción',
      price: 'Precio (opcional)',
      enableMonetization: 'Activar monetización',
      publish: 'Publicar',
      followers: 'seguidores',
      uploading: 'Subiendo...',
      selectFile: 'Seleccionar archivo',
      addLocation: 'Agregar ubicación',
      fcfa: 'FCFA'
    },
    zh: {
      title: '创建内容',
      subtitle: '与社区分享您的照片和视频',
      photo: '照片',
      video: '视频',
      addMusic: '添加音乐',
      location: '位置',
      description: '描述',
      price: '价格（可选）',
      enableMonetization: '启用变现',
      publish: '发布',
      followers: '关注者',
      uploading: '上传中...',
      selectFile: '选择文件',
      addLocation: '添加位置',
      fcfa: '非洲法郎'
    },
    ru: {
      title: 'Создать контент',
      subtitle: 'Поделитесь фотографиями и видео с сообществом',
      photo: 'Фото',
      video: 'Видео',
      addMusic: 'Добавить музыку',
      location: 'Местоположение',
      description: 'Описание',
      price: 'Цена (опционально)',
      enableMonetization: 'Включить монетизацию',
      publish: 'Опубликовать',
      followers: 'подписчиков',
      uploading: 'Загрузка...',
      selectFile: 'Выбрать файл',
      addLocation: 'Добавить местоположение',
      fcfa: 'Франк КФА'
    },
    hi: {
      title: 'सामग्री बनाएं',
      subtitle: 'समुदाय के साथ अपनी तस्वीरें और वीडियो साझा करें',
      photo: 'फोटो',
      video: 'वीडियो',
      addMusic: 'संगीत जोड़ें',
      location: 'स्थान',
      description: 'विवरण',
      price: 'मूल्य (वैकल्पिक)',
      enableMonetization: 'मुद्रीकरण सक्षम करें',
      publish: 'प्रकाशित करें',
      followers: 'फॉलोअर्स',
      uploading: 'अपलोड हो रहा है...',
      selectFile: 'फाइल चुनें',
      addLocation: 'स्थान जोड़ें',
      fcfa: 'सीएफए फ्रैंक'
    }
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {text[language].title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {text[language].subtitle}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            {/* Tabs pour Photo/Vidéo */}
            <div className="flex mb-6 bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab('photo')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                  activeTab === 'photo' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Camera className="w-4 h-4 mr-2" />
                {text[language].photo}
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${
                  activeTab === 'video' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Video className="w-4 h-4 mr-2" />
                {text[language].video}
              </button>
            </div>

            {/* Zone de téléchargement */}
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center">
                {activeTab === 'photo' ? (
                  <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                ) : (
                  <Video className="w-12 h-12 text-muted-foreground mb-4" />
                )}
                <p className="text-muted-foreground mb-2">{text[language].selectFile}</p>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  {text[language].selectFile}
                </Button>
              </div>
            </div>

            {/* Ajouter musique pour vidéo */}
            {activeTab === 'video' && (
              <div className="mb-6">
                <Button variant="outline" className="w-full mb-4">
                  <Music className="w-4 h-4 mr-2" />
                  {text[language].addMusic}
                </Button>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {text[language].description}
              </label>
              <Textarea 
                placeholder={language === 'fr' 
                  ? "Décrivez votre contenu..." 
                  : "Describe your content..."
                }
                rows={4}
              />
            </div>

            {/* Localisation */}
            <div className="mb-6">
              <Button variant="outline" className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                {text[language].addLocation}
              </Button>
            </div>

            {/* Monétisation */}
            <div className="mb-6 p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-primary mr-2" />
                  <span className="font-medium">{text[language].enableMonetization}</span>
                </div>
                <button
                  onClick={() => setMonetizationEnabled(!monetizationEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    monetizationEnabled ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    monetizationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              {monetizationEnabled && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {text[language].price}
                  </label>
                  <div className="flex items-center">
                    <Input 
                      type="number" 
                      placeholder="0"
                      className="flex-1"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">
                      {text[language].fcfa}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bouton publier */}
            <Button className="w-full bg-afrikoin-gradient text-white">
              {text[language].publish}
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContentCreation;
