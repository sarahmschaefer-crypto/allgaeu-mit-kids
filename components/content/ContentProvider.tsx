'use client'
// components/content/ContentProvider.tsx — stellt den öffentlichen (veröffentlichten)
// Ziel-Datensatz per Context bereit. Gefüllt im Root-Layout (Server) aus dem Store.
// Client-Komponenten lesen ihn via useDests() statt DESTINATIONS direkt zu importieren.
import { createContext, useContext } from 'react'
import { DESTINATIONS, type ShapesDest } from '@/lib/shapes/data'

// Fallback = data.ts-Seed, falls (unerwartet) außerhalb des Providers genutzt.
const DestsCtx = createContext<ShapesDest[]>(DESTINATIONS)

export function ContentProvider({ dests, children }: { dests: ShapesDest[]; children: React.ReactNode }) {
  return <DestsCtx.Provider value={dests}>{children}</DestsCtx.Provider>
}

export function useDests(): ShapesDest[] {
  return useContext(DestsCtx)
}
