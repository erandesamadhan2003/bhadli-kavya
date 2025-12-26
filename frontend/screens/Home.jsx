import { Text, View } from "react-native";
import { SeasonCircle } from "../components/home/SeasonCircle";
import { Authentication } from "../components/home/Authentication";

const HomeScreen = () => {
  return (
    <View>
      <Authentication />
      <SeasonCircle />
      <Text>Welcome to the Home Screen!</Text>
    </View>
  );
};

export default HomeScreen;
