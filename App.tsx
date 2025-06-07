// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import tw from 'twrnc';

// Context e Screens
import { AuthProvider } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/Splash';
import MainAppTabs from './src/navigation/MainAppTabs';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  MainApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

import {
  DefaultTheme as NavigationDefaultTheme,
  Theme as NavigationTheme,
} from '@react-navigation/native';

const navigationTheme: NavigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: tw.color('yellow-500') || '#F59E42',
    background: tw.color('black') || '#000000',
    card: tw.color('gray-900') || '#1A1A1A',
    text: tw.color('white') || '#FFFFFF',
    border: tw.color('gray-800') || '#27272A',
    notification: tw.color('yellow-600') || '#D97706',
  },
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: tw.color('yellow-500'),
    accent: tw.color('yellow-600'),
    background: tw.color('black'),
    surface: tw.color('gray-900'),
    text: tw.color('white'),
    placeholder: tw.color('gray-500'),
  },
};

function AppNavigator() {
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen onLoginSuccess={() => navigation.replace('MainApp')} />
          )}
        </Stack.Screen>
        <Stack.Screen name="MainApp" component={MainAppTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <AppNavigator />
        <StatusBar style="light" backgroundColor={tw.color('black')} />
      </PaperProvider>
    </AuthProvider>
  );
}
