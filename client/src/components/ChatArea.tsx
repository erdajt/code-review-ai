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
      scrollToBottom('smooth')
    }
  }, [currentConversation?.messages])

  const hasMessages = (currentConversation?.messages?.length ?? 0) > 0

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">
            {currentConversation?.title || 'Code Review AI'}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
      >
        {!hasMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-2xl mx-auto p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-3xl font-semibold mb-4">What can I help you review today?</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Share your code and get expert feedback instantly
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
                  <h3 className="font-medium mb-1">Review my code</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get feedback on quality and best practices</p>
                </button>
                <button className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
                  <h3 className="font-medium mb-1">Find bugs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Identify potential issues early</p>
                </button>
                <button className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
                  <h3 className="font-medium mb-1">Improve performance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get optimization suggestions</p>
                </button>
                <button className="p-4 text-left rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition">
                  <h3 className="font-medium mb-1">Explain code</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Understand complex patterns</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8">
            {currentConversation?.messages.map((message, index) => (
              <div key={`${message.id}-${index}`} className="mb-6">
                <MessageBubble message={message} />
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 max-w-3xl">
                  <div className="flex items-center gap-2">
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
