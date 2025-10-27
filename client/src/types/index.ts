export interface User {
  userId: string
  token: string
  username: string
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
  title: string
  updatedAt: Date
  folderId?: string
}

export interface Folder {
  id: string
  name: string
  createdAt: Date
}

export interface AuthResponse {
  token: string
  user_id: string
}

export interface ChatResponse {
  conversation_id: string
  message_id: string
  reply: string
  title: string
}

