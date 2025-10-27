'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { useChat } from '@/contexts/ChatContext'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const { sendMessage, isLoading } = useChat()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
    }
  }

  const handleSubmit = async () => {
    if (!message.trim() || isLoading) return

    const messageToSend = message
    setMessage('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    await sendMessage(messageToSend)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="relative flex items-end gap-2 bg-gray-100 dark:bg-gray-800 rounded-3xl border border-gray-300 dark:border-gray-600 focus-within:border-gray-400 dark:focus-within:border-gray-500 transition">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition ml-2 mb-2"
            title="Upload file"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".js,.ts,.py,.java,.cpp,.go,.rs"
            />
          </button>

          <textarea
            ref={textareaRef}
            value={message}
            onChange={e => {
              setMessage(e.target.value)
              adjustTextareaHeight()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message Code Review AI..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none bg-transparent px-2 py-3 outline-none max-h-[200px] disabled:opacity-50"
          />
          
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className="flex-shrink-0 p-2 mr-2 mb-2 rounded-full bg-black dark:bg-white text-white dark:text-black disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-80 transition"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
          </button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
          Code Review AI can make mistakes. Check important info.
        </p>
      </div>
    </div>
  )
}
