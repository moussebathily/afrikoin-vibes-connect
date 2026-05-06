import React, { useState, useRef } from 'react'
import { Check, CheckCheck, FileText, Trash2, Reply, Play, Pause, Volume2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Message } from '@/hooks/useMessaging'
import { TranslatedText } from './TranslatedText'
import type { TranslationLang } from '@/hooks/useChatTranslation'

interface Props {
  message: Message
  isOwn: boolean
  onDelete?: (id: string) => void
  onReply?: (msg: Message) => void
  translationTarget?: TranslationLang
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function AudioPlayer({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
        {playing ? <Pause className="h-3.5 w-3.5 text-primary" /> : <Play className="h-3.5 w-3.5 text-primary" />}
      </button>
      <div className="flex-1 h-1.5 bg-primary/20 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <Volume2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={() => {
          const a = audioRef.current
          if (a && a.duration) setProgress((a.currentTime / a.duration) * 100)
        }}
        onEnded={() => { setPlaying(false); setProgress(0) }}
      />
    </div>
  )
}

export function MessageBubble({ message, isOwn, onDelete, onReply, translationTarget = 'off' }: Props) {
  const [showActions, setShowActions] = useState(false)
  const isRead = (message.reads?.length ?? 0) > 0

  if (message.is_deleted) {
    return (
      <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
        <div className="px-4 py-2 rounded-2xl bg-muted/50 text-muted-foreground text-sm italic max-w-xs">
          🗑️ Message supprimé
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn("flex gap-2 group", isOwn ? "flex-row-reverse" : "flex-row")}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {!isOwn && (
        <div className="flex-shrink-0 self-end mb-1">
          {message.sender_profile?.avatar_url ? (
            <img src={message.sender_profile.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
              {(message.sender_profile?.display_name ?? message.sender_profile?.name ?? 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      )}

      <div className={cn("flex flex-col max-w-[75%]", isOwn ? "items-end" : "items-start")}>
        {/* Sender name (groups) */}
        {!isOwn && (
          <span className="text-[10px] text-muted-foreground px-1 mb-0.5">
            {message.sender_profile?.display_name ?? message.sender_profile?.name ?? 'Utilisateur'}
          </span>
        )}

        {/* Reply preview */}
        {message.reply_to && (
          <div className={cn(
            "px-3 py-1.5 rounded-xl mb-1 border-l-2 border-primary bg-muted/50 text-xs text-muted-foreground max-w-full truncate",
            isOwn ? "border-primary/50" : ""
          )}>
            <p className="font-medium text-primary text-[10px]">
              {message.reply_to.sender_id === message.sender_id ? 'Vous' : 'Réponse'}
            </p>
            <p className="truncate">{message.reply_to.content ?? '📎 Fichier'}</p>
          </div>
        )}

        {/* Bubble */}
        <div className={cn(
          "px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm max-w-full",
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-card border border-border text-foreground rounded-bl-sm"
        )}>
          {/* Text */}
          {message.message_type === 'text' && (
            <TranslatedText
              text={message.content ?? ''}
              autoTranslate={!isOwn && translationTarget !== 'off'}
              targetLang={translationTarget}
            />
          )}

          {/* Image */}
          {message.message_type === 'image' && message.file_url && (
            <a href={message.file_url} target="_blank" rel="noopener noreferrer">
              <img
                src={message.file_url}
                alt={message.file_name ?? 'Image'}
                className="max-w-[240px] max-h-[240px] rounded-xl object-cover cursor-pointer hover:opacity-90 transition-opacity"
              />
            </a>
          )}

          {/* Audio */}
          {message.message_type === 'audio' && message.file_url && (
            <AudioPlayer url={message.file_url} />
          )}

          {/* Video */}
          {message.message_type === 'video' && message.file_url && (
            <video
              src={message.file_url}
              controls
              className="max-w-[240px] rounded-xl"
            />
          )}

          {/* File */}
          {message.message_type === 'file' && message.file_url && (
            <a
              href={message.file_url}
              download={message.file_name}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                isOwn ? "bg-primary-foreground/20" : "bg-primary/10"
              )}>
                <FileText className={cn("h-5 w-5", isOwn ? "text-primary-foreground" : "text-primary")} />
              </div>
              <div>
                <p className="text-xs font-medium truncate max-w-[140px]">{message.file_name ?? 'Fichier'}</p>
                <p className={cn("text-[10px]", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {formatBytes(message.file_size)}
                </p>
              </div>
            </a>
          )}
        </div>

        {/* Meta */}
        <div className={cn("flex items-center gap-1 mt-0.5 px-1", isOwn ? "flex-row-reverse" : "flex-row")}>
          <span className="text-[10px] text-muted-foreground">
            {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
          </span>
          {isOwn && (
            isRead
              ? <CheckCheck className="h-3 w-3 text-primary" />
              : <Check className="h-3 w-3 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className={cn(
          "flex items-center gap-1 self-center opacity-0 group-hover:opacity-100 transition-opacity",
        )}>
          {onReply && (
            <button
              onClick={() => onReply(message)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <Reply className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          )}
          {isOwn && onDelete && (
            <button
              onClick={() => onDelete(message.id)}
              className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
