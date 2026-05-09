import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, Users, Phone, Video, Info, MoreVertical } from 'lucide-react'
import { useMessages, Conversation, Message } from '@/hooks/useMessaging'
import { useAuth } from '@/contexts/AuthContext'
import { MessageBubble } from './MessageBubble'
import { MessageInput } from './MessageInput'
import { TranslationToggle } from './TranslationToggle'
import { useChatTranslation } from '@/hooks/useChatTranslation'
import { cn } from '@/lib/utils'

interface Props {
  conversation: Conversation
  onBack?: () => void
  onCall?: (type: 'audio' | 'video') => void
}

function getConvName(conv: Conversation, currentUserId: string): string {
  if (conv.type === 'group') return conv.name ?? 'Groupe'
  const other = conv.members?.find(m => m.user_id !== currentUserId)
  return other?.profile?.display_name ?? other?.profile?.name ?? other?.profile?.username ?? 'Conversation'
}

function getConvAvatar(conv: Conversation, currentUserId: string): string | null {
  if (conv.type === 'group') return conv.avatar_url
  const other = conv.members?.find(m => m.user_id !== currentUserId)
  return other?.profile?.avatar_url ?? null
}

function getParticipantsText(conv: Conversation, currentUserId: string): string {
  if (conv.type === 'private') return 'En ligne'
  const count = (conv.members?.length ?? 0)
  return `${count} participant${count > 1 ? 's' : ''}`
}

export function ConversationView({ conversation, onBack, onCall }: Props) {
  const { user } = useAuth()
  const { messages, loading, sendMessage, deleteMessage } = useMessages(conversation.id)
  const { targetLang, setTargetLang, translateOwn, setTranslateOwn } = useChatTranslation()
  const [replyTo, setReplyTo] = useState<Message | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastCount = useRef(0)

  // Scroll on new message
  useEffect(() => {
    if (messages.length !== lastCount.current) {
      bottomRef.current?.scrollIntoView({ behavior: messages.length - lastCount.current === 1 ? 'smooth' : 'auto' })
      lastCount.current = messages.length
    }
  }, [messages])

  const name = getConvName(conversation, user?.id ?? '')
  const avatar = getConvAvatar(conversation, user?.id ?? '')
  const sub = getParticipantsText(conversation, user?.id ?? '')

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shadow-sm flex-shrink-0">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-muted rounded-xl transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        )}

        {/* Avatar */}
        {avatar ? (
          <img src={avatar} alt={name} className="w-10 h-10 rounded-2xl object-cover flex-shrink-0" />
        ) : (
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-base flex-shrink-0",
            conversation.type === 'group'
              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
              : "bg-gradient-to-br from-primary to-primary/70"
          )}>
            {conversation.type === 'group' ? <Users className="h-5 w-5" /> : name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{name}</h3>
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <TranslationToggle
            value={targetLang}
            onChange={setTargetLang}
            translateOwn={translateOwn}
            onTranslateOwnChange={setTranslateOwn}
          />
          <button
            onClick={() => onCall?.('audio')}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            onClick={() => onCall?.('video')}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground hover:text-foreground"
          >
            <Video className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className={cn(
              "w-16 h-16 rounded-3xl flex items-center justify-center text-white text-2xl font-bold",
              conversation.type === 'group'
                ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                : "bg-gradient-to-br from-primary to-primary/70"
            )}>
              {conversation.type === 'group' ? <Users className="h-8 w-8" /> : name.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-sm">{name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {conversation.type === 'group'
                  ? `Groupe de ${conversation.members?.length ?? 0} participants`
                  : 'Commencez la conversation 👋'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isOwn = msg.sender_id === user?.id
              const prevMsg = messages[idx - 1]
              const showDateSep = !prevMsg || new Date(msg.created_at).toDateString() !== new Date(prevMsg.created_at).toDateString()

              return (
                <React.Fragment key={msg.id}>
                  {showDateSep && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[10px] text-muted-foreground px-2">
                        {new Date(msg.created_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    isOwn={isOwn}
                    onDelete={isOwn ? deleteMessage : undefined}
                    onReply={setReplyTo}
                    translationTarget={targetLang}
                    translateOwn={translateOwn}
                  />
                </React.Fragment>
              )
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <MessageInput
        onSend={sendMessage}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  )
}
