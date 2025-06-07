// src/navigation/MainAppTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import tw from 'twrnc';
import { Home, Archive, ClipboardList, MessageSquare } from 'lucide-react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import MeusCasos from '../screens/MeusCasos';
import EvidenciasList from '../screens/EvidenciasList';
import CadastroCaso from '../screens/CadastroCaso';
import EditEvidenciaModal from '../screens/EditEvidenciaModal';
import ContactScreen from '../screens/ContactScreen';
import CadastroEvidencia from '../screens/CadastroEvidencia';

// --- Tab Param List ---
export type MainTabParamList = {
  Home: undefined;
  GerenciarCasos: { statusF?: string } | undefined;
  Evidencias: undefined;
  Contact: undefined;
};

const Tab = createBottomTabNavigator < MainTabParamList > ();

function TabNavigator() {
  const theme = useTheme();
  const activeColor = tw.color('yellow-500');
  const inactiveColor = tw.color('gray-500');

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: tw`bg-gray-900 border-t border-gray-800`,
        tabBarLabelStyle: tw`text-xs font-semibold`,
        headerStyle: tw`bg-gray-900 border-b border-gray-800 shadow-sm`,
        headerTitleStyle: tw`text-yellow-500 font-bold`,
        headerTintColor: activeColor,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="GerenciarCasos"
        component={MeusCasos}
        options={{
          title: 'Casos',
          tabBarIcon: ({ color, size }) => <Archive color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Evidencias"
        component={EvidenciasList}
        options={{
          title: 'Evidências',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Contact"
        component={ContactScreen}
        options={{
          title: 'Contato',
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

// --- Stack Param List ---
export type MainAppStackParamList = {
  MainTabs: undefined;
  CadastroCaso: undefined;
  EditEvidencia: { id: string };
};

const Stack = createNativeStackNavigator < MainAppStackParamList > ();

export default function MainAppTabs() {
  const theme = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: tw.color('gray-900') || '#1A1A1A',
          borderBottomWidth: 1,
          borderBottomColor: tw.color('gray-800') || '#27272A',
        },
        headerTitleStyle: {
          color: tw.color('yellow-500') || '#F59E42',
          fontWeight: 'bold',
        },
        headerTintColor: tw.color('yellow-500') || '#F59E42',
        contentStyle: {
          backgroundColor: tw.color('black') || '#000000',
        },
      }}
    >
      {/* bottom tabs */}
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />

      {/* Stack screens not in tabs */}
      <Stack.Screen
        name="CadastroCaso"
        component={CadastroCaso}
        options={{
          title: 'Cadastrar Caso',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="CadastroEvidencia"
        component={CadastroEvidencia}
        options={{ title: 'Nova Evidência' }}
      />
      <Stack.Screen
        name="EditEvidencia"
        component={EditEvidenciaModal}
        options={{
          title: 'Editar Evidência',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}
