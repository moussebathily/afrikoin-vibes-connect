import React, { useState, useCallback } from 'react'
import { Shield, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAI } from '@/hooks/useAI'
import { ModerationResult } from '@/types/ai'

interface AIContentModeratorProps {
  imageUrl?: string
  text?: string
  onModerationComplete?: (result: ModerationResult) => void
  autoModerate?: boolean
}

export function AIContentModerator({ 
  imageUrl, 
  text, 
  onModerationComplete,
  autoModerate = false 
}: AIContentModeratorProps) {
  const [result, setResult] = useState<ModerationResult | null>(null)
  const { moderateContent, loading } = useAI()

  const handleModeration = useCallback(async () => {
    const moderationResult = await moderateContent(imageUrl, text)
    if (moderationResult) {
      setResult(moderationResult)
      onModerationComplete?.(moderationResult)
    }
  }, [imageUrl, text, moderateContent, onModerationComplete])

  React.useEffect(() => {
    if (autoModerate && (imageUrl || text)) {
      handleModeration()
    }
  }, [autoModerate, handleModeration])

  const getStatusIcon = () => {
    if (!result) return <Shield className="h-5 w-5 text-muted-foreground" />
    if (result.approved) return <CheckCircle className="h-5 w-5 text-success" />
    return <XCircle className="h-5 w-5 text-destructive" />
  }

  const getStatusColor = () => {
    if (!result) return 'secondary'
    if (result.approved) return 'default'
    return 'destructive'
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {getStatusIcon()}
          Modération IA
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!result && !autoModerate && (
          <Button 
            onClick={handleModeration} 
            disabled={loading || (!imageUrl && !text)}
            size="sm"
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Analyser le contenu
              </>
            )}
          </Button>
        )}

        {result && (
          <div className="space-y-3">
            {/* Statut global */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Statut :</span>
              <Badge variant={getStatusColor()}>
                {result.approved ? 'Approuvé' : 'Rejeté'}
              </Badge>
            </div>

            {/* Analyse de qualité */}
            {result.quality_analysis && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Qualité :</span>
                  <Badge variant={result.quality_analysis.score >= 7 ? 'default' : 'secondary'}>
                    {result.quality_analysis.score}/10
                  </Badge>
                </div>
                
                {result.quality_analysis.issues?.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    <strong>Améliorations suggérées :</strong>
                    <ul className="list-disc list-inside mt-1">
                      {result.quality_analysis.issues.map((issue: string, index: number) => (
                        <li key={index}>{issue}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.quality_analysis.category && (
                  <div className="text-xs">
                    <strong>Catégorie suggérée :</strong> {result.quality_analysis.category}
                  </div>
                )}

                {result.quality_analysis.price_range && (
                  <div className="text-xs">
                    <strong>Fourchette de prix :</strong> {result.quality_analysis.price_range}
                  </div>
                )}
              </div>
            )}

            {/* Recommandations */}
            {result.recommendations?.improvements?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Recommandations :</span>
                </div>
                <ul className="text-xs text-muted-foreground list-disc list-inside">
                  {result.recommendations.improvements.map((improvement: string, index: number) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Publication possible */}
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Peut publier :</span>
              <Badge variant={result.recommendations?.can_publish ? 'default' : 'destructive'}>
                {result.recommendations?.can_publish ? 'Oui' : 'Non'}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}