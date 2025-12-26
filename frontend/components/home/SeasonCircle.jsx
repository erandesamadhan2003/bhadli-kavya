import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");
const CIRCLE_SIZE = Math.min(width * 0.8, 300);
const CENTER = CIRCLE_SIZE / 2;
const RADIUS = CIRCLE_SIZE / 2;

const seasons = [
  { name: "Spring", color: "#A8E6CF", angle: 0 },
  { name: "Summer", color: "#FFD93D", angle: 60 },
  { name: "Monsoon", color: "#6BCB77", angle: 120 },
  { name: "Autumn", color: "#FF8C42", angle: 180 },
  { name: "PreWinter", color: "#B088F9", angle: 240 },
  { name: "Winter", color: "#89CFF0", angle: 300 },
];

export const SeasonCircle = () => {
  const navigation = useNavigation();

  const createPath = (startAngle, endAngle) => {
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = CENTER + RADIUS * Math.cos(startRad);
    const y1 = CENTER + RADIUS * Math.sin(startRad);
    const x2 = CENTER + RADIUS * Math.cos(endRad);
    const y2 = CENTER + RADIUS * Math.sin(endRad);

    return `M ${CENTER} ${CENTER} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (angle) => {
    const midAngle = (angle + 30 - 90) * (Math.PI / 180);
    const textRadius = RADIUS * 0.65;
    return {
      x: CENTER + textRadius * Math.cos(midAngle),
      y: CENTER + textRadius * Math.sin(midAngle),
    };
  };

  const handleSeasonPress = (seasonName) => {
    navigation.navigate("seasonPoem", { season: seasonName });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select a Season</Text>
      <Svg
        width={CIRCLE_SIZE}
        height={CIRCLE_SIZE}
        viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
      >
        <G>
          {seasons.map((season, index) => {
            const startAngle = season.angle;
            const endAngle = season.angle + 60;
            const path = createPath(startAngle, endAngle);
            const textPos = getTextPosition(season.angle);

            return (
              <G key={season.name}>
                <Path
                  d={path}
                  fill={season.color}
                  stroke="#fff"
                  strokeWidth="2"
                  onPress={() => handleSeasonPress(season.name)}
                />
                <SvgText
                  x={textPos.x}
                  y={textPos.y}
                  fontSize="14"
                  fontWeight="bold"
                  fill="#333"
                  textAnchor="middle"
                  onPress={() => handleSeasonPress(season.name)}
                >
                  {season.name}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
});
