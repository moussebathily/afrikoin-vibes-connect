import React, { useState } from 'react'
import { Languages, Loader2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useTranslation } from 'react-i18next'
import { useAI } from '@/hooks/useAI'
import { languages } from '@/i18n/config'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from '@/hooks/use-toast'

interface AutoTranslateButtonProps {
  text: string
  onTranslated: (translatedText: string, targetLanguage: string) => void
  context?: 'marketplace' | 'product' | 'message' | 'notification' | 'job'
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function AutoTranslateButton({
  text,
  onTranslated,
  context = 'marketplace',
  className,
  variant = 'outline',
  size = 'sm'
}: AutoTranslateButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [translating, setTranslating] = useState<string | null>(null)
  const [translatedLanguages, setTranslatedLanguages] = useState<Set<string>>(new Set())
  const { i18n, t } = useTranslation()
  const { translateText, loading } = useAI()

  // Langues prioritaires africaines
  const priorityLanguages = ['fr', 'en', 'ar', 'sw', 'ha', 'yo', 'ig', 'am', 'pt', 'wo', 'zu', 'xh']
  
  const sortedLanguages = [...languages].sort((a, b) => {
    const aIsPriority = priorityLanguages.includes(a.code)
    const bIsPriority = priorityLanguages.includes(b.code)
    if (aIsPriority && !bIsPriority) return -1
    if (!aIsPriority && bIsPriority) return 1
    return a.name.localeCompare(b.name)
  })

  const handleTranslate = async (targetLang: string) => {
    if (!text.trim()) {
      toast({
        title: t('common.error'),
        description: 'Aucun texte à traduire',
        variant: 'destructive'
      })
      return
    }

    setTranslating(targetLang)
    
    try {
      const result = await translateText(text, targetLang, 'auto', context)
      
      if (result?.translated_text) {
        onTranslated(result.translated_text, targetLang)
        setTranslatedLanguages(prev => new Set([...prev, targetLang]))
        toast({
          title: 'Traduction réussie',
          description: `Traduit vers ${languages.find(l => l.code === targetLang)?.nativeName || targetLang}`
        })
      } else {
        throw new Error('Traduction échouée')
      }
    } catch (error) {
      console.error('Translation error:', error)
      toast({
        title: t('common.error'),
        description: 'Erreur lors de la traduction',
        variant: 'destructive'
      })
    } finally {
      setTranslating(null)
    }
  }

  const quickTranslate = async () => {
    // Traduire vers la langue actuelle de l'interface si différente du texte
    const targetLang = i18n.language === 'fr' ? 'en' : 'fr'
    await handleTranslate(targetLang)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1" />
          ) : (
            <Languages className="h-4 w-4 mr-1" />
          )}
          Traduire
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-2" align="start">
        <div className="space-y-2">
          <div className="px-2 py-1.5">
            <h4 className="font-medium text-sm">Traduire vers</h4>
            <p className="text-xs text-muted-foreground">
              Sélectionnez une langue cible
            </p>
          </div>
          
          {/* Quick translate buttons */}
          <div className="flex gap-1 px-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => handleTranslate('fr')}
              disabled={translating !== null}
            >
              {translating === 'fr' ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : translatedLanguages.has('fr') ? (
                <Check className="h-3 w-3 mr-1 text-green-500" />
              ) : null}
              Français
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => handleTranslate('en')}
              disabled={translating !== null}
            >
              {translating === 'en' ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : translatedLanguages.has('en') ? (
                <Check className="h-3 w-3 mr-1 text-green-500" />
              ) : null}
              English
            </Button>
          </div>

          <ScrollArea className="h-56">
            <div className="space-y-0.5 px-1">
              {sortedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleTranslate(lang.code)}
                  disabled={translating !== null}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors disabled:opacity-50 ${
                    priorityLanguages.includes(lang.code) ? 'font-medium' : ''
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span>{lang.nativeName}</span>
                    <span className="text-xs text-muted-foreground">{lang.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {translating === lang.code && (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                    {translatedLanguages.has(lang.code) && (
                      <Check className="h-3 w-3 text-green-500" />
                    )}
                    <span className="text-xs text-muted-foreground font-mono">
                      {lang.code}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
