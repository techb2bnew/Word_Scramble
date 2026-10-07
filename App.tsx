import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigations/AppNavigator';
import { gameBgColor } from './src/constant/Color';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={gameBgColor} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
