import { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChat, useSessions, useAuth } from "../hooks";
import { MessageBubble, ChatInput, SessionsList } from "../components/chat";

const ChatScreen = () => {
  const { user, isAuthenticated } = useAuth();
  const {
    messages,
    currentSessionId,
    isLoading,
    isSending,
    sendMessage,
    getChatHistory,
    deleteMessage,
    setCurrentSessionId,
    clearMessages,
  } = useChat();

  const { sessions, createSession, getSessions, endSession } = useSessions();

  const [showSessions, setShowSessions] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("🔵 Chat mounted, loading sessions");
      loadSessions();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Only load history when we have a current session
    if (currentSessionId && isAuthenticated) {
      console.log("🔵 Session changed to:", currentSessionId);
      loadChatHistory();
    }
  }, [currentSessionId]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadSessions = async () => {
    try {
      await getSessions();
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  const loadChatHistory = async () => {
    if (!currentSessionId) {
      console.log("⚠️ No session selected, skipping history load");
      return;
    }

    try {
      console.log("🔵 Loading chat history for session:", currentSessionId);
      await getChatHistory(50);
    } catch (err) {
      console.error("❌ Failed to load chat history:", err);
    }
  };

  const handleSend = async (message) => {
    if (!currentSessionId) {
      Alert.alert("No Session", "Please create or select a session first");
      return;
    }

    try {
      console.log("🔵 Sending message to session:", currentSessionId);
      await sendMessage(message, currentSessionId);
      flatListRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMessage(messageId);
            } catch (err) {
              Alert.alert("Error", "Failed to delete message.");
            }
          },
        },
      ]
    );
  };

  const handleCreateSession = async () => {
    try {
      console.log("🔵 Creating new session");
      const newSession = await createSession("New Chat");
      console.log("✅ Session created:", newSession.session.session_id);
      setCurrentSessionId(newSession.session.session_id);
      clearMessages();
      setShowSessions(false);
      Alert.alert("Success", "New chat session created!");
    } catch (err) {
      console.error("❌ Failed to create session:", err);
      Alert.alert("Error", "Failed to create session.");
    }
  };

  const handleSelectSession = async (sessionId) => {
    console.log("🔵 Selecting session:", sessionId);
    setCurrentSessionId(sessionId);
    clearMessages();
    setShowSessions(false);
    // History will be loaded by useEffect when currentSessionId changes
  };

  const handleEndSession = async (sessionId) => {
    Alert.alert("End Session", "Are you sure you want to end this session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "End",
        style: "destructive",
        onPress: async () => {
          try {
            await endSession(sessionId);
            await loadSessions();
            Alert.alert("Success", "Session ended successfully!");
          } catch (err) {
            Alert.alert("Error", "Failed to end session.");
          }
        },
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            Please login to use the chat feature
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.sessionsButton}
          onPress={() => {
            console.log("🔵 Opening sessions list");
            setShowSessions(true);
          }}
        >
          <Text style={styles.sessionsButtonText}>☰ Sessions</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Chat {currentSessionId ? `(Session Active)` : "(No Session)"}
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Show message if no session */}
      {!currentSessionId && (
        <View style={styles.noSessionBanner}>
          <Text style={styles.noSessionText}>
            Please create or select a session to start chatting
          </Text>
        </View>
      )}

      {/* Messages List */}
      {isLoading && messages.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.message_id || `msg-${index}`}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              onDelete={handleDeleteMessage}
              canDelete={item.role === "user"}
            />
          )}
          contentContainerStyle={styles.messagesList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {currentSessionId
                  ? "No messages yet. Start a conversation!"
                  : "Please select or create a session"}
              </Text>
            </View>
          }
        />
      )}

      {/* Chat Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isSending || !currentSessionId}
      />

      {/* Sessions Modal */}
      <Modal
        visible={showSessions}
        animationType="slide"
        onRequestClose={() => setShowSessions(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <SessionsList
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={handleSelectSession}
            onCreateSession={handleCreateSession}
            onEndSession={handleEndSession}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSessions(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionsButton: {
    padding: 8,
  },
  sessionsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  messagesList: {
    paddingVertical: 12,
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  closeButton: {
    backgroundColor: "#6B4CE6",
    padding: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noSessionBanner: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    margin: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFA800",
  },
  noSessionText: {
    fontSize: 14,
    color: "#856404",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ChatScreen;
