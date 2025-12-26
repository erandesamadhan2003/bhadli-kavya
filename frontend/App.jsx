import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import HomeScreen from "./screens/Home";
import CalenderScreen from "./screens/Calender";
import SignupScreen from "./screens/auth/Signup";
import LoginScreen from "./screens/auth/Login";
import { SeasonPoem } from "./screens/SeasonPoem";

const Stack = createNativeStackNavigator();

const linking = {
  prefixes: ["http://localhost:8081", "myapp://"],
  config: {
    screens: {
      home: "/",
      calender: "/calender",
      signup: "/signup",
      login: "/login",
      seasonPoem: "/season-poem/:season",
    },
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="home">
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="calender" component={CalenderScreen} />
          <Stack.Screen name="signup" component={SignupScreen} />
          <Stack.Screen name="login" component={LoginScreen} />
          <Stack.Screen name="seasonPoem" component={SeasonPoem} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
