import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppRoutes } from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext'; // 1. Importa o teu novo Contexto

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </NavigationContainer>
  );
}