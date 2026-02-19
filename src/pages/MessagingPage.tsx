import React, { useState } from 'react'
import { useConversations, Conversation } from '@/hooks/useMessaging'
import { ConversationList } from '@/components/messaging/ConversationList'
import { ConversationView } from '@/components/messaging/ConversationView'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { cn } from '@/lib/utils'

export default function MessagingPage() {
  const navigate = useNavigate()
  const { conversations, loading, fetchConversations, createPrivateConversation, createGroupConversation } = useConversations()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selectedConv = conversations.find(c => c.id === selectedId) ?? null
  const isMobileShowConv = !!selectedId

  const handleCall = (type: 'audio' | 'video') => {
    navigate(ROUTES.CALL)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "flex-shrink-0 w-full md:w-80 lg:w-96",
        isMobileShowConv ? "hidden md:flex" : "flex"
      )}>
        <div className="w-full">
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
            loading={loading}
            onCreate={(type) => {
              // refresh handled inside hooks
            }}
          />
        </div>
      </div>

      {/* Conversation */}
      <div className={cn(
        "flex-1 min-w-0",
        !isMobileShowConv ? "hidden md:flex md:flex-col" : "flex flex-col"
      )}>
        {selectedConv ? (
          <ConversationView
            conversation={selectedConv}
            onBack={() => setSelectedId(null)}
            onCall={handleCall}
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full gap-4 bg-muted/20">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">Messagerie AfriKoin</h3>
              <p className="text-sm text-muted-foreground mt-1">Sélectionnez une conversation ou créez-en une nouvelle</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
