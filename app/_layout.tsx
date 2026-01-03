import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../src/context/AuthContext';

import '@/global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer>
          <Drawer.Screen
            name="(main)"
            options={{ drawerLabel: 'Home', title: 'Home', headerShown: false }}
          />
          <Drawer.Screen
            name="profileScreen"
            options={{ drawerLabel: 'My Profile', title: 'My Profile', headerShown: false }}
          />
        </Drawer>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
