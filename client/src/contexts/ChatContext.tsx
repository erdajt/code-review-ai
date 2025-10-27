'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Conversation, Message, Folder } from '@/types'
import { storage } from '@/lib/storage'
import { api } from '@/lib/api'
import { useAuth } from './AuthContext'

interface ChatContextValue {
  conversations: Conversation[]
  folders: Folder[]
  currentConversation: Conversation | null
  isLoading: boolean
  createNewChat: () => void
  selectConversation: (id: string) => void
  sendMessage: (content: string) => Promise<void>
  deleteConversation: (id: string) => void
  createFolder: (name: string) => void
  deleteFolder: (id: string) => void
  moveToFolder: (conversationId: string, folderId: string | undefined) => void
  renameFolder: (id: string, newName: string) => void
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      const stored = storage.getConversations()
      setConversations(stored)
      const storedFolders = storage.getFolders()
      setFolders(storedFolders)
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

  useEffect(() => {
    if (user) {
      storage.setFolders(folders)
    }
  }, [folders, user])

  const createNewChat = () => {
    const newConversation: Conversation = {
      id: '',
      messages: [],
      title: 'New chat',
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
      title: currentConversation?.title || 'New chat',
      updatedAt: new Date(),
      folderId: currentConversation?.folderId,
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
        title: response.title,
        updatedAt: new Date(),
        folderId: currentConversation?.folderId,
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

  const createFolder = (name: string) => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date(),
    }
    setFolders(prev => [...prev, newFolder])
  }

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id))
    setConversations(prev => prev.map(c => c.folderId === id ? { ...c, folderId: undefined } : c))
  }

  const moveToFolder = (conversationId: string, folderId: string | undefined) => {
    setConversations(prev =>
      prev.map(c => c.id === conversationId ? { ...c, folderId } : c)
    )
  }

  const renameFolder = (id: string, newName: string) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f))
  }

  return (
    <ChatContext.Provider
      value={{
        conversations,
        folders,
        currentConversation,
        isLoading,
        createNewChat,
        selectConversation,
        sendMessage,
        deleteConversation,
        createFolder,
        deleteFolder,
        moveToFolder,
        renameFolder,
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
