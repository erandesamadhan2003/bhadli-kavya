import { ExpoRoot } from 'expo-router';
import { registerRootComponent } from 'expo';

const ctx = require.context('./app');
function Main() {
  return <ExpoRoot context={ctx} />;
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Main);
