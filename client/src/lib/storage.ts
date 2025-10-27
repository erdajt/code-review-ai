import { Conversation, Folder } from '@/types'

const STORAGE_KEYS = {
  USER: 'user',
  CONVERSATIONS: 'conversations',
  FOLDERS: 'folders',
} as const

export const storage = {
  getUser: () => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(STORAGE_KEYS.USER)
    return data ? JSON.parse(data) : null
  },

  setUser: (user: { userId: string; token: string; username: string } | null) => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER)
    }
  },

  getConversations: (): Conversation[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)
    return data ? JSON.parse(data) : []
  },

  setConversations: (conversations: Conversation[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations))
  },

  getFolders: (): Folder[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.FOLDERS)
    return data ? JSON.parse(data) : []
  },

  setFolders: (folders: Folder[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders))
  },
}

