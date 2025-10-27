'use client'

import NewSidebar from './NewSidebar'
import ChatArea from './ChatArea'

export default function ChatInterface() {
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NewSidebar />
      <ChatArea />
    </div>
  )
}
