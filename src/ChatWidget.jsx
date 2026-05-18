import { useEffect, useRef, useState } from 'react'
import './ChatWidget.css'

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

const BOT = 'Mallikarjuna'
const STEPS = ['greet', 'name', 'email', 'message', 'sending', 'done', 'error']

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('greet')
  const [input, setInput] = useState('')
  const [data, setData] = useState({ name: '', email: '', message: '' })
  const [messages, setMessages] = useState([
    { from: 'bot', text: `Hi 👋 I'm ${BOT}'s assistant. Got a question or want to connect?` },
    { from: 'bot', text: 'What should I call you?' },
  ])
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open, step])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  function push(from, text) {
    setMessages((m) => [...m, { from, text }])
  }

  function isValidEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim())
  }

  async function sendToOwner(payload) {
    if (!WEB3FORMS_KEY) {
      throw new Error('Chat is not configured yet (missing access key).')
    }
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: `Portfolio chat from ${payload.name}`,
        from_name: payload.name,
        email: payload.email,
        message: payload.message,
      }),
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to send')
  }

  async function handleSubmit(e) {
    e?.preventDefault()
    const value = input.trim()
    if (!value || step === 'sending') return

    push('user', value)
    setInput('')

    if (step === 'greet' || step === 'name') {
      setData((d) => ({ ...d, name: value }))
      push('bot', `Nice to meet you, ${value.split(' ')[0]}. What's your email so I can reply?`)
      setStep('email')
      return
    }

    if (step === 'email') {
      if (!isValidEmail(value)) {
        push('bot', "That doesn't look like a valid email. Try again?")
        return
      }
      setData((d) => ({ ...d, email: value }))
      push('bot', 'Great. What would you like to ask or share?')
      setStep('message')
      return
    }

    if (step === 'message') {
      const payload = { ...data, message: value }
      setData(payload)
      setStep('sending')
      push('bot', 'Sending…')
      try {
        await sendToOwner(payload)
        push('bot', "Got it — I'll get back to you soon. Thanks for reaching out!")
        setStep('done')
      } catch (err) {
        push('bot', `Hmm, I couldn't send that (${err.message}). You can email me directly at mallikarjunabankoli@gmail.com.`)
        setStep('error')
      }
      return
    }

    if (step === 'done' || step === 'error') {
      push('bot', "Want to send another message? I'll pass it along.")
      setData((d) => ({ ...d, message: '' }))
      setStep('message')
    }
  }

  const placeholder = {
    greet: 'Type your name…',
    name: 'Type your name…',
    email: 'you@example.com',
    message: 'Type your message…',
    sending: 'Sending…',
    done: 'Type another message…',
    error: 'Type another message…',
  }[step]

  return (
    <>
      <button
        className={`chat-fab ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label="Chat">
          <div className="chat-header">
            <div className="chat-avatar">M</div>
            <div>
              <div className="chat-title">Chat with {BOT}</div>
              <div className="chat-sub">Typically replies within a day</div>
            </div>
          </div>

          <div className="chat-body" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.from}`}>{m.text}</div>
            ))}
          </div>

          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type={step === 'email' ? 'email' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={placeholder}
              disabled={step === 'sending'}
            />
            <button type="submit" disabled={step === 'sending' || !input.trim()}>Send</button>
          </form>
        </div>
      )}
    </>
  )
}
