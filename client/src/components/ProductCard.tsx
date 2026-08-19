import { Link } from 'react-router-dom'
import type { Product } from '../lib/api'
import { formatPrice } from '../lib/format'

export function ProductCard({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  return (
    <article
      key={product._id}
      className="animate-fade-up group flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-night-soft/60 transition-all duration-300 hover:-translate-y-1.5 hover:border-violet/40 hover:shadow-xl hover:shadow-violet/20"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.04]">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full bg-gradient-to-l from-violet to-purple px-3 py-1 text-xs font-bold text-white">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-base font-bold leading-snug sm:text-lg">{product.title}</h3>
        <p className="mt-1.5 flex-1 text-xs leading-relaxed text-mist sm:text-sm">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="font-display text-lg font-bold text-purple sm:text-xl">{formatPrice(product.price)}</span>
          <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-mist sm:text-xs">
            {product.weight}
          </span>
        </div>
        <Link
          to={`/checkout/${product._id}`}
          className="mt-3 block w-full rounded-full bg-gradient-to-l from-violet to-purple py-2.5 text-center text-sm font-bold text-white shadow-lg shadow-violet/25 transition-transform hover:scale-[1.03]"
        >
          اطلب الآن
        </Link>
      </div>
    </article>
  )
}
