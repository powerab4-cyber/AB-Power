import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../lib/api'
import type { Product } from '../lib/api'
import { ProductCard } from './ProductCard'
import { TitleBolt } from './TitleBolt'
import { SectionBackdrop } from './SectionBackdrop'

export function Store() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getProducts()
      .then((res) => {
        if (active) setProducts(res.products)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const featuredProducts = products.slice(0, 4)

  return (
    <section id="store" className="relative overflow-hidden py-20 lg:py-28">
      <SectionBackdrop
        image="/images/product4.webp"
        imageMask="[mask-image:linear-gradient(to_left,black_0%,transparent_75%)]"
        grid
        orbs="both"
        spotlight
        topFade
        bottomFade
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-2 text-sm font-medium text-soft">
            متجر AB Power
          </span>
          <TitleBolt />
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            مكملات <span className="text-purple">بجودة عالمية</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-mist">
            منتجات أصلية مختارة بعناية لتدعم تغذيتك وتساعدك على الوصول لهدفك.
          </p>
        </div>

        {loading ? (
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
            ))}
          </div>
        ) : featuredProducts.length ? (
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        ) : null}

        <div className="mt-14 flex justify-center" data-reveal>
          <Link
            to="/store"
            className="flex items-center gap-2 rounded-full border border-violet/40 bg-violet/10 px-8 py-3.5 font-bold text-soft transition-colors hover:bg-gradient-to-l hover:from-violet hover:to-purple hover:text-white"
          >
            عرض المزيد
          </Link>
        </div>
      </div>
    </section>
  )
}
