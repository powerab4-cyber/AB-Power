import { Link } from 'react-router-dom'
import { Lightning } from './Lightning'
import { useAuth } from '../auth/context'

const features = [
  { label: 'حساب السعرات', icon: 'calc' },
  { label: 'خطة غذائية', icon: 'meal' },
  { label: 'مكملات أصلية', icon: 'bag' },
]

function Icon({ name, className = 'h-5 w-5' }: { name: string; className?: string }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  }

  switch (name) {
    case 'calc':
      return (
        <svg {...common}>
          <rect x="4" y="2" width="16" height="20" rx="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="12" x2="8" y2="12.01" />
          <line x1="12" y1="12" x2="12" y2="12.01" />
          <line x1="16" y1="12" x2="16" y2="12.01" />
          <line x1="8" y1="16" x2="8" y2="16.01" />
          <line x1="12" y1="16" x2="12" y2="16.01" />
          <line x1="16" y1="16" x2="16" y2="16.01" />
        </svg>
      )
    case 'meal':
      return (
        <svg {...common}>
          <path d="M6 2v6a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2V2" />
          <path d="M8 2v20" />
          <path d="M18 2v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2V2" />
          <path d="M18 2v20" />
        </svg>
      )
    case 'bag':
      return (
        <svg {...common}>
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    case 'check':
      return (
        <svg {...common}>
          <path d="M20 6 9 17l-5-5" />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...common} className="h-5 w-5">
          <path d="M19 12H5" />
          <path d="m11 18-6-6 6-6" />
        </svg>
      )
    default:
      return null
  }
}

function StarIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.07 3.3a1 1 0 0 0 .95.69h3.47c.97 0 1.37 1.24.59 1.81l-2.81 2.04a1 1 0 0 0-.36 1.12l1.07 3.3c.3.92-.75 1.69-1.54 1.12l-2.8-2.03a1 1 0 0 0-1.18 0l-2.8 2.03c-.79.57-1.85-.2-1.54-1.12l1.06-3.3a1 1 0 0 0-.36-1.12L2.04 8.73c-.78-.57-.38-1.81.6-1.81H6.1a1 1 0 0 0 .95-.69l1.07-3.3Z" />
    </svg>
  )
}

export function Hero() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const dashboardTo = isAdmin ? '/dashboard' : '/account'
  const ctaLabel = isAdmin ? 'لوحة التحكم' : 'حسابي'

  return (
    <section
      id="home"
      className="relative flex min-h-svh flex-col overflow-hidden pt-24"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src="/images/gym.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="animate-ken-burns h-full w-full object-cover"
        />
        <img
          src="/images/trainer.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute left-0 top-0 hidden h-4/5 w-1/2 object-cover [mask-image:linear-gradient(to_right,black_0%,black_25%,transparent_72%)] lg:block"
        />
        <img
          src="/images/result1.webp"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute top-[18%] left-[12%] hidden h-56 w-52 object-cover [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)] xl:block"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/45 to-night/15" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet/25 via-transparent to-night/60" />

        <div className="bg-grid-sm absolute inset-0 opacity-60" />

        <div className="animate-aurora absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,16,0.85)_100%)]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center pb-16 lg:pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-violet/40 bg-night/50 px-5 py-2 text-sm font-medium text-soft backdrop-blur">
              <Lightning className="glow-bolt h-4 w-4 text-purple" />
              منصة التغذية واللياقة المتكاملة
            </span>

            <div className="relative mt-8">
              <div className="absolute left-1/2 top-1/2 h-80 w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(147,71,209,0.3),transparent_75%)] blur-2xl" />
              <h1
                className="animate-fade-up relative font-display text-4xl font-extrabold leading-[1.3] sm:text-5xl md:text-6xl xl:text-7xl"
                style={{ animationDelay: '0.1s' }}
              >
                <span className="text-white [filter:drop-shadow(0_0_20px_rgba(147,71,209,0.3))]">
                  احسب احتياجك <span className="text-white">بدقة،</span>
                </span>
                <br />
                <span className="relative mt-3 inline-block">
                  <span className="inline-block bg-gradient-to-l from-[#a78bfa] via-[#9347d1] to-[#a78bfa] bg-clip-text font-extrabold text-transparent">
                    واحصل على مكملاتك الأصلية
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-3 left-1/2 h-[3px] w-2/3 -translate-x-1/2 rounded-full bg-gradient-to-l from-purple/50 via-soft to-purple/50 [filter:drop-shadow(0_0_10px_rgba(216,180,254,0.45))]"
                  />
                </span>
              </h1>
            </div>

            <p
              className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-mist sm:text-xl"
              style={{ animationDelay: '0.2s' }}
            >
              منصة واحدة تحسب احتياج جسمك، تخطّط وجباتك، وتوفر لك مكملات
              أصلية — كل شيء مخصص لك.
            </p>

            <div
              className="animate-fade-up mt-7 flex flex-wrap items-center justify-center gap-3"
              style={{ animationDelay: '0.25s' }}
            >
              {features.map((feature) => (
                <span
                  key={feature.label}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-night/50 px-4 py-2 text-sm font-medium text-soft backdrop-blur transition-colors hover:border-purple/50 hover:text-white"
                >
                  <span className="text-purple">
                    <Icon name={feature.icon} className="h-4 w-4" />
                  </span>
                  {feature.label}
                </span>
              ))}
            </div>

            <div
              className="animate-fade-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                to={user ? dashboardTo : '/login'}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-violet via-purple to-violet px-9 py-4 text-lg font-bold text-white shadow-xl shadow-violet/40 transition-transform hover:scale-105 sm:w-auto"
              >
                {user ? (
                  <>
                    {ctaLabel}
                    <span className="transition-transform group-hover:-translate-x-1">
                      <Icon name="arrow" />
                    </span>
                  </>
                ) : (
                  <>
                    <span className="glow-bolt">
                      <Lightning className="h-5 w-5" />
                    </span>
                    ابدأ الآن — مجاناً
                    <span className="transition-transform group-hover:-translate-x-1">
                      <Icon name="arrow" />
                    </span>
                  </>
                )}
              </Link>
              <a
                href="#store"
                className="flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-night/50 px-9 py-4 text-lg font-bold text-white backdrop-blur transition-colors hover:border-purple/50 hover:bg-night/70 sm:w-auto"
              >
                <span className="text-soft">
                  <Icon name="bag" />
                </span>
                تصفح المتجر
              </a>
            </div>

            <div
              className="animate-fade-up mt-8 flex items-center justify-center gap-3"
              style={{ animationDelay: '0.4s' }}
            >
              <a
                href="https://www.instagram.com/ab.powerdz?igsh=MWo1eGp4d3d3Y3d1Ng=="
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-night/40 px-4 py-2 text-sm text-mist backdrop-blur transition-all duration-300 hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 transition-transform group-hover:scale-110">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
              <a
                href="https://lite.tiktok.com/t/ZS9kbvK6vp8wG-kpCN6/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-night/40 px-4 py-2 text-sm text-mist backdrop-blur transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-400"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 transition-transform group-hover:scale-110">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.85 4.85 0 0 1-1-.84z" />
                </svg>
                TikTok
              </a>
              <a
                href="https://www.facebook.com/share/19M8MgDdPG/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-night/40 px-4 py-2 text-sm text-mist backdrop-blur transition-all duration-300 hover:border-blue-500/40 hover:bg-blue-500/10 hover:text-blue-400"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 transition-transform group-hover:scale-110">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
                Facebook
              </a>
              <a
                href="https://wa.me/213542963422"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full border border-white/10 bg-night/40 px-4 py-2 text-sm text-mist backdrop-blur transition-all duration-300 hover:border-green-500/40 hover:bg-green-500/10 hover:text-green-400"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 transition-transform group-hover:scale-110">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-fade-up absolute right-[6%] top-32 z-20 hidden xl:block" style={{ animationDelay: '0.4s' }}>
        <div className="animate-float" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-night/80 px-5 py-3 shadow-xl shadow-violet/25 backdrop-blur-md">
            <span className="font-display text-2xl font-bold text-purple">4.9</span>
            <div className="text-right">
              <div className="flex gap-0.5 text-purple">
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
                <StarIcon />
              </div>
              <p className="mt-0.5 text-[11px] text-mist">500+ تقييم</p>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-shimmer relative z-10 h-1 bg-gradient-to-l from-violet via-purple to-violet" style={{ backgroundSize: '200% 100%' }} />
    </section>
  )
}
