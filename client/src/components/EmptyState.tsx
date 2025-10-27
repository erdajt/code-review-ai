'use client'

export default function EmptyState() {
  const suggestions = [
    {
      title: 'Review my Python code',
      description: 'Get feedback on code quality and best practices',
    },
    {
      title: 'Find bugs in my code',
      description: 'Identify potential issues and security vulnerabilities',
    },
    {
      title: 'Improve code performance',
      description: 'Get suggestions for optimization',
    },
    {
      title: 'Explain this code',
      description: 'Understand complex code patterns',
    },
  ]

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold mb-6">
            AI
          </div>
          <h1 className="text-4xl font-semibold mb-4">Code Review AI</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            How can I help you review your code today?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 cursor-pointer transition bg-white dark:bg-gray-800/50"
            >
              <h3 className="font-medium mb-1">{suggestion.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {suggestion.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

