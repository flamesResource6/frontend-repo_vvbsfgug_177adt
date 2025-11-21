import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
      <Spline scene="https://prod.spline.design/xzUirwcZB9SOxUWt/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-white/60 to-white" />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 leading-tight">
            Creative digital products for modern creators
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl">
            Premium courses, templates, and resources to level up your craft. Simple, secure, and instant access after purchase.
          </p>
          <div className="mt-8 flex gap-4">
            <a href="#products" className="inline-flex items-center justify-center rounded-lg bg-gray-900 text-white px-6 py-3 text-base md:text-lg hover:bg-black transition">Browse Best Sellers</a>
            <a href="#checkout" className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-900 px-6 py-3 hover:bg-gray-50 transition">Download Instantly</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function TrustBar() {
  return (
    <section className="py-6 border-y border-gray-100 bg-white/60 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm text-gray-700">
        <div><span className="font-semibold">10k+</span> customers</div>
        <div>Featured in <span className="font-semibold">DesignMag</span></div>
        <div>Average rating <span className="font-semibold">4.9/5</span></div>
        <div>Instant downloads</div>
      </div>
    </section>
  )
}

function ProductCard({ item, onBuy }) {
  return (
    <div className="group border border-gray-200 rounded-xl p-4 hover:shadow-lg transition bg-white">
      <div className="aspect-video w-full rounded-lg bg-gray-100 overflow-hidden">
        {item.cover_url ? (
          <img src={item.cover_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-500">No Cover</div>
        )}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-gray-900 font-semibold">${item.price.toFixed(2)}</span>
        <span className="text-yellow-500">★★★★★</span>
      </div>
      <button onClick={() => onBuy(item)} className="mt-4 w-full rounded-lg bg-gray-900 text-white py-2.5 hover:bg-black transition">Buy Now</button>
    </div>
  )
}

function Filters({ filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div>
        <label className="block text-sm text-gray-600">Category</label>
        <select value={filters.category} onChange={e=>setFilters(v=>({...v, category:e.target.value}))} className="mt-1 w-40 border-gray-300 rounded-md">
          <option value="">All</option>
          <option value="course">Courses</option>
          <option value="prompt">Prompts</option>
          <option value="video">Stock Video</option>
          <option value="template">Templates</option>
          <option value="bundle">Bundles</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600">Level</label>
        <select value={filters.level} onChange={e=>setFilters(v=>({...v, level:e.target.value}))} className="mt-1 w-40 border-gray-300 rounded-md">
          <option value="">All</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div>
        <label className="block text-sm text-gray-600">Min Price</label>
        <input type="number" value={filters.min_price} onChange={e=>setFilters(v=>({...v, min_price:e.target.value}))} className="mt-1 w-32 border-gray-300 rounded-md" />
      </div>
      <div>
        <label className="block text-sm text-gray-600">Max Price</label>
        <input type="number" value={filters.max_price} onChange={e=>setFilters(v=>({...v, max_price:e.target.value}))} className="mt-1 w-32 border-gray-300 rounded-md" />
      </div>
      <button onClick={()=>setFilters(f=>({...f}))} className="h-10 px-4 rounded-md bg-gray-900 text-white">Apply</button>
    </div>
  )
}

function Products() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category: '', level: '', min_price: '', max_price: '' })

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.category) params.set('category', filters.category)
    if (filters.level) params.set('level', filters.level)
    if (filters.min_price) params.set('min_price', filters.min_price)
    if (filters.max_price) params.set('max_price', filters.max_price)
    const res = await fetch(`${API_BASE}/products?${params.toString()}`)
    const data = await res.json()
    setItems(data.products || [])
    setLoading(false)
  }

  useEffect(()=>{ load() // initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{ load() }, [filters.category, filters.level, filters.min_price, filters.max_price])

  const buy = async (product) => {
    const body = { product_id: product._id || product.slug, email: 'demo@buyer.com', amount: product.price }
    const res = await fetch(`${API_BASE}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    alert(`Order confirmed! Download link: ${data?.order?.download_url || 'N/A'}`)
  }

  return (
    <section id="products" className="py-16 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">Best Sellers</h2>
          <Filters filters={filters} setFilters={setFilters} />
        </div>
        {loading ? (
          <div className="text-gray-500">Loading products…</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map(item => <ProductCard key={item._id || item.slug} item={item} onBuy={buy} />)}
          </div>
        )}
      </div>
    </section>
  )
}

function ValueProps() {
  const points = [
    { title: 'Instant Access', desc: 'Download immediately after payment.' },
    { title: 'Lifetime Updates', desc: 'Get all future updates for free.' },
    { title: 'Safe & Secure', desc: 'Encrypted checkout and trusted gateways.' },
    { title: '30-Day Guarantee', desc: 'Full refund if you’re not satisfied.' },
  ]
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-4 gap-6">
        {points.map((p)=> (
          <div key={p.title} className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="font-semibold text-gray-900">{p.title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Hero />
      <TrustBar />
      <Products />
      <ValueProps />
      <footer className="py-10 text-center text-sm text-gray-500">© {new Date().getFullYear()} Digital Store. Secure checkout. No hidden fees.</footer>
    </div>
  )
}
