import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Welcome to the Login Screen!</Text>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
