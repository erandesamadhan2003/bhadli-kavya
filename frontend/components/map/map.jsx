import React, { useRef, useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import './App.css'

export default function Map() {
  const mapRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false
    })

    // Fetch GeoJSON at runtime from the public folder
    fetch('/gujarat_district.geojson')
      .then((res) => res.json())
      .then((data) => {
        const gujaratFeatures = (data.features || []).filter(
          feature => feature.properties && feature.properties.NAME_1 === 'Gujarat'
        )

        const total = gujaratFeatures.length || 1
        gujaratFeatures.forEach((f, idx) => {
          const hue = Math.round((idx / total) * 360)
          f.properties = f.properties || {}
          f.properties._color = `hsl(${hue},60%,75%)`
        })

        const gujaratData = {
          type: 'FeatureCollection',
          features: gujaratFeatures
        }

        const geoLayer = L.geoJSON(gujaratData, {
          style: function (feature) {
            return {
              color: '#000',
              weight: 1,
              fillColor: (feature && feature.properties && feature.properties._color) || '#f2f2f2',
              fillOpacity: 1
            }
          },
          onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NAME_2, {
              permanent: true,
              direction: 'center',
              className: 'district-label'
            })
          }
        }).addTo(map)

        map.fitBounds(geoLayer.getBounds())
      })
      .catch((err) => {
        console.error('Failed to load GeoJSON:', err)
      })

    return () => {
      map.remove()
    }
  }, [])

  return <div id="map" ref={mapRef} style={{ height: '100vh', width: '100%' }} />
}
