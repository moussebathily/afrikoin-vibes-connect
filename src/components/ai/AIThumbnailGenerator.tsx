import React, { useState } from "react";
import { Image, Download, Palette, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";

interface AIThumbnailGeneratorProps {
  productName: string;
  price: number | string;
  currency?: string;
  category?: string;
  onThumbnailGenerated?: (thumbnailUrl: string) => void;
}

export function AIThumbnailGenerator({
  productName,
  price,
  currency = "XOF",
  category,
  onThumbnailGenerated,
}: AIThumbnailGeneratorProps) {
  const [style, setStyle] = useState("modern");
  const [result, setResult] = useState<any>(null);
  const { generateThumbnail, loading } = useAI();
  const { toast } = useToast();

  const styles = [
    {
      value: "modern",
      label: "Moderne",
      description: "Design épuré et contemporain",
    },
    {
      value: "traditional",
      label: "Traditionnel",
      description: "Motifs africains authentiques",
    },
    {
      value: "luxury",
      label: "Luxe",
      description: "Élégant avec accents dorés",
    },
    {
      value: "vibrant",
      label: "Vibrant",
      description: "Couleurs vives et dynamiques",
    },
  ];

  const handleGeneration = async () => {
    if (!productName || !price) {
      toast({
        title: "Informations manquantes",
        description: "Nom du produit et prix requis",
        variant: "destructive",
      });
      return;
    }

    const thumbnailResult = await generateThumbnail(
      productName,
      price,
      currency,
      category,
      style,
    );
    if (thumbnailResult) {
      setResult(thumbnailResult);
      if (thumbnailResult.success && thumbnailResult.thumbnail_url) {
        onThumbnailGenerated?.(thumbnailResult.thumbnail_url);
      }
    }
  };

  const downloadThumbnail = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${productName}-miniature.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Téléchargement démarré",
        description: "La miniature a été téléchargée",
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de télécharger l'image",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Image className="h-5 w-5 text-primary" />
          Générateur de Miniatures IA
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Produit :</span>
            <p className="text-muted-foreground truncate">{productName}</p>
          </div>
          <div>
            <span className="font-medium">Prix :</span>
            <p className="text-primary font-medium">
              {price} {currency}
            </p>
          </div>
        </div>

        {category && (
          <Badge variant="outline" className="w-fit">
            {category}
          </Badge>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Style de miniature :</label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {styles.map((styleOption) => (
                <SelectItem key={styleOption.value} value={styleOption.value}>
                  <div>
                    <div className="font-medium">{styleOption.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {styleOption.description}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleGeneration}
          disabled={loading || !productName}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Palette className="h-4 w-4 mr-2" />
              Générer la miniature
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4 pt-4 border-t">
            {result.success && result.thumbnail_url ? (
              <div className="space-y-3">
                <div className="text-sm font-medium">Miniature générée :</div>
                <div className="relative">
                  <img
                    src={result.thumbnail_url}
                    alt={`Miniature ${productName}`}
                    className="w-full max-w-sm mx-auto rounded-lg border shadow-sm"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => downloadThumbnail(result.thumbnail_url)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Format: WebP</span>
                  <span>Ratio: 1:1</span>
                  <span>Optimisé mobile</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm font-medium">
                  Miniature texte (fallback) :
                </div>
                <div
                  className="w-full max-w-sm mx-auto aspect-square rounded-lg flex flex-col items-center justify-center text-center p-4"
                  style={{
                    backgroundColor:
                      result.fallback_thumbnail?.backgroundColor || "#FF6B35",
                    color: result.fallback_thumbnail?.textColor || "#FFFFFF",
                  }}
                >
                  <div className="text-xs font-bold mb-2">AfriKoin</div>
                  <div className="text-sm font-medium mb-2 line-clamp-2">
                    {productName}
                  </div>
                  <div className="text-lg font-bold">
                    {price} {currency}
                  </div>
                  {category && (
                    <div className="text-xs mt-2 opacity-80">{category}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
