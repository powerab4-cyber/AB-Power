import { useEffect, useRef, useState } from 'react'
import { Lightning } from './Lightning'
import { TitleBolt } from './TitleBolt'
import { SectionBackdrop } from './SectionBackdrop'

const reviews = [
  {
    name: 'John Smith',
    avatar: '/images/avatars/avatar-1.webp',
    rating: 5,
    text: 'طلبت الواي بروتين والكرياتين، وصلوني بسرعة وبجودة ممتازة. حساب السعرات في المنصة دقيق بزاف وساعدني نرتب أكلي مزيان.',
  },
  {
    name: 'Emma Johnson',
    avatar: '/images/avatars/avatar-2.webp',
    rating: 5,
    text: 'الخطة الغذائية اللي طلعت لي حسبتلي كل حاجة، ووزني نزل بشكل صحي بلا حرمان. المنصة ساهلة في الاستعمال وواضحة بزاف.',
  },
  {
    name: 'Michael Brown',
    avatar: '/images/avatars/avatar-3.webp',
    rating: 4,
    text: 'جودة المنتجات أصلية ومصدقة، والأسعار معقولة. نتمنى تزيدو منتجات أكثر للاختيار في القريب العاجل.',
  },
  {
    name: 'Olivia Wilson',
    avatar: '/images/avatars/avatar-4.webp',
    rating: 5,
    text: 'أول مرة نفهم قداش سعرة محتاج فعلاً. الخطة عطاتني الحافز نكمل لهدف الإنقاص وحسيت بفرق حقيقي.',
  },
  {
    name: 'James Davis',
    avatar: '/images/avatars/avatar-5.webp',
    rating: 5,
    text: 'منتجات المتجر ولاو جزء من روتيني اليومي، وأدائي في التمرين تحسن بشكل ملحوظ. جودة ممتازة وأسعار مناسبة، شكراً AB Power.',
  },
  {
    name: 'Sophia Miller',
    avatar: '/images/avatars/avatar-6.webp',
    rating: 4,
    text: 'اقتراحات الوجبات عاونوني نطيب صحي فالدار. المنصة خفيفة وسريعة حتى على التليفون.',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${count} من 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          viewBox="0 0 20 20"
          className={`h-5 w-5 ${star <= count ? 'text-purple' : 'text-white/15'}`}
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 0 0 .95.69h3.47c.97 0 1.37 1.24.59 1.81l-2.81 2.04a1 1 0 0 0-.36 1.12l1.07 3.3c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 0 0-1.18 0l-2.8 2.03c-.79.57-1.85-.2-1.54-1.12l1.06-3.3a1 1 0 0 0-.36-1.12L2.04 8.73c-.78-.57-.38-1.81.6-1.81H6.1a1 1 0 0 0 .95-.69l1.07-3.3Z" />
        </svg>
      ))}
    </div>
  )
}

function VerifyBadge() {
  return (
    <span className="flex items-center gap-1 text-xs font-bold text-purple">
      <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 0 1 0 1.4l-7 7a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4l2.3 2.29 6.3-6.3a1 1 0 0 1 1.4 0Z"
          clipRule="evenodd"
        />
      </svg>
      عميل موثّق
    </span>
  )
}

function ArrowIcon({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {direction === 'next' ? (
        <path d="m15 18-6-6 6-6" />
      ) : (
        <path d="m9 18 6-6-6-6" />
      )}
    </svg>
  )
}

function QuoteMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-10 w-10 text-violet"
      aria-hidden="true"
    >
      <path d="M10 7H6a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h1.5A2.5 2.5 0 0 1 10 18.5V19a2 2 0 0 1-2 2H6a4 4 0 0 1-4-4v-7a4 4 0 0 1 4-4h4a2 2 0 0 1 2 2 2 2 0 0 1-2 2Zm12 0h-4a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h1.5A2.5 2.5 0 0 1 22 18.5V19a2 2 0 0 1-2 2h-2a4 4 0 0 1-4-4v-7a4 4 0 0 1 4-4h4a2 2 0 0 1 2 2 2 2 0 0 1-2 2Z" />
    </svg>
  )
}

export function Reviews() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = reviews.length
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const goTo = (next: number, dir: 'next' | 'prev') => {
    setDirection(dir)
    setIndex(((next % total) + total) % total)
  }

  useEffect(() => {
    if (paused || reducedMotion) return
    timer.current = setInterval(() => {
      setDirection('next')
      setIndex((prev) => (prev + 1) % total)
    }, 5000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [paused, reducedMotion, total])

  const review = reviews[index]

  return (
    <section id="reviews" className="relative overflow-hidden py-20 lg:py-28">
      <SectionBackdrop
        image="/images/result4.webp"
        imageMask="[mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)]"
        grid
        orbs="both"
        topFade
        bottomFade
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-2 text-sm font-medium text-soft">
            <Lightning className="glow-bolt h-4 w-4 text-purple" />
            آراء عملائنا
          </span>
          <TitleBolt />
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            ماذا يقول عملاؤنا <span className="text-purple">عننا</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mist">
            تجارب حقيقية لعملاء المنصة والمتجر — رأيهم هو أفضل وصف لنا.
          </p>

          <div className="mt-8 inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/[0.03] px-7 py-3">
            <span className="font-display text-3xl font-bold text-purple">4.9</span>
            <span className="text-right">
              <Stars count={5} />
              <span className="mt-1 block text-sm text-mist">
                بناءً على 500+ تقييم
              </span>
            </span>
          </div>
        </div>

        <div
          className="relative mx-auto mt-16 max-w-3xl"
          data-reveal
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            key={index}
            className={
              direction === 'next'
                ? 'animate-card-in relative rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 shadow-2xl shadow-night sm:p-12'
                : 'animate-card-in-reverse relative rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 shadow-2xl shadow-night sm:p-12'
            }
          >
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-l from-transparent via-violet/60 to-transparent" />

            <QuoteMark />

            <p className="mt-6 min-h-28 text-lg leading-relaxed text-white/90 sm:min-h-24 sm:text-xl">
              “{review.text}”
            </p>

            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-8">
              <div className="flex items-center gap-4">
                <img
                  src={review.avatar}
                  alt={`صورة ${review.name}`}
                  loading="lazy"
                  className="h-16 w-16 rounded-full border-2 border-violet/50 object-cover ring-4 ring-violet/15"
                />
                <div>
                  <p className="font-display text-lg font-bold text-white">
                    {review.name}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Stars count={review.rating} />
                <VerifyBadge />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1, 'prev')}
            aria-label="التقييم السابق"
            className="absolute -left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-night-soft text-soft shadow-lg transition-all duration-300 hover:border-violet/50 hover:bg-violet/20 hover:text-white sm:-left-6"
          >
            <ArrowIcon direction="prev" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1, 'next')}
            aria-label="التقييم التالي"
            className="absolute -right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-night-soft text-soft shadow-lg transition-all duration-300 hover:border-violet/50 hover:bg-violet/20 hover:text-white sm:-right-6"
          >
            <ArrowIcon direction="next" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2.5" data-reveal>
          {reviews.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => goTo(i, i > index ? 'next' : 'prev')}
              aria-label={`التقييم ${i + 1}`}
              aria-current={i === index}
              className={
                i === index
                  ? 'h-2.5 w-8 rounded-full bg-gradient-to-l from-violet to-purple transition-all duration-300'
                  : 'h-2.5 w-2.5 rounded-full bg-white/20 transition-all duration-300 hover:bg-white/40'
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}
