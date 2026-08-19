import { useState } from 'react'
import { Lightning } from './Lightning'
import { TitleBolt } from './TitleBolt'
import { SectionBackdrop } from './SectionBackdrop'

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

const faqs = [
  {
    question: 'كيف تحسبون احتياجي الغذائي؟',
    answer:
      'نعتمد معادلات علمية معتمدة تعتمد على عمرك وجنسك وطولك ووزنك ومستوى نشاطك اليومي وهدفك، لنحصل على أرقام دقيقة للسعرات والمغذيات.',
  },
  {
    question: 'هل الخطة مناسبة لأي هدف؟',
    answer:
      'نعم. سواء كان هدفك إنقاص الوزن أو زيادته أو بناء العضلات أو الحفاظ على اللياقة، نبني خطتك حول هدفك الشخصي ونعدّلها مع تطورك.',
  },
  {
    question: 'هل منتجات المتجر أصلية؟',
    answer:
      'جميع المنتجات أصلية 100% ومختارة بالتعاون مع مختصين، ونضمن استرجاع المبلغ كاملاً في حال وصول منتج غير مطابق للمواصفات.',
  },
  {
    question: 'كم تستغرق تجهيز الخطة الغذائية؟',
    answer:
      'خطتك تصبح جاهزة فور اكتمال بياناتك، وتحتاج أقل من دقيقة واحدة. ويمكننا لاحقاً تعديلها بطلب مباشر عبر التطبيق.',
  },
]

function FaqItem({
  item,
  isOpen,
  onToggle,
}: {
  item: (typeof faqs)[number]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      className={
        isOpen
          ? 'overflow-hidden rounded-2xl border border-violet/40 bg-white/[0.05]'
          : 'overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] transition-colors duration-300 hover:border-violet/40'
      }
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-right"
      >
        <span className="font-display text-lg font-bold">{item.question}</span>
        <span
          className={
            isOpen
              ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-l from-violet to-purple text-white transition-transform duration-300 rotate-180'
              : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-soft transition-transform duration-300'
          }
        >
          <ChevronIcon />
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{
          gridTemplateRows: isOpen ? '1fr' : '0fr',
        }}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-sm leading-relaxed text-mist">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="relative py-20 lg:py-28">
      <SectionBackdrop grid gridSize="sm" spotlight topFade bottomFade />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-2 text-sm font-medium text-soft">
            <Lightning className="glow-bolt h-4 w-4 text-purple" />
            الأسئلة الشائعة
          </span>
          <TitleBolt />
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            لديك سؤال؟ <span className="text-purple">لدينا الإجابة</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mist">
            جمعنا لك أكثر الأسئلة تكراراً لتبدأ رحلتك بثقة كاملة.
          </p>
        </div>

        <div className="mt-14 space-y-4">
          {faqs.map((item, i) => (
            <div key={item.question} data-reveal style={{ transitionDelay: `${i * 0.05}s` }}>
              <FaqItem
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
