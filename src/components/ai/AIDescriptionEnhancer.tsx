import React, { useState } from "react";
import { Sparkles, Copy, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAI } from "@/hooks/useAI";
import { useToast } from "@/hooks/use-toast";

interface AIDescriptionEnhancerProps {
  initialDescription: string;
  category?: string;
  price?: string;
  language?: string;
  onEnhancementComplete?: (enhanced: string, keywords: string[]) => void;
}

export function AIDescriptionEnhancer({
  initialDescription,
  category,
  price,
  language = "fr",
  onEnhancementComplete,
}: AIDescriptionEnhancerProps) {
  const [description, setDescription] = useState(initialDescription);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { enhanceDescription, loading } = useAI();
  const { toast } = useToast();

  const handleEnhancement = async () => {
    if (!description.trim()) {
      toast({
        title: "Description requise",
        description: "Veuillez saisir une description à améliorer",
        variant: "destructive",
      });
      return;
    }

    const enhancementResult = await enhanceDescription(
      description,
      category,
      price,
      language,
    );
    if (enhancementResult) {
      setResult(enhancementResult);
      onEnhancementComplete?.(
        enhancementResult.enhanced_description,
        enhancementResult.suggested_keywords,
      );
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copié !",
        description: "Description copiée dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
    }
  };

  const useEnhancedDescription = () => {
    if (result?.enhanced_description) {
      setDescription(result.enhanced_description);
      setResult(null);
      toast({
        title: "Description mise à jour",
        description: "La description améliorée a été appliquée",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Assistant IA - Description
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Description actuelle :</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Saisissez votre description de produit..."
            className="min-h-[100px]"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{description.length} caractères</span>
            {category && <Badge variant="outline">{category}</Badge>}
          </div>
        </div>

        <Button
          onClick={handleEnhancement}
          disabled={loading || !description.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Amélioration en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Améliorer avec l'IA
            </>
          )}
        </Button>

        {result && (
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Description améliorée :
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result.enhanced_description)}
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button size="sm" onClick={useEnhancedDescription}>
                    Utiliser
                  </Button>
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg text-sm">
                {result.enhanced_description}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <span className="font-medium text-primary">
                    {result.enhanced_description.length}
                  </span>
                  <br />
                  <span className="text-muted-foreground">caractères</span>
                </div>
                <div className="text-center">
                  <span className="font-medium text-primary">
                    +{result.improvement_summary.added_value}
                  </span>
                  <br />
                  <span className="text-muted-foreground">améliorés</span>
                </div>
                <div className="text-center">
                  <span className="font-medium text-primary">
                    {result.improvement_summary.readability_score}/10
                  </span>
                  <br />
                  <span className="text-muted-foreground">lisibilité</span>
                </div>
              </div>
            </div>

            {result.suggested_keywords?.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">
                  Mots-clés suggérés :
                </span>
                <div className="flex flex-wrap gap-1">
                  {result.suggested_keywords.map(
                    (keyword: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {keyword}
                      </Badge>
                    ),
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
