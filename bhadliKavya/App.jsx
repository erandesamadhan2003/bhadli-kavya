import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import './global.css';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName="index" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" component={require('./app/index').default} />
          <Stack.Screen name="signup" component={require('./app/signup').default} />
          <Stack.Screen name="login" component={require('./app/login').default} />
          <Stack.Screen name="home" component={require('./app/home').default} />
          <Stack.Screen name="chatbot" component={require('./app/chatbot').default} />
        </Stack.Navigator>
        <StatusBar style="auto" />
    </NavigationContainer>
  );
}
