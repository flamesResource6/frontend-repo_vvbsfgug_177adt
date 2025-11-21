import { useEffect, useState } from 'react'

export default function UPICheckout({ amountPaise = 49900, label = 'Buy Now' }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [message, setMessage] = useState('')

  const API_BASE = import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL.replace(/\/$/, '') : ''

  const loadScript = (src) => new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve(true)
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

  const startPayment = async () => {
    setLoading(true)
    setStatus(null)
    setMessage('')
    try {
      if (!API_BASE) throw new Error('Backend URL not configured')

      const orderRes = await fetch(`${API_BASE}/payments/upi/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_inr: amountPaise, receipt: `rcpt_${Date.now()}` })
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        const detail = typeof orderData.detail === 'string' ? orderData.detail : JSON.stringify(orderData.detail)
        throw new Error(detail || 'Could not create order')
      }

      const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js')
      if (!ok) throw new Error('Failed to load Razorpay')

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Flames Store',
        description: 'Digital product purchase',
        order_id: orderData.order_id,
        theme: { color: '#EF4444' },
        method: { upi: true, card: false, netbanking: false, wallet: false, emi: false },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE}/payments/razorpay/verify-signature`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              })
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok || !verifyData.valid) {
              throw new Error('Payment verification failed')
            }
            setStatus('success')
            setMessage('Payment successful! Your download will be sent to your email.')
          } catch (err) {
            setStatus('error')
            setMessage(err.message || 'Payment verification failed')
          }
        },
        modal: {
          ondismiss: function () {
            if (!status) {
              setStatus('error')
              setMessage('Payment canceled')
            }
          }
        },
        prefill: {},
        notes: {}
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-neutral-300 text-sm">One-time purchase</p>
          <p className="text-white text-2xl font-bold mt-1">₹{(amountPaise/100).toFixed(0)}</p>
        </div>
        <button
          onClick={startPayment}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-5 py-3 font-medium shadow-[0_10px_30px_-10px_rgba(239,68,68,0.8)] hover:bg-red-500 transition disabled:opacity-70"
        >
          {loading ? 'Processing…' : label}
        </button>
      </div>
      {status && (
        <div className={'mt-4 text-sm ' + (status === 'success' ? 'text-green-400' : 'text-red-400')}>
          {message}
        </div>
      )}
    </div>
  )
}
