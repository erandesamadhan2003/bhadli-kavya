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

  const [metric, setMetric] = useState("score");

  const location = route?.params?.location || "Gujarat";

  const normalized = location.toLowerCase().replace(/\s/g, "");

  const isUP = normalized === "uttarpradesh";

  const stateName = isUP ? "UttarPradesh" : "Gujarat";
  const stateId = isUP ? 2 : 1;

  // ======================================================
  // 🌐 WEB VERSION
  // ======================================================
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

        const features = (data.features || []).filter(
          (f) => f.properties && f.properties.NAME_1 === stateName
        );

        const token = localStorage.getItem("access_token");

        fetch(`http://localhost:8000/geo/stats/state/${stateId}`, {
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

            features.forEach((f) => {

              const name = f.properties.NAME_2?.toLowerCase();
              const info = scoreMap[name];

              if (info && info[metric] !== undefined) {

                const value = info[metric];

                const normalizedValue =
                  typeof value === "number"
                    ? Math.max(0, Math.min(1, value))
                    : 0;

                const hue = Math.round(normalizedValue * 120);

                f.properties._color = `hsl(${hue},70%,55%)`;
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
                  fillColor: feature?.properties?._color || "#eee",
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
          })
          .catch((err) => console.error("Stats error:", err));
      })
      .catch((err) => console.error("Geojson error:", err));

    return () => map.remove();
  }, [location, metric]);

  // ======================================================
  // 🌐 WEB RENDER
  // ======================================================
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>

        <div style={styles.dropdownContainer}>
          <select
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
            style={styles.dropdown}
          >
            <option value="total_years">Total_Years</option>
            <option value="condition_years">Condition_Years</option>
            <option value="rainfall_mean">Rainfall_mean</option>
            <option value="rainfall_mean_when_condition_is_true">
              Rainfall_mean_when_condition_is_true
            </option>
            <option value="difference_in_rainfall_percent">
              Difference_in_Rainfall_percent
            </option>
            <option value="hits">Hits</option>
            <option value="hit_rate">Hit_rate</option>
            <option value="score">District_Score</option>
            <option value="correlation_cofficient">
              Correlation_cofficient
            </option>
            <option value="p_value">p-value</option>
          </select>
        </div>

        <div ref={mapRef} style={{ height: "100vh", width: "100%" }} />

      </View>
    );
  }

  // ======================================================
  // 📱 MOBILE VERSION
  // ======================================================

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
<style>
body { margin:0 }
#map { height:100vh;width:100% }
</style>
</head>

<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>

<script>

const stateName="${stateName}";
const stateId=${stateId};
const metric="${metric}";

const map=L.map("map",{zoomControl:true,attributionControl:false});

Promise.all([
fetch("gujarat_district.geojson").then(r=>r.json()),
fetch("http://localhost:8000/geo/stats/state/"+stateId).then(r=>r.json())
]).then(([geo,stats])=>{

const scoreMap={};
stats.forEach(s=>{
scoreMap[s.district_name.toLowerCase()]=s;
});

const features=(geo.features||[]).filter(
f=>f.properties && f.properties.NAME_1===stateName
);

features.forEach(f=>{

const name=(f.properties.NAME_2||"").toLowerCase();
const info=scoreMap[name];

if(info && info[metric]!==undefined){

const value=info[metric];
const normalized=Math.max(0,Math.min(1,value));
const hue=Math.round(normalized*120);

f.properties._color="hsl("+hue+",70%,55%)";
f.properties._value=value;

}else{

f.properties._color="#eee";
f.properties._value="-";

}

});

const geoLayer=L.geoJSON(
{type:"FeatureCollection",features},
{
style:function(feature){
return{
color:"#000",
weight:1,
fillColor:feature.properties._color,
fillOpacity:1
};
},
onEachFeature:function(feature,layer){
layer.bindTooltip(
"<b>"+feature.properties.NAME_2+"</b><br/>"+
metric+": "+feature.properties._value
);
}
}
).addTo(map);

if(features.length>0){
map.fitBounds(geoLayer.getBounds());
}

});

</script>

</body>
</html>
`;

  return (
    <View style={styles.container}>

      <View style={styles.dropdownContainer}>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option value="total_years">Total_Years</option>
          <option value="condition_years">Condition_Years</option>
          <option value="rainfall_mean">Rainfall_mean</option>
          <option value="rainfall_mean_when_condition_is_true">
            Rainfall_mean_when_condition_is_true
          </option>
          <option value="difference_in_rainfall_percent">
            Difference_in_Rainfall_percent
          </option>
          <option value="hits">Hits</option>
          <option value="hit_rate">Hit_rate</option>
          <option value="score">District_Score</option>
          <option value="correlation_cofficient">
            Correlation_cofficient
          </option>
          <option value="p_value">p-value</option>
        </select>
      </View>

      <WebView originWhitelist={["*"]} source={{ html: htmlContent }} />

    </View>
  );
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