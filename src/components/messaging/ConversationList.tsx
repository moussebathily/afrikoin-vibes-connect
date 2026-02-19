import React, { useState } from 'react'
import { Search, Plus, Users, MessageCircle, Lock } from 'lucide-react'
import { format, isToday, isYesterday } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { Conversation } from '@/hooks/useMessaging'
import { useAuth } from '@/contexts/AuthContext'
import { NewConversationDialog } from './NewConversationDialog'

interface Props {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (id: string) => void
  loading: boolean
  onCreate: (type: 'private' | 'group') => void
}

function formatTime(date: string | null): string {
  if (!date) return ''
  const d = new Date(date)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return 'Hier'
  return format(d, 'dd/MM', { locale: fr })
}

function getConvName(conv: Conversation, currentUserId: string): string {
  if (conv.type === 'group') return conv.name ?? 'Groupe'
  const other = conv.members?.find(m => m.user_id !== currentUserId)
  if (!other?.profile) return 'Conversation'
  return other.profile.display_name ?? other.profile.name ?? other.profile.username ?? 'Utilisateur'
}

function getConvAvatar(conv: Conversation, currentUserId: string): string | null {
  if (conv.type === 'group') return conv.avatar_url
  const other = conv.members?.find(m => m.user_id !== currentUserId)
  return other?.profile?.avatar_url ?? null
}

export function ConversationList({ conversations, selectedId, onSelect, loading, onCreate }: Props) {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)

  const filtered = conversations.filter(c => {
    const name = getConvName(c, user?.id ?? '')
    return name.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="flex flex-col h-full border-r border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg text-foreground">Messages</h2>
          <button
            onClick={() => setShowNew(true)}
            className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/30 transition-all text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              {search ? 'Aucune conversation trouvée' : 'Commencez une nouvelle conversation'}
            </p>
            {!search && (
              <button
                onClick={() => setShowNew(true)}
                className="text-sm text-primary font-medium hover:underline"
              >
                Nouvelle conversation
              </button>
            )}
          </div>
        ) : (
          <div className="py-2">
            {filtered.map(conv => {
              const name = getConvName(conv, user?.id ?? '')
              const avatar = getConvAvatar(conv, user?.id ?? '')
              const isSelected = conv.id === selectedId
              const hasUnread = (conv.unread_count ?? 0) > 0

              return (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 transition-colors text-left',
                    isSelected ? 'bg-primary/10' : 'hover:bg-muted/50'
                  )}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    {avatar ? (
                      <img src={avatar} alt={name} className="w-12 h-12 rounded-2xl object-cover" />
                    ) : (
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg",
                        conv.type === 'group' ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-primary to-primary/70'
                      )}>
                        {conv.type === 'group' ? (
                          <Users className="h-6 w-6" />
                        ) : (
                          name.charAt(0).toUpperCase()
                        )}
                      </div>
                    )}
                    {conv.type === 'private' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-card" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={cn("font-medium text-sm truncate", hasUnread && "text-foreground font-semibold")}>
                        {name}
                      </span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className={cn(
                        "text-xs truncate",
                        hasUnread ? "text-foreground font-medium" : "text-muted-foreground"
                      )}>
                        {conv.last_message ?? 'Nouvelle conversation'}
                      </p>
                      {hasUnread && (
                        <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 bg-primary rounded-full text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <NewConversationDialog
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreate={onCreate}
      />
    </div>
  )
}
