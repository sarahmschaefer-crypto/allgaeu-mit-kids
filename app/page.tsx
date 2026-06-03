// app/page.tsx — Storytelling scroll landing (replaces the previous landing).
// The previous landing (Header/HeroSection/CategoryJourney/AboutSection/
// RandomAusflug/Footer) stays in the components folder and in git history.
import StoryLanding from '@/components/StoryLanding'

export default function HomePage() {
  return <StoryLanding />
}
