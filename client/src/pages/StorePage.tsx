import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
import { getProducts } from '../lib/api'
import type { Product } from '../lib/api'
import { Footer } from '../components/Footer'
import { ProductCard } from '../components/ProductCard'
import { TitleBolt } from '../components/TitleBolt'
import { SectionBackdrop } from '../components/SectionBackdrop'

function BackArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

export function StorePage() {
  useReveal()

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

  return (
    <div className="relative min-h-screen bg-night font-body text-white">
      <div className="relative z-10 pb-20 pt-10 sm:pt-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex justify-end" data-reveal>
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:border-violet/40 hover:text-white"
            >
              <BackArrow />
              رجوع للرئيسية
            </Link>
          </div>

          <div className="relative mt-10">
            <SectionBackdrop
              image="/images/product4.webp"
              imageMask="[mask-image:linear-gradient(to_left,black_0%,transparent_75%)]"
              grid
              orbs="both"
              spotlight
              topFade
              bottomFade
            />
            <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-2 text-sm font-medium text-soft" data-reveal>
                متجر AB Power
              </span>
              <TitleBolt />
              <h1 className="font-display text-4xl font-bold sm:text-5xl">
                كل <span className="text-purple">منتجاتنا</span> في مكان واحد
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-lg text-mist">
                تصفّح المجموعة الكاملة من المكملات الأصلية المختارة بعناية لدعم رحلتك الرياضية.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
              ))}
            </div>
          ) : products.length ? (
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {products.map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <p className="mt-14 text-center text-mist">لا توجد منتجات متاحة حالياً.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
