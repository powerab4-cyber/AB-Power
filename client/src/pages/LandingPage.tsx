import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { SplashScreen } from '../components/SplashScreen'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { FeatureHighlights } from '../components/FeatureHighlights'
import { HowItWorks } from '../components/HowItWorks'
import { Store } from '../components/Store'
import { Reviews } from '../components/Reviews'
import { Faq } from '../components/Faq'
import { ElectricDivider } from '../components/ElectricDivider'
import { Cta } from '../components/Cta'
import { Footer } from '../components/Footer'

export function LandingPage() {
  const [splashDone, setSplashDone] = useState(false)
  useReveal()

  return (
    <div className="relative min-h-screen bg-night font-body text-white">
      {!splashDone && <SplashScreen onFinished={() => setSplashDone(true)} />}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <FeatureHighlights />
          <HowItWorks />
          <Store />
          <Reviews />
          <Faq />
          <ElectricDivider />
          <Cta />
        </main>
        <Footer />
      </div>
    </div>
  )
}
