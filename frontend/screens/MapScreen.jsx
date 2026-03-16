import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useRoute } from "@react-navigation/native";

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
  const route = useRoute();

  const [metric, setMetric] = useState("district_score");

  const poemId = route?.params?.poemId;

  const location = route?.params?.location || "Gujarat";

  const normalized = location.toLowerCase().replace(/\s/g, "");

  const isUP = normalized === "uttarpradesh";

  const stateName = isUP ? "UttarPradesh" : "Gujarat";

  useEffect(() => {

    if (Platform.OS !== "web") return;
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: false,
    });

    fetch("/gujarat_district.geojson")
      .then((res) => res.json())
      .then((geoData) => {

        const features = geoData.features.filter(
          (f) => f.properties && f.properties.NAME_1 === stateName
        );

        const token = localStorage.getItem("access_token");

        fetch(`http://localhost:8000/geo/map-data?poem_id=${poemId}&metric=${metric}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((stats) => {

            const valueMap = {};

            let min = Infinity;
            let max = -Infinity;

            stats.forEach((s) => {

              const value = Number(s.value);

              if (!isNaN(value)) {
                min = Math.min(min, value);
                max = Math.max(max, value);
              }

              valueMap[s.district_name.toLowerCase()] = value;
            });

            features.forEach((f) => {

              const name = f.properties.NAME_2?.toLowerCase();
              const value = valueMap[name];

              if (value !== undefined && !isNaN(value)) {

                const normalized = (value - min) / (max - min);

                const lightness = 90 - normalized * 50;

                const color = `hsl(120, 70%, ${lightness}%)`;

                f.properties._color = color;
                f.properties._value = value;

              } else {

                f.properties._color = "#eee";
                f.properties._value = "-";

              }
            });

            const geoLayer = L.geoJSON(
              { type: "FeatureCollection", features },
              {
                style: (feature) => ({
                  color: "#000",
                  weight: 1,
                  fillColor: feature.properties._color,
                  fillOpacity: 1,
                }),
                onEachFeature: (feature, layer) => {
                  layer.bindTooltip(
                    `<b>${feature.properties.NAME_2}</b><br/>
                     ${metric}: ${feature.properties._value}`
                  );
                },
              }
            ).addTo(map);

            if (features.length > 0) {
              map.fitBounds(geoLayer.getBounds());
            }

          });
      });

    return () => map.remove();

  }, [metric, poemId, location]);

  if (Platform.OS === "web") {

    return (
      <View style={styles.container}>

        <div style={styles.dropdownContainer}>

          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            style={styles.dropdown}
          >

            <option value="total_years">Total Years</option>
            <option value="condition_years">Condition Years</option>
            <option value="rainfall_mean">Rainfall Mean</option>
            <option value="rainfall_mean_when_condition_is_true">
              Rainfall Mean When Condition True
            </option>
            <option value="difference_in_rainfall_percent">
              Difference Rainfall %
            </option>
            <option value="hits">Hits</option>
            <option value="hit_rate">Hit Rate</option>
            <option value="district_score">District Score</option>
            <option value="correlation_coefficient">
              Correlation Coefficient
            </option>
            <option value="p_value">P Value</option>

          </select>

        </div>

        <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />

      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  dropdownContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 6,
  },

  dropdown: {
    padding: 6,
  },
});