'use client'

import ReactMarkdown from 'react-markdown'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import remarkGfm from 'remark-gfm'
import { Message } from '@/types'

import javascript from 'react-syntax-highlighter/dist/cjs/languages/hljs/javascript'
import typescript from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript'
import python from 'react-syntax-highlighter/dist/cjs/languages/hljs/python'
import java from 'react-syntax-highlighter/dist/cjs/languages/hljs/java'
import cpp from 'react-syntax-highlighter/dist/cjs/languages/hljs/cpp'
import go from 'react-syntax-highlighter/dist/cjs/languages/hljs/go'
import rust from 'react-syntax-highlighter/dist/cjs/languages/hljs/rust'
import bash from 'react-syntax-highlighter/dist/cjs/languages/hljs/bash'
import json from 'react-syntax-highlighter/dist/cjs/languages/hljs/json'
import xml from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml'
import css from 'react-syntax-highlighter/dist/cjs/languages/hljs/css'
import sql from 'react-syntax-highlighter/dist/cjs/languages/hljs/sql'

SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('typescript', typescript)
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('java', java)
SyntaxHighlighter.registerLanguage('cpp', cpp)
SyntaxHighlighter.registerLanguage('go', go)
SyntaxHighlighter.registerLanguage('rust', rust)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('xml', xml)
SyntaxHighlighter.registerLanguage('css', css)
SyntaxHighlighter.registerLanguage('sql', sql)

interface MessageBubbleProps {
  message: Message
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`w-full py-6 px-4 ${
        isUser ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-6">
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser
                ? 'bg-blue-600 text-white'
                : 'bg-green-600 text-white'
            }`}
          >
            {isUser ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code(props) {
                  const { inline, className, children, ...rest } = props as {
                    inline?: boolean
                    className?: string
                    children?: React.ReactNode
                  }
                  const match = /language-(\w+)/.exec(className || '')
                  const language = match ? match[1] : ''

                  return !inline && language ? (
                    <div className="relative">
                      <div className="absolute right-2 top-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {language}
                      </div>
                      <SyntaxHighlighter
                        style={atomOneDark}
                        language={language}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                        }}
                        {...rest}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code
                      className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-sm font-mono"
                      {...rest}
                    >
                      {children}
                    </code>
                  )
                },
                p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6">{children}</h1>,
                h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5">{children}</h2>,
                h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4">{children}</h3>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4">
                    {children}
                  </blockquote>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
