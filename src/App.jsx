import Newsletter from './components/Newsletter'
import UPICheckout from './components/UPICheckout'

function App() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Red and black theme background with soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-black to-neutral-950" />
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="w-full h-full opacity-[0.07] bg-[radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.35),transparent_35%),_radial-gradient(circle_at_80%_10%,rgba(220,38,38,0.25),transparent_30%),_radial-gradient(circle_at_50%_80%,rgba(239,68,68,0.25),transparent_35%)]" />
      </div>

      <header className="relative z-10">
        <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.6)]" />
            <span className="text-white text-lg font-semibold tracking-tight">Flames Store</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#products" className="text-neutral-300 hover:text-white transition">Products</a>
            <a href="#about" className="text-neutral-300 hover:text-white transition">About</a>
            <a href="#contact" className="text-neutral-300 hover:text-white transition">Contact</a>
          </nav>
          <a href="#buy" className="inline-flex items-center gap-2 rounded-xl bg-red-600 text-white px-4 py-2 font-medium shadow-[0_10px_30px_-10px_rgba(239,68,68,0.8)] hover:bg-red-500 transition">
            Buy Now
          </a>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-10 pb-16 md:pt-20 md:pb-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-600/10 border border-red-500/30 px-3 py-1 text-red-400 text-xs mb-4">
                New • Digital products for creators
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Launch faster with premium digital templates
              </h1>
              <p className="mt-4 text-neutral-300 text-lg">
                Beautiful, conversion-focused assets made for modern creators. Instant download after purchase.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href="#products" className="inline-flex items-center justify-center rounded-xl bg-red-600 text-white px-5 py-3 font-medium shadow-[0_10px_30px_-10px_rgba(239,68,68,0.8)] hover:bg-red-500 transition">
                  Browse Products
                </a>
                <a href="#learn" className="inline-flex items-center justify-center rounded-xl border border-neutral-700 text-white px-5 py-3 font-medium hover:bg-neutral-900 transition">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-red-700 via-red-600 to-rose-600 shadow-[0_40px_100px_-30px_rgba(239,68,68,0.7)]" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-red-600/30 blur-2xl" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-2xl bg-rose-500/30 blur-2xl" />
            </div>
          </div>

          {/* Trust bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['Instant Download','Secure Checkout','Lifetime Access','Free Updates'].map((t) => (
              <div key={t} className="rounded-xl border border-neutral-800 bg-neutral-900/60 text-neutral-300 text-sm px-4 py-3 text-center">
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* Payment CTA with UPI */}
        <section id="buy" className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
              <h3 className="text-white text-2xl font-bold">Ultimate Creator Kit</h3>
              <p className="text-neutral-300 mt-2">All-in-one Notion, Figma, and marketing assets to launch faster.</p>
              <ul className="mt-4 text-neutral-300 text-sm list-disc pl-5 space-y-1">
                <li>Instant download</li>
                <li>Lifetime updates</li>
                <li>License for personal and commercial use</li>
              </ul>
            </div>
            <UPICheckout amountPaise={49900} label="Buy with UPI" />
          </div>
        </section>

        {/* Newsletter */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <Newsletter variant="dark" />
        </section>
      </main>

      <footer className="relative z-10 border-t border-neutral-800/80">
        <div className="max-w-6xl mx-auto px-6 py-10 text-neutral-400 text-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Flames Store. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-white">Privacy</a>
            <a href="#terms" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
