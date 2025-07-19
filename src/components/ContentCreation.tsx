import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Video, Upload, MapPin, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { LoadingOverlay } from '@/components/ui/loading-overlay';
import { Language } from '@/types/language';

interface ContentCreationProps {
  language: Language;
}

const ContentCreation = ({ language }: ContentCreationProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [contentType, setContentType] = useState<'photo' | 'video'>('photo');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const { user } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!title.trim()) {
      newErrors.title = language === 'fr' ? 'Titre requis' : 'Title required';
    }

    if (!description.trim()) {
      newErrors.description = language === 'fr' ? 'Description requise' : 'Description required';
    }

    if (price && (isNaN(Number(price)) || Number(price) < 0)) {
      newErrors.price = language === 'fr' ? 'Prix invalide' : 'Invalid price';
    }

    if (!files || files.length === 0) {
      newErrors.files = language === 'fr' ? 'Au moins un fichier requis' : 'At least one file required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadFiles = async (postId: string) => {
    if (!files) return [];

    const uploadedFiles = [];
    const totalFiles = files.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${postId}/${Date.now()}-${i}.${fileExt}`;

      try {
        // Upload to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Create media file record
        const { data: mediaData, error: mediaError } = await supabase
          .from('media_files')
          .insert({
            post_id: postId,
            file_name: file.name,
            file_path: uploadData.path,
            mime_type: file.type,
            file_size: file.size,
            storage_bucket: 'posts'
          })
          .select()
          .single();

        if (mediaError) throw mediaError;

        uploadedFiles.push(mediaData);
        setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));

      } catch (error) {
        console.error('File upload error:', error);
        throw error;
      }
    }

    return uploadedFiles;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: language === 'fr' ? 'Vous devez être connecté' : 'You must be logged in',
        variant: 'destructive',
      });
      return;
    }

    if (!validateForm()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Create post
      const { data: postData, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          location: location.trim() || null,
          price: price ? Number(price) : null,
          content_type: contentType,
          is_monetized: !!price,
          status: 'published'
        })
        .select()
        .single();

      if (postError) throw postError;

      // Upload files
      await uploadFiles(postData.id);

      // Reset form
      setTitle('');
      setDescription('');
      setLocation('');
      setPrice('');
      setFiles(null);
      setErrors({});
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      toast({
        title: language === 'fr' ? 'Succès' : 'Success',
        description: language === 'fr' ? 'Contenu publié avec succès!' : 'Content published successfully!',
      });

    } catch (error: any) {
      console.error('Publish error:', error);
      
      let errorMessage = language === 'fr' ? 'Erreur lors de la publication' : 'Error publishing content';
      
      if (!navigator.onLine) {
        errorMessage = language === 'fr' ? 'Pas de connexion internet' : 'No internet connection';
      } else if (error?.message?.includes('413')) {
        errorMessage = language === 'fr' ? 'Fichier trop volumineux' : 'File too large';
      } else if (error?.message?.includes('storage')) {
        errorMessage = language === 'fr' ? 'Erreur de stockage' : 'Storage error';
      }

      toast({
        title: language === 'fr' ? 'Erreur' : 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const renderError = (field: string) => {
    if (!errors[field]) return null;
    return (
      <div className="flex items-center gap-1 text-sm text-destructive mt-1">
        <AlertCircle className="h-3 w-3" />
        <span>{errors[field]}</span>
      </div>
    );
  };

  const texts = {
    fr: {
      title: 'Créer du contenu',
      description: 'Partagez vos photos, vidéos et annonces avec la communauté',
      titleLabel: 'Titre',
      titlePlaceholder: 'Donnez un titre à votre publication...',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Décrivez votre contenu...',
      locationLabel: 'Localisation (optionnel)',
      locationPlaceholder: 'Où se trouve votre contenu?',
      priceLabel: 'Prix (optionnel)',
      pricePlaceholder: '0.00',
      filesLabel: 'Fichiers',
      photo: 'Photo',
      video: 'Vidéo',
      chooseFiles: 'Choisir les fichiers',
      publish: 'Publier',
      publishing: 'Publication...'
    },
    en: {
      title: 'Create Content',
      description: 'Share your photos, videos and listings with the community',
      titleLabel: 'Title',
      titlePlaceholder: 'Give your post a title...',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'Describe your content...',
      locationLabel: 'Location (optional)',
      locationPlaceholder: 'Where is your content located?',
      priceLabel: 'Price (optional)',
      pricePlaceholder: '0.00',
      filesLabel: 'Files',
      photo: 'Photo',
      video: 'Video',
      chooseFiles: 'Choose Files',
      publish: 'Publish',
      publishing: 'Publishing...'
    }
  };

  const t = texts[language];

  return (
    <>
      <LoadingOverlay 
        isLoading={isUploading} 
        message={`${t.publishing} ${uploadProgress}%`}
      />
      
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                {t.title}
              </CardTitle>
              <CardDescription>
                {t.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs value={contentType} onValueChange={(value) => setContentType(value as 'photo' | 'video')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="photo" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      {t.photo}
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      {t.video}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="photo" className="space-y-4 mt-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">{t.titleLabel}</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t.titlePlaceholder}
                        disabled={isUploading}
                      />
                      {renderError('title')}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{t.descriptionLabel}</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t.descriptionPlaceholder}
                        rows={3}
                        disabled={isUploading}
                      />
                      {renderError('description')}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {t.locationLabel}
                        </Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder={t.locationPlaceholder}
                          disabled={isUploading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">{t.priceLabel}</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder={t.pricePlaceholder}
                          disabled={isUploading}
                        />
                        {renderError('price')}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file-upload" className="flex items-center gap-1">
                        <Upload className="h-4 w-4" />
                        {t.filesLabel}
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setFiles(e.target.files)}
                        disabled={isUploading}
                      />
                      {renderError('files')}
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4 mt-6">
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">{t.titleLabel}</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={t.titlePlaceholder}
                        disabled={isUploading}
                      />
                      {renderError('title')}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">{t.descriptionLabel}</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={t.descriptionPlaceholder}
                        rows={3}
                        disabled={isUploading}
                      />
                      {renderError('description')}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {t.locationLabel}
                        </Label>
                        <Input
                          id="location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder={t.locationPlaceholder}
                          disabled={isUploading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="price">{t.priceLabel}</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder={t.pricePlaceholder}
                          disabled={isUploading}
                        />
                        {renderError('price')}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file-upload" className="flex items-center gap-1">
                        <Upload className="h-4 w-4" />
                        {t.filesLabel}
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={(e) => setFiles(e.target.files)}
                        disabled={isUploading}
                      />
                      {renderError('files')}
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isUploading || !user}
                >
                  {isUploading ? t.publishing : t.publish}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default ContentCreation;
