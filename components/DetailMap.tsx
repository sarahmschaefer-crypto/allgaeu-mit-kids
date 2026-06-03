// components/DetailMap.tsx
'use client'
import { useEffect, useRef } from 'react'

type Props = { lat: number; lng: number; name: string; color: string }

export default function DetailMap({ lat, lng, name, color }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<unknown>(null)

  useEffect(() => {
    if (!ref.current || mapRef.current) return

    // Dynamic import to avoid SSR issues
    import('leaflet').then(L => {
      // Fix default icon
      delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      const map = L.map(ref.current!, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false,
      })

      // CartoDB Positron – entsättigt, passt zum Lo-Fi-Look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map)

      // Custom colored pin
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: 20px; height: 20px;
          background: ${color};
          border: 2.5px solid #1a1a1a;
          border-radius: 50%;
          box-shadow: 3px 3px 0 #1a1a1a;
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(`<b style="font-family: 'Courier New'; font-size: 13px">${name}</b>`)
        .openPopup()

      mapRef.current = map
    })

    return () => {
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove()
        mapRef.current = null
      }
    }
  }, [lat, lng, name, color])

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={ref}
        className="w-full h-64 border-2 border-ink"
        style={{ boxShadow: '4px 4px 0 #1a1a1a' }}
      />
    </>
  )
}
