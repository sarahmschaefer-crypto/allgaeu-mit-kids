// components/EntdeckenMap.tsx
'use client'
import { useEffect, useRef } from 'react'
import { type Location, CATEGORY_COLOR } from '@/lib/locations'
import { useRouter } from 'next/navigation'

export default function EntdeckenMap({ locations }: { locations: Location[] }) {
  const ref    = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)
  const router = useRouter()

  useEffect(() => {
    if (!ref.current) return

    import('leaflet').then(L => {
      // Clean up previous instance
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }

      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(ref.current!, {
        center: [47.72, 10.32],
        zoom: 10,
        scrollWheelZoom: false,
      })

      // CartoDB Positron – entsättigt, Lo-Fi-Style
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map)

      locations.forEach(loc => {
        const color = CATEGORY_COLOR[loc.category] ?? '#1a1a1a'

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width: 22px; height: 22px;
            background: ${color};
            border: 2.5px solid #1a1a1a;
            border-radius: 50%;
            box-shadow: 3px 3px 0 #1a1a1a;
            cursor: pointer;
            transition: transform 0.15s;
          " onmouseenter="this.style.transform='scale(1.3)'" onmouseleave="this.style.transform='scale(1)'"></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        })

        const popup = L.popup({ maxWidth: 240, className: 'lofi-popup' }).setContent(`
          <div style="font-family: 'Courier New', monospace; padding: 4px">
            <div style="
              display: inline-block;
              background: ${color};
              color: #F5EFE8;
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 3px;
              text-transform: uppercase;
              padding: 2px 8px;
              border: 1px solid #1a1a1a;
              margin-bottom: 6px;
              box-shadow: 2px 2px 0 #1a1a1a;
            ">${loc.category}</div>
            <div style="font-size: 14px; font-weight: 700; margin-bottom: 4px">${loc.name}</div>
            <div style="font-size: 11px; font-family: Georgia, serif; font-style: italic; color: #555; margin-bottom: 10px">${loc.subline}</div>
            <a href="/ort/${loc.id}" style="
              display: block;
              text-align: center;
              padding: 6px 12px;
              border: 1.5px solid #1a1a1a;
              background: #1a1a1a;
              color: #F5EFE8;
              font-size: 9px;
              font-weight: 700;
              letter-spacing: 3px;
              text-transform: uppercase;
              text-decoration: none;
              box-shadow: 2px 2px 0 #B49139;
            ">Details →</a>
          </div>
        `)

        L.marker([loc.lat, loc.lng], { icon }).addTo(map).bindPopup(popup)
      })

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
    }
  }, [locations, router])

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <div
        ref={ref}
        className="w-full border-2 border-ink"
        style={{ height: 'calc(100vh - 200px)', minHeight: '500px', boxShadow: '4px 4px 0 #1a1a1a' }}
      />
    </>
  )
}
