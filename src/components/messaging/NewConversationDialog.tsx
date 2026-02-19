import React, { useState, useEffect } from 'react'
import { X, Search, MessageCircle, Users, Check } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { useConversations } from '@/hooks/useMessaging'

interface Profile {
  user_id: string
  name: string | null
  display_name: string | null
  avatar_url: string | null
  username: string | null
}

interface Props {
  open: boolean
  onClose: () => void
  onCreate: (type: 'private' | 'group') => void
}

export function NewConversationDialog({ open, onClose, onCreate }: Props) {
  const { user } = useAuth()
  const { createPrivateConversation, createGroupConversation } = useConversations()
  const [mode, setMode] = useState<'choice' | 'private' | 'group'>('choice')
  const [search, setSearch] = useState('')
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selected, setSelected] = useState<Profile[]>([])
  const [groupName, setGroupName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) { setMode('choice'); setSearch(''); setSelected([]); setGroupName('') }
  }, [open])

  useEffect(() => {
    if (!search || search.length < 2) { setProfiles([]); return }
    const timeout = setTimeout(async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_id, name, display_name, avatar_url, username')
        .neq('user_id', user?.id ?? '')
        .or(`name.ilike.%${search}%,display_name.ilike.%${search}%,username.ilike.%${search}%`)
        .limit(10)
      setProfiles((data as Profile[]) ?? [])
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, user])

  const handleCreate = async () => {
    setLoading(true)
    try {
      if (mode === 'private' && selected.length === 1) {
        const id = await createPrivateConversation(selected[0].user_id)
        if (id) { onCreate('private'); onClose() }
      } else if (mode === 'group' && selected.length >= 1 && groupName.trim()) {
        const id = await createGroupConversation(groupName.trim(), selected.map(p => p.user_id))
        if (id) { onCreate('group'); onClose() }
      }
    } finally { setLoading(false) }
  }

  const toggle = (profile: Profile) => {
    setSelected(prev =>
      prev.find(p => p.user_id === profile.user_id)
        ? prev.filter(p => p.user_id !== profile.user_id)
        : mode === 'private' ? [profile] : [...prev, profile]
    )
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            {mode !== 'choice' && (
              <button onClick={() => setMode('choice')} className="p-1 hover:bg-muted rounded-lg transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
            <h3 className="font-bold text-base">
              {mode === 'choice' ? 'Nouvelle conversation' : mode === 'private' ? 'Message privé' : 'Créer un groupe'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Choice */}
        {mode === 'choice' && (
          <div className="p-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => setMode('private')}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold">Message privé</span>
            </button>
            <button
              onClick={() => setMode('group')}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold">Groupe</span>
            </button>
          </div>
        )}

        {/* Private / Group */}
        {(mode === 'private' || mode === 'group') && (
          <div className="flex flex-col max-h-[70vh]">
            {mode === 'group' && (
              <div className="px-5 pt-4 pb-2">
                <input
                  value={groupName}
                  onChange={e => setGroupName(e.target.value)}
                  placeholder="Nom du groupe..."
                  className="w-full px-4 py-2.5 text-sm bg-muted rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}

            <div className="px-5 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher un utilisateur..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-muted rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Selected chips */}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2 px-5 py-2">
                {selected.map(p => (
                  <div key={p.user_id} className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 rounded-full text-xs font-medium text-primary">
                    {p.display_name ?? p.name ?? p.username}
                    <button onClick={() => toggle(p)}><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-2 py-2 min-h-[200px]">
              {profiles.length === 0 && search.length >= 2 ? (
                <p className="text-center text-sm text-muted-foreground py-8">Aucun utilisateur trouvé</p>
              ) : search.length < 2 ? (
                <p className="text-center text-sm text-muted-foreground py-8">Tapez un nom pour rechercher</p>
              ) : (
                profiles.map(p => {
                  const isSelected = selected.some(s => s.user_id === p.user_id)
                  const displayName = p.display_name ?? p.name ?? p.username ?? 'Utilisateur'
                  return (
                    <button
                      key={p.user_id}
                      onClick={() => toggle(p)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
                        isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                      )}
                    >
                      {p.avatar_url ? (
                        <img src={p.avatar_url} alt={displayName} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium">{displayName}</p>
                        {p.username && <p className="text-xs text-muted-foreground">@{p.username}</p>}
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                    </button>
                  )
                })
              )}
            </div>

            <div className="p-5 border-t border-border">
              <button
                onClick={handleCreate}
                disabled={loading || selected.length === 0 || (mode === 'group' && !groupName.trim())}
                className="w-full py-3 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 hover:bg-primary/90 transition-colors"
              >
                {loading ? 'Création...' : mode === 'private' ? 'Démarrer la conversation' : 'Créer le groupe'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
