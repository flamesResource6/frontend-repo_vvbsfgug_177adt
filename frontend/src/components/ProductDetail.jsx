import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function ProductDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${slug}`)
        if (!res.ok) throw new Error('Not found')
        const data = await res.json()
        setItem(data.product)
      } catch (e) {
        setError('Product not found')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  const buy = async () => {
    const body = { product_id: item._id || item.slug, email: 'demo@buyer.com', amount: item.price }
    const res = await fetch(`${API_BASE}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    alert(`Order confirmed! Download link: ${data?.order?.download_url || 'N/A'}`)
  }

  if (loading) return <div className="min-h-[50vh] grid place-items-center">Loading…</div>
  if (error) return <div className="min-h-[50vh] grid place-items-center text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-gray-100">
              {item.cover_url ? (
                <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-500">No Cover</div>
              )}
            </div>
            <div className="mt-6 space-y-2">
              <h2 className="font-semibold">What you'll get</h2>
              <ul className="list-disc pl-5 text-gray-700">
                {(item.benefits || ['Lifetime access','HD assets','Project files','Commercial license']).map((b)=> (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">{item.title}</h1>
            <p className="mt-3 text-gray-700">{item.description}</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="text-2xl font-semibold">${item.price.toFixed(2)}</span>
              <span className="text-yellow-500">★★★★★</span>
            </div>
            <button onClick={buy} className="mt-6 w-full md:w-auto rounded-lg bg-gray-900 text-white px-6 py-3 hover:bg-black transition">Buy Now</button>
            <div className="mt-8">
              <h3 className="font-semibold">Table of contents</h3>
              <ol className="list-decimal pl-5 text-gray-700">
                {(item.contents || ['Introduction','Core modules','Case studies','Resources']).map((c)=> (
                  <li key={c}>{c}</li>
                ))}
              </ol>
            </div>
            <div className="mt-8">
              <h3 className="font-semibold">FAQ</h3>
              <div className="space-y-3 text-gray-700">
                <div>
                  <p className="font-medium">How do I receive my files?</p>
                  <p>Instant download link after payment and via email.</p>
                </div>
                <div>
                  <p className="font-medium">Can I get a refund?</p>
                  <p>Yes, 30-day money-back guarantee if it’s not a fit.</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-sm text-gray-500">Secure checkout • No hidden fees • Lifetime updates</div>
            <div className="mt-2"><Link className="text-gray-700 underline" to="/">Back to products</Link></div>
          </div>
        </div>
      </div>
    </div>
  )
}
