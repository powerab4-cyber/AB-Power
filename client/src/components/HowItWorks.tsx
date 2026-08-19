import { Lightning } from './Lightning'
import { TitleBolt } from './TitleBolt'
import { SectionBackdrop } from './SectionBackdrop'

function UserIcon() {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function CalculatorIcon() {
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
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
      <line x1="16" y1="12" x2="16" y2="12.01" />
      <line x1="8" y1="16" x2="8" y2="16.01" />
      <line x1="12" y1="16" x2="12" y2="16.01" />
      <line x1="16" y1="16" x2="16" y2="16.01" />
      <line x1="8" y1="20" x2="12" y2="20" />
    </svg>
  )
}

function MealIcon() {
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
      <path d="M6 2v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2" />
      <path d="M8 2v20" />
      <path d="M18 2v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2" />
      <path d="M18 2v20" />
      <path d="M2 8c0 2 1.5 3 3.5 3S9 10 9 8" />
    </svg>
  )
}

const steps = [
  {
    icon: <UserIcon />,
    title: 'أدخل بياناتك',
    description:
      'قدم معلوماتك الأساسية: العمر، الجنس، الطول، الوزن، مستوى نشاطك، وهدفك.',
  },
  {
    icon: <CalculatorIcon />,
    title: 'نحسب مؤشراتك',
    description:
      'نحسب لك مؤشر كتلة الجسم، معدل الأيض، السعرات والمغذيات التي يحتاجها جسمك.',
  },
  {
    icon: <MealIcon />,
    title: 'خطتك الغذائية',
    description:
      'نقترح عليك أطعمة ووجبات مناسبة لهدفك واحتياجك الغذائي بدقة.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 lg:py-28">
      <SectionBackdrop
        image="/images/image.webp"
        imageMask="[mask-image:linear-gradient(to_right,black_0%,transparent_70%)]"
        grid
        gridSize="sm"
        orbs="both"
        spotlight
        topFade
        bottomFade
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center" data-reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-2 text-sm font-medium text-soft">
            <Lightning className="glow-bolt h-4 w-4 text-purple" />
            كيف نعمل
          </span>
          <TitleBolt />
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            ثلاث خطوات <span className="text-purple">تفصل بينك وبين هدفك</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-mist">
            رحلة بسيطة تبدأ ببياناتك، وتنتهي بخطة مخصصة بالكامل لجسمك.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              data-reveal
              className="group relative rounded-3xl border border-white/5 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-violet/40 hover:bg-white/[0.06]"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <span className="absolute left-6 top-6 font-display text-5xl font-bold text-white/5">
                0{i + 1}
              </span>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/25">
                {step.icon}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
