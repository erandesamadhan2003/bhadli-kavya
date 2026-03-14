import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { ActivityIndicator, View, Text } from "react-native";
import { store } from "./store/store";

import HomeScreen from "./screens/Home";
import CalenderScreen from "./screens/Calender";
import SignupScreen from "./screens/auth/Signup";
import LoginScreen from "./screens/auth/Login";
import { SeasonPoem } from "./screens/SeasonPoem";
import { MapScreen } from "./screens/MapScreen";
import ChatScreen from "./screens/Chat";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: [
    "http://localhost:8081",
    "http://192.168.31.82:8081",
    "myapp://",
  ],
  config: {
    screens: {
      home: "/",
      calender: "/calender",
      signup: "/signup",
      login: "/login",
      seasonPoem: "/season-poem/:season",
      MapScreen: "/map", // ✅ corrected to match screen name
      chat: "/chat",
    },
  },
};

const LoadingScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    }}
  >
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={{ marginTop: 12, color: "#666" }}>Loading...</Text>
  </View>
);

function AppNavigator() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 1000);
  }, []);

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        linking={linking}
        onReady={() => console.log("Navigation Ready")}
        onStateChange={(state) =>
          console.log("Navigation State:", state)
        }
      >
        <Stack.Navigator
          initialRouteName="home"
          screenOptions={{
            headerShown: true,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen
            name="home"
            component={HomeScreen}
            options={{ title: "Home" }}
          />

          <Stack.Screen
            name="calender"
            component={CalenderScreen}
            options={{ title: "Calendar" }}
          />

          <Stack.Screen
            name="signup"
            component={SignupScreen}
            options={{ title: "Sign Up" }}
          />

          <Stack.Screen
            name="login"
            component={LoginScreen}
            options={{ title: "Login" }}
          />

          <Stack.Screen
            name="seasonPoem"
            component={SeasonPoem}
            options={{ title: "Season Poem" }}
          />

          <Stack.Screen
            name="chat"
            component={ChatScreen}
            options={{ title: "Chat" }}
          />

          {/* ✅ Added MapScreen properly */}
          <Stack.Screen
            name="MapScreen"
            component={MapScreen}
            options={{ title: "Map" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}