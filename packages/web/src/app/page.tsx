```tsx
'use client'
import { useState } from 'react'

export default function Home() {
  const [messages, setMessages] = useState<Array<{role: string; content: string}>>([])
  const [input, setInput] = useState('')

  const send = async () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: input }])
    try {
      const res = await fetch('http://localhost:3001/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, projectId: 'default', history: [] })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error contacting server' }])
    }
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded ${m.role === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-700'} max-w-[80%]`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          className="flex-1 p-2 bg-gray-800 rounded"
          placeholder="Ask MEO AI..."
        />
        <button onClick={send} className="px-4 py-2 bg-blue-600 rounded">Send</button>
      </div>
    </div>
  )
}
```

---