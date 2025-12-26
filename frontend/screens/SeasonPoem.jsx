import { View, Text, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

export const SeasonPoem = () => {
  const route = useRoute();
  const { season } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{season || "Season"} Poem</Text>
      <Text style={styles.content}>This is the poem page for {season}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  content: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
