import logo from '../assets/Logo.png'
import { Link } from 'react-router-dom'
import { Lightning } from './Lightning'

const footerLinks = [
  { label: 'الرئيسية', to: '#home' },
  { label: 'كيف نعمل', to: '#how' },
  { label: 'المتجر', to: '/store' },
  { label: 'تواصل معنا', to: '#contact' },
]

export function Footer() {
  return (
    <footer id="contact" className="relative border-t border-white/5 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="top-fade absolute inset-x-0 top-0 h-32" />
        <div className="bg-grid absolute inset-0 opacity-50" />
        <div className="animate-pulse-glow absolute -bottom-24 left-1/2 h-64 w-[70%] -translate-x-1/2 rounded-full bg-violet/10 blur-3xl" />
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 sm:px-6">
        <div className="flex items-center">
          <img
            src={logo}
            alt="AB Power"
            className="h-16 w-auto object-contain"
          />
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-mist">
          {footerLinks.map((link) =>
            link.to.startsWith('#') ? (
              <a
                key={link.to}
                href={link.to}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        {/* Social links */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://www.instagram.com/ab.powerdz?igsh=MWo1eGp4d3d3Y3d1Ng=="
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-mist backdrop-blur-sm transition-all duration-300 hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-400 hover:shadow-lg hover:shadow-pink-500/10"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            <span className="text-sm font-medium">Instagram</span>
          </a>
          <a
            href="https://lite.tiktok.com/t/ZS9kbvK6vp8wG-kpCN6/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-mist backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-400 hover:shadow-lg hover:shadow-cyan-400/10"
            aria-label="TikTok"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.85 4.85 0 0 1-1-.84z" />
            </svg>
            <span className="text-sm font-medium">TikTok</span>
          </a>
          <a
            href="https://www.facebook.com/share/19M8MgDdPG/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5 text-mist backdrop-blur-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/10"
            aria-label="Facebook"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span className="text-sm font-medium">Facebook</span>
          </a>
        </div>
        <div className="flex max-w-md flex-col items-center gap-2 px-2 text-center">
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-violet"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            حي 108، الشيخ العيفة، سطيف
          </span>
          <span className="text-sm leading-relaxed text-mist">
            وحدة إنتاج وتعليب المكملات الغذائية ومواد التجميل والتنظيف
          </span>
        </div>
        <p className="flex items-center gap-2 text-sm text-mist/60">
          <Lightning className="glow-bolt h-3.5 w-3.5 text-violet" />
          © {new Date().getFullYear()} AB Power — جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  )
}
