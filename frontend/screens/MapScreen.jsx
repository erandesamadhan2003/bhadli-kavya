import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";

let L;
if (Platform.OS === "web") {
  L = require("leaflet");
  require("leaflet/dist/leaflet.css");
}

export const MapScreen = () => {
  const mapRef = useRef(null);

  // 🌐 WEB VERSION (uses real DOM + Leaflet)
  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    fetch("/gujarat_district.geojson")
      .then((res) => res.json())
      .then((data) => {
        const gujaratFeatures = (data.features || []).filter(
          (feature) =>
            feature.properties &&
            feature.properties.NAME_1 === "Gujarat"
        );

        const total = gujaratFeatures.length || 1;

        gujaratFeatures.forEach((f, idx) => {
          const hue = Math.round((idx / total) * 360);
          f.properties._color = `hsl(${hue},60%,75%)`;
        });

        const gujaratData = {
          type: "FeatureCollection",
          features: gujaratFeatures,
        };

        const geoLayer = L.geoJSON(gujaratData, {
          style: function (feature) {
            return {
              color: "#000",
              weight: 1,
              fillColor:
                feature?.properties?._color || "#f2f2f2",
              fillOpacity: 1,
            };
          },
          onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NAME_2, {
              permanent: true,
              direction: "center",
              className: "district-label",
            });
          },
        }).addTo(map);

        map.fitBounds(geoLayer.getBounds());
      })
      .catch((err) => console.error(err));

    return () => map.remove();
  }, []);

  // 🌐 Render for WEB
  if (Platform.OS === "web") {
    return <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />;
  }

  // 📱 MOBILE VERSION (WebView injection)
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
      <style>
        body { margin: 0; }
        #map { height: 100vh; width: 100%; background: white; }
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

        fetch("gujarat_district.geojson")
          .then(res => res.json())
          .then(data => {

            const gujaratFeatures = (data.features || []).filter(
              feature => feature.properties && feature.properties.NAME_1 === "Gujarat"
            );

            const total = gujaratFeatures.length || 1;

            gujaratFeatures.forEach((f, idx) => {
              const hue = Math.round((idx / total) * 360);
              f.properties = f.properties || {};
              f.properties._color = \`hsl(\${hue},60%,75%)\`;
            });

            const gujaratData = {
              type: "FeatureCollection",
              features: gujaratFeatures
            };

            const geoLayer = L.geoJSON(gujaratData, {
              style: function (feature) {
                return {
                  color: "#000",
                  weight: 1,
                  fillColor: (feature && feature.properties && feature.properties._color) || "#f2f2f2",
                  fillOpacity: 1
                };
              },
              onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.NAME_2, {
                  permanent: true,
                  direction: "center",
                  className: "district-label"
                });
              }
            }).addTo(map);

            map.fitBounds(geoLayer.getBounds());
          })
          .catch(err => console.error(err));
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
