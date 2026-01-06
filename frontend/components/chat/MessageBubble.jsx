import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const MessageBubble = ({ message, onDelete, canDelete = false }) => {
  const isUser = message.role === "user";
  const isOptimistic = message.message_id?.startsWith("temp-");

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.modelContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.modelBubble,
          isOptimistic && styles.optimisticBubble,
        ]}
      >
        <Text
          style={[styles.text, isUser ? styles.userText : styles.modelText]}
        >
          {message.content}
        </Text>

        <Text style={styles.timestamp}>
          {new Date(message.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {canDelete && !isOptimistic && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(message.message_id)}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
  },
  userContainer: {
    alignItems: "flex-end",
  },
  modelContainer: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#6B4CE6",
    borderBottomRightRadius: 4,
  },
  modelBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  optimisticBubble: {
    opacity: 0.6,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  modelText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  deleteButton: {
    marginTop: 4,
    padding: 4,
  },
  deleteText: {
    fontSize: 16,
  },
});
