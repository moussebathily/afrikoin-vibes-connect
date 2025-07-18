import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Video, Music, Upload, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { Language } from '@/types/language';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ContentCreationProps {
  language: Language;
}

const ContentCreation: React.FC<ContentCreationProps> = ({ language }) => {
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');
  const [monetizationEnabled, setMonetizationEnabled] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: ''
  });
  
  const { user } = useAuth();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File, userId: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabase.storage
      .from('posts')
      .upload(filePath, file);

    if (error) {
      throw error;
    }

    return filePath;
  };

  const handlePublish = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour publier");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Veuillez sélectionner au moins un fichier");
      return;
    }

    setIsPublishing(true);

    try {
      // Upload files to storage
      const uploadPromises = selectedFiles.map(file => uploadFile(file, user.id));
      const filePaths = await Promise.all(uploadPromises);

      // Create post in database
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: formData.title || null,
          description: formData.description || null,
          content_type: activeTab,
          location: formData.location || null,
          price: monetizationEnabled && formData.price ? parseFloat(formData.price) : null,
          is_monetized: monetizationEnabled
        })
        .select()
        .single();

      if (postError) throw postError;

      // Create media file records
      const mediaRecords = selectedFiles.map((file, index) => ({
        post_id: post.id,
        file_path: filePaths[index],
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        storage_bucket: 'posts'
      }));

      const { error: mediaError } = await supabase
        .from('media_files')
        .insert(mediaRecords);

      if (mediaError) throw mediaError;

      toast.success("Contenu publié avec succès!");
      
      // Reset form
      setSelectedFiles([]);
      setFormData({ title: '', description: '', location: '', price: '' });
      setMonetizationEnabled(false);

    } catch (error) {
      console.error('Error publishing content:', error);
      toast.error("Erreur lors de la publication");
    } finally {
      setIsPublishing(false);
    }
  };

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
      fcfa: 'FCFA',
      publishing: 'Publication en cours...',
      titlePlaceholder: 'Titre de votre publication...',
      descriptionPlaceholder: 'Décrivez votre contenu...',
      locationPlaceholder: 'Où êtes-vous ?',
      filesSelected: 'fichier(s) sélectionné(s)'
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
      fcfa: 'FCFA',
      publishing: 'Publishing...',
      titlePlaceholder: 'Title of your post...',
      descriptionPlaceholder: 'Describe your content...',
      locationPlaceholder: 'Where are you?',
      filesSelected: 'file(s) selected'
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
      fcfa: 'FCFA',
      publishing: 'Ka bɔla...',
      titlePlaceholder: 'I kɔnɔ tɔgɔ...',
      descriptionPlaceholder: 'I kɔnɔ kɔrɔlen...',
      locationPlaceholder: 'I bɛ min na?',
      filesSelected: 'fiili sugandilen'
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
      fcfa: 'فرنك',
      publishing: 'جارٍ النشر...',
      titlePlaceholder: 'عنوان منشورك...',
      descriptionPlaceholder: 'اوصف محتواك...',
      locationPlaceholder: 'أين أنت؟',
      filesSelected: 'ملف محدد'
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
      fcfa: 'ፍራንክ',
      publishing: 'ይዝርጋሕ ኣሎ...',
      titlePlaceholder: 'ናይ ፖስትኩም ኣርእስቲ...',
      descriptionPlaceholder: 'ትሕዝቶኹም ግለጹ...',
      locationPlaceholder: 'ኣበይ ኢኹም?',
      filesSelected: 'ፋይል ተመሪጹ'
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
      fcfa: 'FCFA',
      publishing: 'Publicando...',
      titlePlaceholder: 'Título da sua postagem...',
      descriptionPlaceholder: 'Descreva seu conteúdo...',
      locationPlaceholder: 'Onde você está?',
      filesSelected: 'arquivo(s) selecionado(s)'
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
      fcfa: 'FCFA',
      publishing: 'Publicando...',
      titlePlaceholder: 'Título de tu publicación...',
      descriptionPlaceholder: 'Describe tu contenido...',
      locationPlaceholder: '¿Dónde estás?',
      filesSelected: 'archivo(s) seleccionado(s)'
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
      fcfa: '非洲法郎',
      publishing: '发布中...',
      titlePlaceholder: '您的帖子标题...',
      descriptionPlaceholder: '描述您的内容...',
      locationPlaceholder: '您在哪里？',
      filesSelected: '已选择文件'
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
      fcfa: 'Франк КФА',
      publishing: 'Публикация...',
      titlePlaceholder: 'Заголовок вашего поста...',
      descriptionPlaceholder: 'Опишите ваш контент...',
      locationPlaceholder: 'Где вы находитесь?',
      filesSelected: 'файл(ов) выбрано'
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
      fcfa: 'सीएफए फ्रैंक',
      publishing: 'प्रकाशित हो रहा है...',
      titlePlaceholder: 'आपकी पोस्ट का शीर्षक...',
      descriptionPlaceholder: 'अपनी सामग्री का वर्णन करें...',
      locationPlaceholder: 'आप कहाँ हैं?',
      filesSelected: 'फाइल चुनी गई'
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
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-6 hover:border-primary/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept={activeTab === 'photo' ? 'image/*' : 'video/*'}
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                {activeTab === 'photo' ? (
                  <Camera className="w-12 h-12 text-muted-foreground mb-4" />
                ) : (
                  <Video className="w-12 h-12 text-muted-foreground mb-4" />
                )}
                <p className="text-muted-foreground mb-2">{text[language].selectFile}</p>
                <Button variant="outline" size="sm" type="button">
                  <Upload className="w-4 h-4 mr-2" />
                  {text[language].selectFile}
                </Button>
              </div>
            </div>

            {/* Fichiers sélectionnés */}
            {selectedFiles.length > 0 && (
              <div className="mb-6 p-3 bg-primary/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {selectedFiles.length} {text[language].filesSelected}
                </p>
                <div className="mt-2 space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ajouter musique pour vidéo */}
            {activeTab === 'video' && (
              <div className="mb-6">
                <Button variant="outline" className="w-full mb-4" type="button">
                  <Music className="w-4 h-4 mr-2" />
                  {text[language].addMusic}
                </Button>
              </div>
            )}

            {/* Titre */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Titre (optionnel)
              </label>
              <Input 
                placeholder={text[language].titlePlaceholder}
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {text[language].description}
              </label>
              <Textarea 
                placeholder={text[language].descriptionPlaceholder}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            {/* Localisation */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {text[language].location}
              </label>
              <div className="flex gap-2">
                <Input 
                  placeholder={text[language].locationPlaceholder}
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="icon" type="button">
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Monétisation */}
            <div className="mb-6 p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-primary mr-2" />
                  <span className="font-medium">{text[language].enableMonetization}</span>
                </div>
                <button
                  type="button"
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
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
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
            <Button 
              className="w-full bg-afrikoin-gradient text-white"
              onClick={handlePublish}
              disabled={isPublishing || selectedFiles.length === 0 || !user}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {text[language].publishing}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {text[language].publish}
                </>
              )}
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContentCreation;