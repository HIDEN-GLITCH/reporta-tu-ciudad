import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

function MapComponent({ onLocationSelect, selectedLocation, reports = [] }) {
  const mapRef = useRef(null)
  const mapInstance = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
  if (!mapInstance.current && mapRef.current) {
    mapInstance.current = L.map(mapRef.current).setView([19.4326, -99.1332], 13)
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance.current)
    
    mapInstance.current.on('click', (e) => {
      if (onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng })
      }
    })
    
    setTimeout(() => {
      if (mapInstance.current) {
        mapInstance.current.invalidateSize()
      }
    }, 100)
  }
  
  return () => {
    if (mapInstance.current) {
      mapInstance.current.remove()
      mapInstance.current = null;
    }
  }
}, [])

  useEffect(() => {
    if (mapInstance.current && selectedLocation) {
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng])
        .addTo(mapInstance.current)
        .bindPopup('Ubicación seleccionada')
        .openPopup()
      
      markersRef.current.push(marker)
      mapInstance.current.setView([selectedLocation.lat, selectedLocation.lng], 15)
    }
  }, [selectedLocation])

  useEffect(() => {
    if (mapInstance.current && reports.length > 0) {
      markersRef.current.forEach(marker => marker.remove())
      markersRef.current = []
      
      reports.forEach(report => {
        if (report.lat && report.lng) {
          const markerHtml = `<div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">📍</div>`
          
          const customIcon = L.divIcon({
            html: markerHtml,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          })
          
          const marker = L.marker([report.lat, report.lng], { icon: customIcon })
            .addTo(mapInstance.current)
            .bindPopup(`<strong>${report.title}</strong><br>${report.description}<br>Estado: ${report.status}`)
          
          markersRef.current.push(marker)
        }
      })
    }
  }, [reports])

  return (
  <div 
    ref={mapRef} 
    className="map-container w-full h-[400px] rounded-lg shadow-lg border border-gray-200"
    style={{ minHeight: '400px' }}
  ></div>
)
}

export default MapComponent