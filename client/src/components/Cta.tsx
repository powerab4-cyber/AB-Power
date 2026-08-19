import { Link } from 'react-router-dom'
import { Lightning } from './Lightning'

export function Cta() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          data-reveal
          className="relative overflow-hidden rounded-[2.5rem] border border-violet/30 p-8 text-center sm:p-12 lg:p-16"
        >
          <img
            src="/images/hero.webp"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-night/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/80" />
          <div className="absolute inset-0 bg-violet/20 mix-blend-multiply" />
          <div className="bg-grid absolute inset-0 opacity-60" />
          <div className="animate-pulse-glow absolute left-1/2 top-1/2 h-96 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple/25 blur-3xl" />
          <div className="glow-bolt animate-bolt-flicker absolute left-[6%] top-16 hidden text-violet/25 lg:block">
            <Lightning className="h-16 w-16" />
          </div>
          <div
            className="glow-bolt animate-bolt-flicker absolute bottom-10 right-[6%] hidden text-purple/25 lg:block"
            style={{ animationDelay: '1.8s' }}
          >
            <Lightning className="h-12 w-12" variant="line" />
          </div>

          <div className="relative">
            <span className="glow-bolt-lg mx-auto flex h-16 w-16 animate-pulse-glow items-center justify-center rounded-2xl bg-gradient-to-l from-violet to-purple text-white">
              <Lightning className="h-8 w-8" />
            </span>
            <h2 className="mt-6 font-display text-4xl font-bold sm:text-5xl">
              جاهز تبدأ رحلتك؟
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-mist">
              أدخل بياناتك واحصل على احتياجك الغذائي الدقيق وخطتك المقترحة.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-9 py-4 text-lg font-bold text-white shadow-xl shadow-violet/30 transition-transform hover:scale-105 sm:w-auto"
              >
                <Lightning className="glow-bolt h-5 w-5" />
                احسب احتياجك الآن
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
