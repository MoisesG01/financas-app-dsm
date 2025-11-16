import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { Loading } from '../components/Loading';
import { colors } from '../theme/colors';

// Screens
import LoginScreen from '../screens/LoginScreen';
import CadastroScreen from '../screens/CadastroScreen';
import HomeScreen from '../screens/HomeScreen';
import TransacoesScreen from '../screens/TransacoesScreen';
import CategoriasScreen from '../screens/CategoriasScreen';
import PerfilScreen from '../screens/PerfilScreen';
import NovaTransacaoScreen from '../screens/NovaTransacaoScreen';
import EditarTransacaoScreen from '../screens/EditarTransacaoScreen';
import NovaCategoriaScreen from '../screens/NovaCategoriaScreen';
import EditarCategoriaScreen from '../screens/EditarCategoriaScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          backgroundColor: colors.surface,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={Number(size) || 24} color={color || colors.primary} />
          ),
        }}
      />
      <Tab.Screen
        name="Transacoes"
        component={TransacoesScreen}
        options={{
          tabBarLabel: 'Transações',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={Number(size) || 24} color={color || colors.primary} />
          ),
        }}
      />
      <Tab.Screen
        name="Categorias"
        component={CategoriasScreen}
        options={{
          tabBarLabel: 'Categorias',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder" size={Number(size) || 24} color={color || colors.primary} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={Number(size) || 24} color={color || colors.primary} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Cadastro"
              component={CadastroScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="NovaTransacao"
              component={NovaTransacaoScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="EditarTransacao"
              component={EditarTransacaoScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="NovaCategoria"
              component={NovaCategoriaScreen}
              options={{
                presentation: 'card',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="EditarCategoria"
              component={EditarCategoriaScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
