import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePoems } from "../hooks";

export const SeasonPoem = () => {
  const route = useRoute();
  const { season } = route.params || {};
  const { getPoemsBySeason, isLoading, error } = usePoems();
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    loadPoems();
  }, [season]);

  const loadPoems = async () => {
    try {
      const response = await getPoemsBySeason(season, 5); // Changed to 5
      setPoems(response.poems || []);
    } catch (err) {
      console.error("Failed to load poems:", err);
    }
  };

  const getSeasonColor = () => {
    const colors = {
      Spring: "#4CAF50",
      Summer: "#FFA800",
      Monsoon: "#00BCD4",
      Autumn: "#FF6B9D",
      PreWinter: "#9C27B0",
      Winter: "#2196F3",
    };
    return colors[season] || "#6B4CE6";
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={getSeasonColor()} />
        <Text style={styles.loadingText}>Loading poems...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          Failed to load poems. Please try again.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadPoems}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: getSeasonColor() }]}>
          <Text style={styles.seasonTitle}>{season} Season</Text>
          <Text style={styles.poemCount}>
            {poems.length} {poems.length === 1 ? "Poem" : "Poems"} Found
          </Text>
        </View>

        {/* Poems List */}
        <View style={styles.poemsContainer}>
          {poems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No poems found for {season} season
              </Text>
              <Text style={styles.emptySubtext}>
                Please check back later or explore other seasons
              </Text>
            </View>
          ) : (
            poems.map((poem, index) => (
              <View key={poem.poem_id} style={styles.poemCard}>
                <View style={styles.poemHeader}>
                  <Text style={styles.poemNumber}>#{index + 1}</Text>
                  <View style={styles.poemMeta}>
                    <Text style={styles.metaText}>🌐 {poem.language}</Text>
                    <Text style={styles.metaText}>📍 {poem.location}</Text>
                  </View>
                </View>
                <Text style={styles.poemText}>{poem.poem}</Text>
                <View style={styles.poemFooter}>
                  <Text style={styles.seasonTag}>{poem.season}</Text>
                  <Text style={styles.dateText}>
                    {new Date(poem.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    padding: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  seasonTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  poemCount: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  poemsContainer: {
    padding: 20,
  },
  poemCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  poemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  poemNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B4CE6",
  },
  poemMeta: {
    alignItems: "flex-end",
  },
  metaText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  poemText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
    marginBottom: 16,
    fontStyle: "italic",
  },
  poemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  seasonTag: {
    backgroundColor: "#F3EFFF",
    color: "#6B4CE6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#6B4CE6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
