'use client'

import { useEffect, useRef } from 'react'
import { useChat } from '@/contexts/ChatContext'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'

export default function ChatArea() {
  const { currentConversation, isLoading } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior })
    }
  }

  useEffect(() => {
    if (currentConversation?.messages.length) {
      const lastMessage = currentConversation.messages[currentConversation.messages.length - 1]
      if (lastMessage.role === 'user') {
        scrollToBottom('smooth')
      } else {
        scrollToBottom('smooth')
      }
    }
  }, [currentConversation?.messages])

  const hasMessages = (currentConversation?.messages?.length ?? 0) > 0

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {!hasMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl mx-auto p-8">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold mb-4">Code Review AI</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Get instant feedback on your code with AI-powered reviews
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-2">Code Quality</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Identify issues and improve code structure
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-2">Best Practices</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Follow industry standards and conventions
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-2">Bug Detection</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Find potential bugs before they reach production
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-semibold mb-2">Security Review</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Identify security vulnerabilities early
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="pb-32">
            {currentConversation?.messages.map((message, index) => (
              <MessageBubble
                key={`${message.id}-${index}`}
                message={message}
              />
            ))}
            {isLoading && (
              <div className="w-full bg-gray-50 dark:bg-gray-800/50 py-8">
                <div className="max-w-3xl mx-auto px-4 flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-sm flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                    AI
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput />
    </div>
  )
}
