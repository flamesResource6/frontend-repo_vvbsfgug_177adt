import { useState } from 'react'

export default function Newsletter({ variant = 'dark' }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [message, setMessage] = useState('')

  const API_BASE = import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '') : ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setStatus(null)
    setMessage('')
    try {
      const res = await fetch(`${API_BASE}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'pdp-newsletter' })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Subscription failed' }))
        throw new Error(typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail))
      }
      setStatus('success')
      setMessage('You\'re in! Check your inbox for a welcome email.')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={
      variant === 'dark'
        ? 'bg-neutral-900/80 border border-red-500/20 rounded-2xl p-6 md:p-8 shadow-lg'
        : 'bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-lg'
    }>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className={
            variant === 'dark' ? 'text-white text-xl font-semibold' : 'text-neutral-900 text-xl font-semibold'
          }>Get product drops and tips</h3>
          <p className={
            variant === 'dark' ? 'text-neutral-300 text-sm' : 'text-neutral-600 text-sm'
          }>No spam. Unsubscribe anytime.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full md:w-auto flex gap-2">
          <input
            type="email"
            required
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={
              variant === 'dark'
                ? 'w-full md:w-72 bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500'
                : 'w-full md:w-72 bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500'
            }
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-red-600 text-white px-5 py-3 font-medium shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Subscribing…' : 'Subscribe'}
          </button>
        </form>
      </div>
      {status && (
        <div className={
          'mt-4 text-sm ' + (status === 'success' ? 'text-green-400' : 'text-red-400')
        }>
          {message}
        </div>
      )}
    </div>
  )
}
