import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ title: "Sign Up" }} />
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen name="chatbot" options={{ title: "Chat Bot" }} />
        </Stack>
    );
}