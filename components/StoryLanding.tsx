'use client'
// components/StoryLanding.tsx — assembles the scroll story + shared Tweaks panel
import { useEffect } from 'react'
import { runRevealController } from '@/lib/story/scroll'
import { TweaksProvider, TweaksPanel } from '@/components/Tweaks'
import { MatchProvider } from '@/components/story/MatchContext'
import { HeroScene } from '@/components/story/HeroScene'
import { JourneyScene } from '@/components/story/JourneyScene'
import { LandingQuiz } from '@/components/story/LandingQuiz'
import { HorizontalScene, ResolutionScene } from '@/components/story/HorizontalScene'
// SammelnTeaser vorerst deaktiviert (Sammeln-Experience versteckt) — REVERSIBEL: Import + Szene unten wieder aktivieren.
// import { SammelnTeaser } from '@/components/story/SammelnTeaser'
import { ProgressNav } from '@/components/story/StoryNav'
import { ShapesBar } from '@/components/shapes/ShapesBar'

function StoryInner() {
  useEffect(() => runRevealController(), [])
  return (
    <>
      <ShapesBar overlay />
      <ProgressNav />
      <HeroScene />
      <JourneyScene />
      <LandingQuiz />
      <HorizontalScene />
      {/* <SammelnTeaser /> — vorerst deaktiviert (Sammeln versteckt) */}
      <ResolutionScene />

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
