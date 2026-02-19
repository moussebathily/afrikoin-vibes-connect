import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

export interface ConversationMember {
  id: string
  conversation_id: string
  user_id: string
  role: 'admin' | 'member'
  joined_at: string
  last_read_at: string | null
  is_muted: boolean
  profile?: {
    name: string | null
    display_name: string | null
    avatar_url: string | null
    username: string | null
  }
}

export interface Conversation {
  id: string
  type: 'private' | 'group'
  name: string | null
  description: string | null
  avatar_url: string | null
  created_by: string
  last_message: string | null
  last_message_at: string | null
  created_at: string
  updated_at: string
  members?: ConversationMember[]
  unread_count?: number
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string | null
  message_type: 'text' | 'image' | 'file' | 'audio' | 'video'
  file_url: string | null
  file_name: string | null
  file_size: number | null
  duration_sec: number | null
  reply_to_id: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
  sender_profile?: {
    name: string | null
    display_name: string | null
    avatar_url: string | null
  }
  reads?: { user_id: string; read_at: string }[]
  reply_to?: Message | null
}

export function useConversations() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchConversations = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const { data: memberRows, error: memberError } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user.id)

      if (memberError) throw memberError
      const convIds = memberRows?.map(r => r.conversation_id) ?? []
      if (convIds.length === 0) { setConversations([]); setLoading(false); return }

      const { data: convData, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', convIds)
        .order('updated_at', { ascending: false })

      if (convError) throw convError

      // fetch members + profiles per conversation
      const enriched: Conversation[] = await Promise.all(
        (convData ?? []).map(async (conv) => {
          const { data: members } = await supabase
            .from('conversation_members')
            .select('*')
            .eq('conversation_id', conv.id)

          const membersWithProfiles: ConversationMember[] = await Promise.all(
            (members ?? []).map(async (m) => {
              const { data: profile } = await supabase
                .from('profiles')
                .select('name, display_name, avatar_url, username')
                .eq('user_id', m.user_id)
                .single()
              return { ...m, profile: profile ?? undefined }
            })
          )

          // compute unread
          const myMembership = membersWithProfiles.find(m => m.user_id === user.id)
          let unread_count = 0
          if (myMembership) {
            const { count } = await supabase
              .from('messages')
              .select('id', { count: 'exact', head: true })
              .eq('conversation_id', conv.id)
              .neq('sender_id', user.id)
              .gt('created_at', myMembership.last_read_at ?? '1970-01-01')
            unread_count = count ?? 0
          }

          return { ...conv, members: membersWithProfiles, unread_count }
        })
      )
      setConversations(enriched)
    } catch (err) {
      console.error('fetchConversations error:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchConversations() }, [fetchConversations])

  // Realtime subscription
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('conversations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, fetchConversations)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, fetchConversations)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, fetchConversations])

  const createPrivateConversation = async (otherUserId: string): Promise<string | null> => {
    if (!user) return null
    try {
      // Check if already exists
      const { data: myConvs } = await supabase
        .from('conversation_members')
        .select('conversation_id')
        .eq('user_id', user.id)

      if (myConvs && myConvs.length > 0) {
        const { data: otherConvs } = await supabase
          .from('conversation_members')
          .select('conversation_id')
          .eq('user_id', otherUserId)
          .in('conversation_id', myConvs.map(c => c.conversation_id))

        if (otherConvs && otherConvs.length > 0) {
          // find private among these
          const { data: existing } = await supabase
            .from('conversations')
            .select('id')
            .eq('type', 'private')
            .in('id', otherConvs.map(c => c.conversation_id))
            .single()
          if (existing) return existing.id
        }
      }

      const { data: conv, error } = await supabase
        .from('conversations')
        .insert({ type: 'private', created_by: user.id })
        .select()
        .single()
      if (error) throw error

      await supabase.from('conversation_members').insert([
        { conversation_id: conv.id, user_id: user.id, role: 'admin' },
        { conversation_id: conv.id, user_id: otherUserId, role: 'member' },
      ])
      await fetchConversations()
      return conv.id
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de créer la conversation', variant: 'destructive' })
      return null
    }
  }

  const createGroupConversation = async (name: string, memberIds: string[]): Promise<string | null> => {
    if (!user) return null
    try {
      const { data: conv, error } = await supabase
        .from('conversations')
        .insert({ type: 'group', name, created_by: user.id })
        .select()
        .single()
      if (error) throw error

      const membersToInsert = [
        { conversation_id: conv.id, user_id: user.id, role: 'admin' as const },
        ...memberIds.map(uid => ({ conversation_id: conv.id, user_id: uid, role: 'member' as const }))
      ]
      await supabase.from('conversation_members').insert(membersToInsert)
      await fetchConversations()
      return conv.id
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible de créer le groupe', variant: 'destructive' })
      return null
    }
  }

  return { conversations, loading, fetchConversations, createPrivateConversation, createGroupConversation }
}

export function useMessages(conversationId: string | null) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchMessages = useCallback(async () => {
    if (!conversationId || !user) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100)
      if (error) throw error

      const enriched: Message[] = await Promise.all(
        (data ?? []).map(async (msg) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, display_name, avatar_url')
            .eq('user_id', msg.sender_id)
            .single()

          const { data: reads } = await supabase
            .from('message_reads')
            .select('user_id, read_at')
            .eq('message_id', msg.id)

          let reply_to: Message | null = null
          if (msg.reply_to_id) {
            const { data: replyData } = await supabase
              .from('messages')
              .select('*')
              .eq('id', msg.reply_to_id)
              .single()
            reply_to = replyData as Message | null
          }

          return {
            ...msg,
            sender_profile: profile ?? undefined,
            reads: reads ?? [],
            reply_to,
          }
        })
      )
      setMessages(enriched)

      // Mark as read
      await supabase
        .from('conversation_members')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)

      // Insert reads for unread messages
      const unread = (data ?? []).filter(m => m.sender_id !== user.id)
      if (unread.length > 0) {
        const readInserts = unread.map(m => ({ message_id: m.id, user_id: user.id }))
        await supabase.from('message_reads').upsert(readInserts, { onConflict: 'message_id,user_id' })
      }
    } catch (err) {
      console.error('fetchMessages error:', err)
    } finally {
      setLoading(false)
    }
  }, [conversationId, user])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  // Realtime
  useEffect(() => {
    if (!conversationId) return
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, async (payload) => {
        const msg = payload.new as Message
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, display_name, avatar_url')
          .eq('user_id', msg.sender_id)
          .single()

        // Mark as read if not sender
        if (msg.sender_id !== user?.id) {
          await supabase.from('message_reads').upsert(
            [{ message_id: msg.id, user_id: user?.id }],
            { onConflict: 'message_id,user_id' }
          )
          await supabase
            .from('conversation_members')
            .update({ last_read_at: new Date().toISOString() })
            .eq('conversation_id', conversationId)
            .eq('user_id', user?.id ?? '')
        }

        setMessages(prev => [...prev, { ...msg, sender_profile: profile ?? undefined, reads: [], reply_to: null }])
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m))
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversationId, user])

  const sendMessage = async (params: {
    content?: string
    message_type?: Message['message_type']
    file_url?: string
    file_name?: string
    file_size?: number
    duration_sec?: number
    reply_to_id?: string
  }) => {
    if (!conversationId || !user) return
    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content: params.content ?? null,
        message_type: params.message_type ?? 'text',
        file_url: params.file_url ?? null,
        file_name: params.file_name ?? null,
        file_size: params.file_size ?? null,
        duration_sec: params.duration_sec ?? null,
        reply_to_id: params.reply_to_id ?? null,
      })
      if (error) throw error
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible d\'envoyer le message', variant: 'destructive' })
    }
  }

  const deleteMessage = async (messageId: string) => {
    await supabase.from('messages').update({ is_deleted: true, content: null }).eq('id', messageId)
  }

  return { messages, loading, sendMessage, deleteMessage, refetch: fetchMessages }
}
