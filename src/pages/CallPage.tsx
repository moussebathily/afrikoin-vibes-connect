import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Phone, PhoneOff, Bot, User, Mic, MicOff, Volume2, VolumeX, ArrowLeft } from 'lucide-react'
import { useAudioCall } from '@/hooks/useAudioCall'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

type CallType = 'ai' | 'teacher' | null

export function CallPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [callType, setCallType] = useState<CallType>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)
  const [callDuration, setCallDuration] = useState(0)
  const { 
    isConnected, 
    isConnecting, 
    isSpeaking,
    startCall, 
    endCall 
  } = useAudioCall()

  // Call timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isConnected])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartCall = async (type: CallType) => {
    try {
      setCallType(type)
      setCallDuration(0)
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
    setCallDuration(0)
    toast.info(t('call.callEnded'))
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    toast.info(isMuted ? 'Micro activé' : 'Micro désactivé')
  }

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn)
    toast.info(isSpeakerOn ? 'Haut-parleur désactivé' : 'Haut-parleur activé')
  }

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{t('call.title')}</h1>
          <p className="text-muted-foreground text-sm">{t('call.subtitle')}</p>
        </div>
      </header>

      {/* Call Selection */}
      {!isConnected && !isConnecting && (
        <div className="grid gap-4 md:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Card className="hover:shadow-elegant transition-all hover:scale-[1.02] cursor-pointer group border-2 hover:border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-primary shadow-elegant group-hover:shadow-glow transition-all">
                  <Bot className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('call.aiAssistant')}</CardTitle>
                  <CardDescription>{t('call.aiDescription')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleStartCall('ai')}
                className="w-full h-12"
                variant="gradient"
                size="lg"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t('call.startAICall')}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all hover:scale-[1.02] cursor-pointer group border-2 hover:border-secondary/50">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full bg-gradient-secondary shadow-elegant group-hover:shadow-glow transition-all">
                  <User className="w-8 h-8 text-secondary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg">{t('call.teacher')}</CardTitle>
                  <CardDescription>{t('call.teacherDescription')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleStartCall('teacher')}
                className="w-full h-12"
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

      {/* Active Call UI */}
      {(isConnecting || isConnected) && (
        <Card className="border-2 border-primary/20 animate-in fade-in zoom-in duration-300 overflow-hidden">
          {/* Call Header */}
          <div className="bg-gradient-primary p-4 text-primary-foreground">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {callType === 'ai' ? (
                  <Bot className="w-6 h-6" />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <div>
                  <h3 className="font-semibold">
                    {callType === 'ai' ? t('call.aiAssistant') : t('call.teacher')}
                  </h3>
                  <p className="text-sm opacity-90">
                    {isConnecting ? t('call.connecting') : formatDuration(callDuration)}
                  </p>
                </div>
              </div>
              {isConnected && (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                  <span className="text-sm">{t('call.connected')}</span>
                </div>
              )}
            </div>
          </div>

          <CardContent className="p-6 space-y-6">
            {/* Avatar with speaking animation */}
            <div className="flex items-center justify-center py-8">
              <div className="relative">
                {/* Ripple effects when speaking */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                    <div className="absolute inset-[-10px] rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                  </>
                )}
                
                <div className={`relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSpeaking 
                    ? 'bg-gradient-primary shadow-glow scale-110' 
                    : 'bg-muted'
                }`}>
                  {callType === 'ai' ? (
                    <Bot className={`w-16 h-16 transition-colors ${isSpeaking ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  ) : (
                    <User className={`w-16 h-16 transition-colors ${isSpeaking ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  )}
                </div>
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center space-y-1">
              <p className="text-xl font-semibold">
                {isConnecting && (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                )}
                {isConnected && (isSpeaking ? t('call.speaking') : t('call.listening'))}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('call.speakNaturally')}
              </p>
            </div>

            {/* Call Controls */}
            <div className="flex items-center justify-center gap-4">
              {/* Mute Button */}
              <Button 
                variant={isMuted ? 'destructive' : 'outline'}
                size="lg"
                className="w-14 h-14 rounded-full"
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              
              {/* End Call Button */}
              <Button 
                onClick={handleEndCall}
                variant="destructive"
                size="lg"
                className="w-20 h-20 rounded-full shadow-lg hover:scale-110 transition-transform"
                disabled={isConnecting}
              >
                <PhoneOff className="w-8 h-8" />
              </Button>
              
              {/* Speaker Button */}
              <Button 
                variant={!isSpeakerOn ? 'destructive' : 'outline'}
                size="lg"
                className="w-14 h-14 rounded-full"
                onClick={toggleSpeaker}
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!isConnected && !isConnecting && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <CardHeader>
            <CardTitle className="text-lg">{t('call.howItWorks')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { num: 1, text: t('call.step1') },
              { num: 2, text: t('call.step2') },
              { num: 3, text: t('call.step3') }
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {step.num}
                </div>
                <p className="text-muted-foreground pt-1">{step.text}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
