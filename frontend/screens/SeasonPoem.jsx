import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePoems } from "../hooks";

export const SeasonPoem = () => {
  const navigation = useNavigation();
  const { getPoems, isLoading, error } = usePoems();

  const [allPoems, setAllPoems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    loadPoems();
  }, []);

  const loadPoems = async () => {
    try {
      const response = await getPoems();
      setAllPoems(response.poems || []);
    } catch (err) {
      console.error("Failed to load poems:", err);
    }
  };

  const loadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const poems = allPoems.slice(0, visibleCount);

  if (isLoading && allPoems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6B4CE6" />
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
        <View style={styles.header}>
          <Text style={styles.title}>All Poems</Text>
          <Text style={styles.subtitle}>
            Showing {poems.length} of {allPoems.length}
          </Text>
        </View>

        {/* Poems */}
        <View style={styles.poemsContainer}>
          {poems.map((poem, index) => (
            <TouchableOpacity
              key={poem.poem_id}
              style={styles.poemCard}
              activeOpacity={0.8}
              onPress={() => {
                const loc = poem.location?.toLowerCase();

                if (loc === "gujarat" || loc === "uttar pradesh") {
                  navigation.navigate("MapScreen", {
                    poemId: poem.poem_id,
                    location: poem.location,
                    poem: poem.poem,
                    season: poem.season,
                  });
                } else {
                  alert(
                    "Map is available only for Gujarat and Uttar Pradesh poems 🌍",
                  );
                }
              }}
            >
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
            </TouchableOpacity>
          ))}
        </View>

        {/* Load More */}
        {visibleCount < allPoems.length && (
          <TouchableOpacity style={styles.loadMoreButton} onPress={loadMore}>
            <Text style={styles.loadMoreText}>Load More Poems</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 30,
    backgroundColor: "#6B4CE6",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 6,
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
    marginBottom: 12,
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
  },
  poemText: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
    fontStyle: "italic",
    marginBottom: 16,
  },
  poemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  loadMoreButton: {
    marginHorizontal: 40,
    backgroundColor: "#6B4CE6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  loadMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6B4CE6",
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    color: "#fff",
  },
});