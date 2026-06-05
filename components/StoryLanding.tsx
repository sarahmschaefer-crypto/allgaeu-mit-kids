'use client'
// components/StoryLanding.tsx — assembles the scroll story + shared Tweaks panel
import { useEffect } from 'react'
import { runRevealController } from '@/lib/story/scroll'
import { TweaksProvider, TweaksPanel } from '@/components/Tweaks'
import { MatchProvider } from '@/components/story/MatchContext'
import { HeroScene } from '@/components/story/HeroScene'
import { JourneyScene } from '@/components/story/JourneyScene'
import { MatcherScene } from '@/components/story/MatcherScene'
import { HorizontalScene, ResolutionScene } from '@/components/story/HorizontalScene'
import { ProgressNav, FloatingCta } from '@/components/story/StoryNav'
import { ShapesBar } from '@/components/shapes/ShapesBar'

function StoryInner() {
  useEffect(() => runRevealController(), [])
  return (
    <>
      <ShapesBar overlay />
      <ProgressNav />
      <FloatingCta />
      <HeroScene />
      <JourneyScene />
      <MatcherScene />
      <HorizontalScene />
      <ResolutionScene />

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
      <MatchProvider>
        <div id="story-root">
          <StoryInner />
        </div>
      </MatchProvider>
    </TweaksProvider>
  )
}
