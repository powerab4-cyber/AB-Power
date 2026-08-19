import { Lightning } from './Lightning'
import { TitleBolt } from './TitleBolt'
import { SectionBackdrop } from './SectionBackdrop'

function CalcIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M12 1v4m0 14v4M4.22 4.22l2.83 2.83m9.9 9.9 2.83 2.83M1 12h4m14 0h4M4.22 19.78l2.83-2.83m9.9-9.9 2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function PlanIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M4 7h16l1 5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
      <path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8" />
    </svg>
  )
}

const features = [
  {
    icon: <CalcIcon />,
    title: 'حساب السعرات والمؤشرات',
    description:
      'نحسب لك بدقة مؤشر كتلة الجسم، معدل الأيض، السعرات والمغذيات اليومية بناءً على بياناتك وهدفك.',
  },
  {
    icon: <PlanIcon />,
    title: 'خطط غذائية مخصصة',
    description:
      'خطة كاملة بالوجبات والأطعمة المناسبة لهدفك، مع بدائل غذائية تلائم تفضيلاتك وجدولك اليومي.',
  },
  {
    icon: <StoreIcon />,
    title: 'متجر مكملات موثوق',
    description:
      'منتجات أصلية 100% مختارة بعناية مع المختصين، تصلك حتى باب منزلك بأسعار منافسة.',
  },
]

export function FeatureHighlights() {
  return (
    <section className="relative py-20 lg:py-28">
      <SectionBackdrop
        image="/images/gym.webp"
        imageMask="[mask-image:linear-gradient(to_top,black_0%,transparent_75%)]"
        grid
        orbs="both"
        bolt="violet"
        topFade
        bottomFade
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-2 text-sm font-medium text-soft">
            <Lightning className="glow-bolt h-4 w-4 text-purple" />
            لماذا AB Power؟
          </span>
          <TitleBolt />
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            كل ما تحتاجه لهدفك <span className="text-purple">في منصة واحدة</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mist">
            من الحساب الدقيق إلى الخطة الجاهزة، نمشي معك خطوة بخطوة نحو جسم أكثر صحة.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              data-reveal
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-violet/40 hover:bg-white/[0.06]"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-violet/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/25 transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </span>
              <h3 className="mt-6 font-display text-xl font-bold">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
