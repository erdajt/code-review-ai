'use client'

import { useState } from 'react'
import { useChat } from '@/contexts/ChatContext'
import { useAuth } from '@/contexts/AuthContext'

export default function NewSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [showGPTs, setShowGPTs] = useState(true)
  const { user, logout } = useAuth()
  const {
    conversations,
    folders,
    currentConversation,
    createNewChat,
    selectConversation,
    deleteConversation,
    createFolder,
    deleteFolder,
    moveToFolder,
  } = useChat()

  const [newFolderName, setNewFolderName] = useState('')
  const [creatingFolder, setCreatingFolder] = useState(false)
  const [draggedConv, setDraggedConv] = useState<string | null>(null)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName)
      setNewFolderName('')
      setCreatingFolder(false)
    }
  }

  const gpts = [
    { name: 'Code Reviewer', icon: '🔍', description: 'Review code quality' },
    { name: 'Code Generator', icon: '⚡', description: 'Generate code snippets' },
    { name: 'DevOps Expert', icon: '🚀', description: 'DevOps best practices' },
  ]

  const unfoldered = conversations.filter(c => !c.folderId)

  return (
    <>
      <div
        className={`${
          isOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 bg-gray-950 text-gray-100 flex flex-col h-screen overflow-hidden`}
      >
        {isOpen && (
          <div className="flex flex-col h-full">
            <div className="p-3 border-b border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-900 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={createNewChat}
                  className="p-2 hover:bg-gray-900 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              <div className="space-y-1 text-sm">
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search Chats</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Library</span>
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 rounded-lg transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  <span>Codex</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-3">
                <button
                  onClick={() => setShowGPTs(!showGPTs)}
                  className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-900 rounded-lg text-sm transition"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    GPTs
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showGPTs ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showGPTs && (
                  <div className="mt-2 space-y-1">
                    {gpts.map((gpt) => (
                      <button
                        key={gpt.name}
                        className="w-full px-3 py-2 hover:bg-gray-900 rounded-lg text-left transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{gpt.icon}</span>
                          <div>
                            <div className="text-sm font-medium">{gpt.name}</div>
                            <div className="text-xs text-gray-500">{gpt.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Chats</span>
                  <button
                    onClick={() => setCreatingFolder(true)}
                    className="p-1 hover:bg-gray-900 rounded transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                {creatingFolder && (
                  <div className="mb-2">
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                      onBlur={() => setCreatingFolder(false)}
                      placeholder="Folder name"
                      className="w-full px-3 py-2 bg-gray-900 rounded-lg text-sm outline-none"
                      autoFocus
                    />
                  </div>
                )}

                {folders.map((folder) => {
                  const folderConvs = conversations.filter(c => c.folderId === folder.id)
                  return (
                    <div key={folder.id} className="mb-2">
                      <div
                        className="flex items-center justify-between px-3 py-2 hover:bg-gray-900 rounded-lg cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => {
                          if (draggedConv) {
                            moveToFolder(draggedConv, folder.id)
                            setDraggedConv(null)
                          }
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <span className="text-sm">{folder.name}</span>
                          <span className="text-xs text-gray-500">({folderConvs.length})</span>
                        </div>
                        <button
                          onClick={() => deleteFolder(folder.id)}
                          className="p-1 hover:bg-gray-800 rounded transition"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="ml-4 space-y-1">
                        {folderConvs.map((conv) => (
                          <div
                            key={conv.id}
                            draggable
                            onDragStart={() => setDraggedConv(conv.id)}
                            onClick={() => selectConversation(conv.id)}
                            className={`group relative px-3 py-2 rounded-lg cursor-pointer transition ${
                              currentConversation?.id === conv.id ? 'bg-gray-800' : 'hover:bg-gray-900'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm truncate flex-1">{conv.title}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteConversation(conv.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition"
                              >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}

                <div
                  className="space-y-1"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedConv) {
                      moveToFolder(draggedConv, undefined)
                      setDraggedConv(null)
                    }
                  }}
                >
                  {unfoldered.map((conv) => (
                    <div
                      key={conv.id}
                      draggable
                      onDragStart={() => setDraggedConv(conv.id)}
                      onClick={() => selectConversation(conv.id)}
                      className={`group relative px-3 py-2 rounded-lg cursor-pointer transition ${
                        currentConversation?.id === conv.id ? 'bg-gray-800' : 'hover:bg-gray-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <span className="text-sm truncate">{conv.title}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteConversation(conv.id)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-900 rounded-lg transition flex-1">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-semibold">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm truncate">{user?.username || 'User'}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-900 rounded-lg transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shadow-lg z-50 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </>
  )
}

