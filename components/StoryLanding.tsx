'use client'
// components/StoryLanding.tsx — assembles the scroll story + shared Tweaks panel
import { useEffect } from 'react'
import { runRevealController } from '@/lib/story/scroll'
import { TweaksProvider, TweaksPanel } from '@/components/Tweaks'
import { HeroScene } from '@/components/story/HeroScene'
import { JourneyScene } from '@/components/story/JourneyScene'
import { MatcherScene } from '@/components/story/MatcherScene'
import { HorizontalScene, ResolutionScene } from '@/components/story/HorizontalScene'
import { ProgressNav, FloatingCta, goToMatcher } from '@/components/story/StoryNav'

function StoryInner() {
  useEffect(() => runRevealController(), [])
  return (
    <>
      <ProgressNav />
      <FloatingCta />
      <HeroScene />
      <JourneyScene />
      <MatcherScene />
      <HorizontalScene />
      <ResolutionScene onStart={goToMatcher} />

      <footer className="story-foot">
        <span className="foot-mark">Allgäu&nbsp;·&nbsp;für kleine Entdecker</span>
        <span className="foot-mute">Konzept-Story · Bilder als Platzhalter</span>
      </footer>

      <TweaksPanel />
    </>
  )
}

export default function StoryLanding() {
  return (
    <TweaksProvider>
      <div id="story-root">
        <StoryInner />
      </div>
    </TweaksProvider>
  )
}
