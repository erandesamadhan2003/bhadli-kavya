import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";

// only load on mobile
let WebView = null;
if (Platform.OS !== "web") {
  WebView = require("react-native-webview").WebView;
}

let L;
if (Platform.OS === "web") {
  L = require("leaflet");
  require("leaflet/dist/leaflet.css");
}

export const MapScreen = () => {
  const mapRef = useRef(null);

  // ======================================================
  // 🌐 WEB VERSION (REAL LEAFLET)
  // ======================================================
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    // load geojson
    fetch("/gujarat_district.geojson")
      .then((res) => res.json())
      .then((data) => {
        const gujaratFeatures = (data.features || []).filter(
          (f) => f.properties && f.properties.NAME_1 === "Gujarat"
        );

        // 🔥 fetch backend stats
        const token = localStorage.getItem("access_token");


        fetch("http://localhost:8000/geo/stats/state/1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((stats) => {
            const scoreMap = {};
            stats.forEach((s) => {
              scoreMap[s.district_name.toLowerCase()] = s;
            });

            gujaratFeatures.forEach((f) => {
              const name = f.properties.NAME_2?.toLowerCase();
              const info = scoreMap[name];

              if (info) {
                const score = info.score;

                // green scale (0 → red, 1 → green)
                const hue = Math.round(score * 120);

                f.properties._color = `hsl(${hue},70%,55%)`;
                f.properties._score = info.score;
                f.properties._count = info.count;
              } else {
                f.properties._color = "#eee";
              }
            });

            const geoLayer = L.geoJSON(
              {
                type: "FeatureCollection",
                features: gujaratFeatures,
              },
              {
                style: (feature) => ({
                  color: "#000",
                  weight: 1,
                  fillColor: feature?.properties?._color || "#eee",
                  fillOpacity: 1,
                }),
                onEachFeature: (feature, layer) => {
                  layer.bindTooltip(
                    `
                    <b>${feature.properties.NAME_2}</b><br/>
                    Score: ${feature.properties._score ?? "-"}<br/>
                    Count: ${feature.properties._count ?? "-"}
                    `
                  );
                },
              }
            ).addTo(map);

            map.fitBounds(geoLayer.getBounds());
          })
          .catch((err) => console.error("Stats error:", err));
      })
      .catch((err) => console.error("Geojson error:", err));

    return () => map.remove();
  }, []);

  // ======================================================
  // 🌐 RENDER WEBx 
  // ======================================================
  if (Platform.OS === "web") {
    return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
  }

  // ======================================================
  // 📱 MOBILE VERSION (WebView)
  // ======================================================
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
    <style>
      body { margin: 0; }
      #map { height: 100vh; width: 100%; }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
      const map = L.map("map", {
        zoomControl: true,
        attributionControl: false
      });

      Promise.all([
        fetch("gujarat_district.geojson").then(r => r.json()),
        fetch("http://localhost:8000/geo/stats/state/1").then(r => r.json())
      ]).then(([geo, stats]) => {

        const scoreMap = {};
        stats.forEach(s => {
          scoreMap[s.district_name.toLowerCase()] = s;
        });

        const features = (geo.features || []).filter(
          f => f.properties && f.properties.NAME_1 === "Gujarat"
        );

        features.forEach(f => {
          const name = (f.properties.NAME_2 || "").toLowerCase();
          const info = scoreMap[name];

          if (info) {
            const hue = Math.round(info.score * 120);
            f.properties._color = "hsl(" + hue + ",70%,55%)";
            f.properties._score = info.score;
            f.properties._count = info.count;
          } else {
            f.properties._color = "#eee";
          }
        });

        const geoLayer = L.geoJSON(
          { type: "FeatureCollection", features },
          {
            style: function(feature) {
              return {
                color: "#000",
                weight: 1,
                fillColor: feature.properties._color,
                fillOpacity: 1
              };
            },
            onEachFeature: function(feature, layer) {
              layer.bindTooltip(
                "<b>" + feature.properties.NAME_2 + "</b><br/>" +
                "Score: " + (feature.properties._score || "-") + "<br/>" +
                "Count: " + (feature.properties._count || "-")
              );
            }
          }
        ).addTo(map);

        map.fitBounds(geoLayer.getBounds());
      });
    </script>
  </body>
  </html>
  `;

  return (
    <View style={styles.container}>
      <WebView originWhitelist={["*"]} source={{ html: htmlContent }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
