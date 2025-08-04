import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar telas (vou criar versões simplificadas)
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import FaturasScreen from './src/screens/FaturasScreen';
import FaturaDetailScreen from './src/screens/FaturaDetailScreen';
import WifiConfigScreen from './src/screens/WifiConfigScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#A020F0',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="Faturas"
              component={FaturasScreen}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="FaturaDetail"
              component={FaturaDetailScreen}
              options={{ title: '' }}
            />
            <Stack.Screen
              name="WifiConfig"
              component={WifiConfigScreen}
              options={{ title: '' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
