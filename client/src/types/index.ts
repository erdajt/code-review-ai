export interface User {
  userId: string
  token: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  messages: Message[]
  preview: string
  updatedAt: Date
}

export interface AuthResponse {
  token: string
  user_id: string
}

export interface ChatResponse {
  conversation_id: string
  message_id: string
  reply: string
}

