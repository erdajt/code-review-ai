'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Conversation, Message } from '@/types'
import { storage } from '@/lib/storage'
import { api } from '@/lib/api'
import { useAuth } from './AuthContext'

interface ChatContextValue {
  conversations: Conversation[]
  currentConversation: Conversation | null
  isLoading: boolean
  createNewChat: () => void
  selectConversation: (id: string) => void
  sendMessage: (content: string) => Promise<void>
  deleteConversation: (id: string) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      const stored = storage.getConversations()
      setConversations(stored)
      if (stored.length > 0 && !currentConversation) {
        setCurrentConversation(stored[0])
      }
    }
  }, [user, currentConversation])

  useEffect(() => {
    if (user) {
      storage.setConversations(conversations)
    }
  }, [conversations, user])

  const createNewChat = () => {
    const newConversation: Conversation = {
      id: '',
      messages: [],
      preview: 'New chat',
      updatedAt: new Date(),
    }
    setCurrentConversation(newConversation)
  }

  const selectConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id)
    if (conversation) {
      setCurrentConversation(conversation)
    }
  }

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) return

    setIsLoading(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    const updatedMessages = currentConversation
      ? [...currentConversation.messages, userMessage]
      : [userMessage]

    const tempConversation: Conversation = {
      id: currentConversation?.id || '',
      messages: updatedMessages,
      preview: content.slice(0, 50),
      updatedAt: new Date(),
    }

    setCurrentConversation(tempConversation)

    try {
      const response = await api.chat.sendMessage(
        user.token,
        content,
        currentConversation?.id || undefined
      )

      const assistantMessage: Message = {
        id: response.message_id,
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      }

      const finalMessages = [...updatedMessages, assistantMessage]
      const finalConversation: Conversation = {
        id: response.conversation_id,
        messages: finalMessages,
        preview: content.slice(0, 50),
        updatedAt: new Date(),
      }

      setCurrentConversation(finalConversation)

      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== response.conversation_id)
        return [finalConversation, ...filtered]
      })
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (currentConversation?.id === id) {
      setCurrentConversation(null)
    }
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        isLoading,
        createNewChat,
        selectConversation,
        sendMessage,
        deleteConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return context
}

