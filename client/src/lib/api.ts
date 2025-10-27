const API_BASE = 'http://localhost:8080/api/v1'

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(response.status, data.error || 'Request failed')
  }

  return data
}

export const api = {
  auth: {
    register: (username: string, password: string) =>
      fetchApi<{ token: string; user_id: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),

    login: (username: string, password: string) =>
      fetchApi<{ token: string; user_id: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
  },

  chat: {
    sendMessage: (token: string, message: string, conversationId?: string) =>
      fetchApi<{ conversation_id: string; message_id: string; reply: string; title: string }>(
        '/chat',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            message,
            conversation_id: conversationId,
          }),
        }
      ),

    getConversations: (token: string) =>
      fetchApi<Array<{ conversation_id: string; user_id: string; title: string; started_at: string }>>(
        '/conversations',
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      ),

    getMessages: (token: string, conversationId: string) =>
      fetchApi<Array<{ message_id: string; conversation_id: string; sender: string; content: string; sent_at: string }>>(
        '/messages',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ conversation_id: conversationId }),
        }
      ),
  },
}

