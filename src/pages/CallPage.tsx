import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, PhoneOff, Bot, User } from 'lucide-react'
import { useAudioCall } from '@/hooks/useAudioCall'
import { toast } from 'sonner'

type CallType = 'ai' | 'teacher' | null

export function CallPage() {
  const { t } = useTranslation()
  const [callType, setCallType] = useState<CallType>(null)
  const { 
    isConnected, 
    isConnecting, 
    isSpeaking,
    startCall, 
    endCall 
  } = useAudioCall()

  const handleStartCall = async (type: CallType) => {
    try {
      setCallType(type)
      await startCall(type === 'ai' ? 'ai' : 'teacher')
      toast.success(
        type === 'ai' 
          ? t('call.aiCallStarted') 
          : t('call.teacherCallStarted')
      )
    } catch (error) {
      console.error('Error starting call:', error)
      toast.error(t('call.callError'))
      setCallType(null)
    }
  }

  const handleEndCall = () => {
    endCall()
    setCallType(null)
    toast.info(t('call.callEnded'))
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      <header>
        <h1 className="text-3xl font-bold mb-2">{t('call.title')}</h1>
        <p className="text-muted-foreground">{t('call.subtitle')}</p>
      </header>

      {!isConnected && !isConnecting && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>{t('call.aiAssistant')}</CardTitle>
                  <CardDescription>{t('call.aiDescription')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleStartCall('ai')}
                className="w-full"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('call.startAICall')}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-secondary/10">
                  <User className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <CardTitle>{t('call.teacher')}</CardTitle>
                  <CardDescription>{t('call.teacherDescription')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleStartCall('teacher')}
                className="w-full"
                variant="secondary"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('call.startTeacherCall')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {(isConnecting || isConnected) && (
        <Card className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {callType === 'ai' ? (
                  <div className="p-3 rounded-full bg-primary/10">
                    <Bot className="w-8 h-8 text-primary" />
                  </div>
                ) : (
                  <div className="p-3 rounded-full bg-secondary/10">
                    <User className="w-8 h-8 text-secondary" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-2xl">
                    {callType === 'ai' ? t('call.aiAssistant') : t('call.teacher')}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {isConnecting ? t('call.connecting') : t('call.connected')}
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Call Status */}
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                  isSpeaking ? 'bg-primary/20 animate-pulse' : 'bg-muted'
                }`}>
                  {callType === 'ai' ? (
                    <Bot className="w-16 h-16 text-primary" />
                  ) : (
                    <User className="w-16 h-16 text-secondary" />
                  )}
                </div>
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full border-4 border-primary animate-ping" />
                )}
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">
                {isSpeaking ? t('call.speaking') : t('call.listening')}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('call.speakNaturally')}
              </p>
            </div>

            {/* End Call Button */}
            <div className="flex justify-center">
              <Button 
                onClick={handleEndCall}
                variant="destructive"
                size="lg"
                className="rounded-full px-8"
                disabled={isConnecting}
              >
                <PhoneOff className="w-5 h-5 mr-2" />
                {t('call.endCall')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('call.howItWorks')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
              1
            </div>
            <p className="text-sm text-muted-foreground">{t('call.step1')}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <p className="text-sm text-muted-foreground">{t('call.step2')}</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <p className="text-sm text-muted-foreground">{t('call.step3')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
