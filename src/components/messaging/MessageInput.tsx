import React, { useState, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Send, Paperclip, Mic, StopCircle, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Message } from '@/hooks/useMessaging'
import { cn } from '@/lib/utils'

interface Props {
  onSend: (params: {
    content?: string
    message_type?: Message['message_type']
    file_url?: string
    file_name?: string
    file_size?: number
    duration_sec?: number
    reply_to_id?: string
  }) => Promise<void>
  replyTo?: Message | null
  onCancelReply?: () => void
  disabled?: boolean
}

export function MessageInput({ onSend, replyTo, onCancelReply, disabled }: Props) {
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [recordDuration, setRecordDuration] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = async () => {
    if (!text.trim() || disabled) return
    const content = text.trim()
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    await onSend({ content, message_type: 'text', reply_to_id: replyTo?.id })
    onCancelReply?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const uploadFile = async (file: File): Promise<{ url: string; type: Message['message_type'] } | null> => {
    if (!user) return null
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('message-files').upload(path, file)
    if (error) { console.error(error); return null }
    const { data: { publicUrl } } = supabase.storage.from('message-files').getPublicUrl(data.path)

    let type: Message['message_type'] = 'file'
    if (file.type.startsWith('image/')) type = 'image'
    else if (file.type.startsWith('video/')) type = 'video'
    else if (file.type.startsWith('audio/')) type = 'audio'

    return { url: publicUrl, type }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const result = await uploadFile(file)
    if (result) {
      await onSend({
        message_type: result.type,
        file_url: result.url,
        file_name: file.name,
        file_size: file.size,
        reply_to_id: replyTo?.id
      })
      onCancelReply?.()
    }
    setUploading(false)
    e.target.value = ''
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []
      setRecordDuration(0)

      mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunksRef.current.push(e.data) }
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const voiceFileName = `voice-${Date.now()}.webm`
        // Upload blob directly
        if (!user) return
        const path = `${user.id}/${voiceFileName}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('message-files')
          .upload(path, audioBlob, { contentType: 'audio/webm' })
        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage.from('message-files').getPublicUrl(uploadData.path)
          await onSend({
            message_type: 'audio',
            file_url: publicUrl,
            file_name: voiceFileName,
            file_size: audioBlob.size,
            duration_sec: recordDuration,
          })
        }
        setUploading(false)
        if (recordTimerRef.current) clearInterval(recordTimerRef.current)
      }

      mediaRecorder.start()
      setRecording(true)
      recordTimerRef.current = setInterval(() => setRecordDuration(d => d + 1), 1000)
    } catch (err) {
      console.error('Microphone error:', err)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
    if (recordTimerRef.current) clearInterval(recordTimerRef.current)
  }

  const formatDuration = (sec: number) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

  return (
    <div className="border-t border-border bg-card">
      {/* Reply preview */}
      {replyTo && (
        <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 border-b border-border">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-primary font-semibold">Réponse</p>
            <p className="text-xs text-muted-foreground truncate">{replyTo.content ?? '📎 Fichier'}</p>
          </div>
          <button onClick={onCancelReply} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Recording UI */}
      {recording && (
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">{formatDuration(recordDuration)}</span>
          <span className="text-xs text-muted-foreground flex-1">Enregistrement en cours...</span>
          <button onClick={stopRecording} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive text-destructive-foreground text-xs font-medium">
            <StopCircle className="h-3.5 w-3.5" />
            Envoyer
          </button>
        </div>
      )}

      {/* Input */}
      {!recording && (
        <div className="flex items-end gap-2 p-3">
          {/* Attach */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || disabled}
            className="flex-shrink-0 w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors disabled:opacity-50"
          >
            <Paperclip className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => {
              setText(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={handleKeyDown}
            placeholder="Écrivez un message..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-muted rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground border-0 outline-none focus:ring-2 focus:ring-primary/30 max-h-[120px] overflow-y-auto leading-relaxed"
          />

          {/* Voice or Send */}
          {text.trim() ? (
            <button
              onClick={handleSend}
              disabled={disabled || uploading}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={startRecording}
              disabled={disabled || uploading}
              className="flex-shrink-0 w-9 h-9 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors disabled:opacity-50"
            >
              <Mic className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
