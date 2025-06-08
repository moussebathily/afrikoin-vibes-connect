
import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileArchive, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Language } from '@/types/language';

interface AppBundleUploaderProps {
  language: Language;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

const AppBundleUploader: React.FC<AppBundleUploaderProps> = ({ language }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const text = {
    fr: {
      title: 'Importer des App Bundles',
      subtitle: 'Déposez vos fichiers d\'application ici ou cliquez pour sélectionner',
      dragText: 'Glissez et déposez vos app bundles ici',
      clickText: 'ou cliquez pour sélectionner des fichiers',
      supportedFormats: 'Formats supportés: .apk, .ipa, .aab, .zip',
      maxSize: 'Taille maximale: 100 MB par fichier',
      selectFiles: 'Sélectionner des fichiers',
      uploading: 'Téléchargement...',
      success: 'Téléchargé avec succès',
      error: 'Erreur de téléchargement',
      remove: 'Supprimer',
      uploadedFiles: 'Fichiers téléchargés',
      noFiles: 'Aucun fichier téléchargé'
    },
    en: {
      title: 'Import App Bundles',
      subtitle: 'Drop your application files here or click to select',
      dragText: 'Drag and drop your app bundles here',
      clickText: 'or click to select files',
      supportedFormats: 'Supported formats: .apk, .ipa, .aab, .zip',
      maxSize: 'Max size: 100 MB per file',
      selectFiles: 'Select files',
      uploading: 'Uploading...',
      success: 'Successfully uploaded',
      error: 'Upload error',
      remove: 'Remove',
      uploadedFiles: 'Uploaded files',
      noFiles: 'No files uploaded'
    },
    bm: {
      title: 'App Bundle jigin',
      subtitle: 'I ka application files don yan walima click ka files sugandi',
      dragText: 'I ka app bundles don yan',
      clickText: 'walima click ka files sugandi',
      supportedFormats: 'Cogoya minnu bɛ: .apk, .ipa, .aab, .zip',
      maxSize: 'Bonya: 100 MB file kelen-kelen na',
      selectFiles: 'Files sugandi',
      uploading: 'Ka jigin...',
      success: 'A jiginna ka ɲi',
      error: 'Jigin fili',
      remove: 'A bɔ',
      uploadedFiles: 'Files jiginnenw',
      noFiles: 'File si tɛ jiginnen'
    },
    ar: {
      title: 'استيراد حزم التطبيقات',
      subtitle: 'اسقط ملفات التطبيق هنا أو انقر للاختيار',
      dragText: 'اسحب وأسقط حزم التطبيقات هنا',
      clickText: 'أو انقر لاختيار الملفات',
      supportedFormats: 'الصيغ المدعومة: .apk, .ipa, .aab, .zip',
      maxSize: 'الحد الأقصى: 100 ميجابايت لكل ملف',
      selectFiles: 'اختيار الملفات',
      uploading: 'جاري الرفع...',
      success: 'تم الرفع بنجاح',
      error: 'خطأ في الرفع',
      remove: 'إزالة',
      uploadedFiles: 'الملفات المرفوعة',
      noFiles: 'لا توجد ملفات مرفوعة'
    },
    ti: {
      title: 'App Bundle ኣእቱ',
      subtitle: 'ናይ ኣፕሊኬሽን ፋይላት ኣብዚ ኣውርድ ወይ ምረጽ ጠውቕ',
      dragText: 'App bundles ናብዚ ስሕብ ኣውርድ',
      clickText: 'ወይ ፋይላት ንምምራጽ ጠውቕ',
      supportedFormats: 'ዝድገፉ ቅርጺታት: .apk, .ipa, .aab, .zip',
      maxSize: 'ዝዓበየ መጠን: ሓደ ፋይል 100 MB',
      selectFiles: 'ፋይላት ምረጽ',
      uploading: 'ይላእክ...',
      success: 'ብዓወት ተላኢኹ',
      error: 'ኣብ ምላኻ ጌጋ',
      remove: 'ኣውጽእ',
      uploadedFiles: 'ዝተላኣኹ ፋይላት',
      noFiles: 'ዝተላኣኸ ፋይል የለን'
    },
    pt: {
      title: 'Importar App Bundles',
      subtitle: 'Solte seus arquivos de aplicativo aqui ou clique para selecionar',
      dragText: 'Arraste e solte seus app bundles aqui',
      clickText: 'ou clique para selecionar arquivos',
      supportedFormats: 'Formatos suportados: .apk, .ipa, .aab, .zip',
      maxSize: 'Tamanho máximo: 100 MB por arquivo',
      selectFiles: 'Selecionar arquivos',
      uploading: 'Enviando...',
      success: 'Enviado com sucesso',
      error: 'Erro no envio',
      remove: 'Remover',
      uploadedFiles: 'Arquivos enviados',
      noFiles: 'Nenhum arquivo enviado'
    },
    es: {
      title: 'Importar App Bundles',
      subtitle: 'Suelta tus archivos de aplicación aquí o haz clic para seleccionar',
      dragText: 'Arrastra y suelta tus app bundles aquí',
      clickText: 'o haz clic para seleccionar archivos',
      supportedFormats: 'Formatos soportados: .apk, .ipa, .aab, .zip',
      maxSize: 'Tamaño máximo: 100 MB por archivo',
      selectFiles: 'Seleccionar archivos',
      uploading: 'Subiendo...',
      success: 'Subido exitosamente',
      error: 'Error al subir',
      remove: 'Eliminar',
      uploadedFiles: 'Archivos subidos',
      noFiles: 'No hay archivos subidos'
    },
    zh: {
      title: '导入应用包',
      subtitle: '将应用文件拖放到这里或点击选择',
      dragText: '将应用包拖放到这里',
      clickText: '或点击选择文件',
      supportedFormats: '支持格式：.apk, .ipa, .aab, .zip',
      maxSize: '最大大小：每个文件100MB',
      selectFiles: '选择文件',
      uploading: '上传中...',
      success: '上传成功',
      error: '上传错误',
      remove: '删除',
      uploadedFiles: '已上传文件',
      noFiles: '没有上传的文件'
    },
    ru: {
      title: 'Импорт App Bundle',
      subtitle: 'Перетащите файлы приложений сюда или нажмите для выбора',
      dragText: 'Перетащите app bundles сюда',
      clickText: 'или нажмите для выбора файлов',
      supportedFormats: 'Поддерживаемые форматы: .apk, .ipa, .aab, .zip',
      maxSize: 'Максимальный размер: 100 МБ на файл',
      selectFiles: 'Выбрать файлы',
      uploading: 'Загрузка...',
      success: 'Успешно загружено',
      error: 'Ошибка загрузки',
      remove: 'Удалить',
      uploadedFiles: 'Загруженные файлы',
      noFiles: 'Нет загруженных файлов'
    },
    hi: {
      title: 'ऐप बंडल आयात करें',
      subtitle: 'अपनी एप्लिकेशन फाइलें यहां छोड़ें या चुनने के लिए क्लिक करें',
      dragText: 'अपने ऐप बंडल यहां खींचें और छोड़ें',
      clickText: 'या फाइलें चुनने के लिए क्लिक करें',
      supportedFormats: 'समर्थित प्रारूप: .apk, .ipa, .aab, .zip',
      maxSize: 'अधिकतम आकार: प्रति फाइल 100 MB',
      selectFiles: 'फाइलें चुनें',
      uploading: 'अपलोड हो रहा है...',
      success: 'सफलतापूर्वक अपलोड किया गया',
      error: 'अपलोड त्रुटि',
      remove: 'हटाएं',
      uploadedFiles: 'अपलोड की गई फाइलें',
      noFiles: 'कोई फाइल अपलोड नहीं की गई'
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = useCallback((files: FileList) => {
    const validTypes = ['.apk', '.ipa', '.aab', '.zip'];
    
    Array.from(files).forEach((file) => {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (validTypes.includes(fileExtension) && file.size <= 100 * 1024 * 1024) {
        const fileId = Math.random().toString(36).substr(2, 9);
        const newFile: UploadedFile = {
          id: fileId,
          name: file.name,
          size: file.size,
          status: 'uploading',
          progress: 0
        };

        setUploadedFiles(prev => [...prev, newFile]);

        // Simuler l'upload
        simulateUpload(fileId);
      }
    });
  }, []);

  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      setUploadedFiles(prev => 
        prev.map(file => 
          file.id === fileId 
            ? { ...file, progress: Math.min(progress, 100) }
            : file
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadedFiles(prev => 
            prev.map(file => 
              file.id === fileId 
                ? { ...file, status: 'success', progress: 100 }
                : file
            )
          );
        }, 500);
      }
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{text[language].title}</h2>
          <p className="text-xl text-muted-foreground">{text[language].subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Zone de dépôt */}
          <Card 
            className={`p-12 border-2 border-dashed transition-all duration-200 cursor-pointer ${
              dragActive 
                ? 'border-primary bg-primary/5 scale-105' 
                : 'border-muted-foreground/20 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{text[language].dragText}</h3>
              <p className="text-muted-foreground mb-4">{text[language].clickText}</p>
              
              <Button className="mb-4">
                <FileArchive className="w-4 h-4 mr-2" />
                {text[language].selectFiles}
              </Button>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{text[language].supportedFormats}</p>
                <p>{text[language].maxSize}</p>
              </div>
            </div>
          </Card>

          <input
            id="fileInput"
            type="file"
            multiple
            accept=".apk,.ipa,.aab,.zip"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          {/* Liste des fichiers téléchargés */}
          {uploadedFiles.length > 0 && (
            <Card className="mt-8 p-6">
              <h3 className="text-lg font-semibold mb-4">{text[language].uploadedFiles}</h3>
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <FileArchive className="w-8 h-8 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{file.name}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.size)}</span>
                          {file.status === 'uploading' && (
                            <span>{text[language].uploading} {Math.round(file.progress)}%</span>
                          )}
                          {file.status === 'success' && (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {text[language].success}
                            </span>
                          )}
                          {file.status === 'error' && (
                            <span className="flex items-center text-red-600">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {text[language].error}
                            </span>
                          )}
                        </div>
                        {file.status === 'uploading' && (
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export default AppBundleUploader;
