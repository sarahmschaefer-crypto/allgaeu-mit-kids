// app/page.tsx
import Header from '@/components/Header'
import HeroSection from '@/components/HeroSection'
import CategoryJourney from '@/components/CategoryJourney'
import AboutSection from '@/components/AboutSection'
import RandomAusflug from '@/components/RandomAusflug'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoryJourney />
        <AboutSection />
        <RandomAusflug />
      </main>
      <Footer />
    </>
  )
}
