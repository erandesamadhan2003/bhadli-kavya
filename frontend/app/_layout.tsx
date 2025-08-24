import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: styles.header,
        headerTintColor: '#4A90E2',
        headerTitleStyle: styles.headerTitle,
        headerBackground: () => (
          <View style={styles.headerBackground} />
        ),
        contentStyle: styles.content,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
    color: '#4A90E2',
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffffff',
  },
  content: {
    backgroundColor: '#f8f9fa',
  },
});