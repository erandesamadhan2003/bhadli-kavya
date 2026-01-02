import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks";
import { SeasonCircle } from "../components/home/SeasonCircle";
import { Authentication } from "../components/home/Authentication";

const HomeScreen = ({ navigation }) => {
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace("home");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>भदली काव्य</Text>
          <Text style={styles.subtitle}>Bhadli Kavya</Text>
          <Text style={styles.tagline}>
            Discover timeless poetry through seasons
          </Text>
        </View>

        {/* Welcome/Guest Card */}
        <View style={styles.content}>
          {isAuthenticated && user ? (
            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeText}>नमस्ते, {user.name}!</Text>
              <Text style={styles.welcomeSubtext}>
                Explore seasonal poetry and culture
              </Text>
            </View>
          ) : (
            <View style={styles.guestSection}>
              <Authentication />
            </View>
          )}

          {/* Season Circle Selector */}
          <View style={styles.seasonSection}>
            <Text style={styles.sectionTitle}>Explore by Season</Text>
            <SeasonCircle />
            <Text style={styles.sectionSubtext}>
              Tap any season to discover its poetry
            </Text>
          </View>

          {/* Quick Actions Section */}
          {isAuthenticated && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Access</Text>

              <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate("calender")}
              >
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>📅</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Calendar</Text>
                  <Text style={styles.cardDesc}>
                    View Hindu & Gregorian calendar
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate("seasonPoem", { season: "spring" })
                }
              >
                <View style={styles.cardIconContainer}>
                  <Text style={styles.cardIcon}>📖</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Poetry Collection</Text>
                  <Text style={styles.cardDesc}>Browse all seasonal poems</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Guest Quick Links */}
          {!isAuthenticated && (
            <View style={styles.guestLinksSection}>
              <Text style={styles.sectionTitle}>Explore as Guest</Text>
              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() => navigation.navigate("calender")}
              >
                <Text style={styles.outlineButtonText}>📅 Browse Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.outlineButton}
                onPress={() =>
                  navigation.navigate("seasonPoem", { season: "spring" })
                }
              >
                <Text style={styles.outlineButtonText}>
                  🌸 View Spring Poems
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Logout Button for Authenticated Users */}
          {isAuthenticated && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa" },
  scrollContent: { flexGrow: 1, paddingBottom: 30 },
  header: {
    backgroundColor: "#007AFF",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 22,
    color: "#e3f2fd",
    marginBottom: 8,
    fontWeight: "500",
  },
  tagline: {
    fontSize: 14,
    color: "#bbdefb",
    fontStyle: "italic",
    textAlign: "center",
  },
  content: { padding: 20 },
  welcomeCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  welcomeSubtext: { fontSize: 15, color: "#666", lineHeight: 22 },
  guestSection: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  seasonSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  sectionSubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
    fontStyle: "italic",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#f0f7ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardIcon: { fontSize: 28 },
  cardContent: { flex: 1, justifyContent: "center" },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  cardDesc: { fontSize: 14, color: "#666", lineHeight: 20 },
  guestLinksSection: {
    marginBottom: 20,
  },
  outlineButton: {
    backgroundColor: "transparent",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
    marginBottom: 12,
  },
  outlineButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#ff3b30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default HomeScreen;
