import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export const SessionsList = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onEndSession,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat Sessions</Text>
        <TouchableOpacity style={styles.newButton} onPress={onCreateSession}>
          <Text style={styles.newButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {sessions.map((session) => (
          <TouchableOpacity
            key={session.session_id}
            style={[
              styles.sessionItem,
              currentSessionId === session.session_id &&
                styles.sessionItemActive,
            ]}
            onPress={() => onSelectSession(session.session_id)}
          >
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionTitle}>
                {session.title || "Untitled Session"}
              </Text>
              <Text style={styles.sessionTime}>
                {new Date(session.started_at).toLocaleDateString()}
              </Text>
            </View>

            {session.status === "active" && (
              <TouchableOpacity
                style={styles.endButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEndSession(session.session_id);
                }}
              >
                <Text style={styles.endButtonText}>End</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        {sessions.length === 0 && (
          <Text style={styles.emptyText}>No sessions yet. Start chatting!</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#6B4CE6",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  newButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  newButtonText: {
    color: "#6B4CE6",
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  sessionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sessionItemActive: {
    backgroundColor: "#F3EFFF",
    borderLeftWidth: 4,
    borderLeftColor: "#6B4CE6",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 12,
    color: "#666",
  },
  endButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  endButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 14,
  },
});
