import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';
import { Drawer } from 'expo-router/drawer';

import { AuthProvider, useAuth } from "../src/context/AuthContext";


import { useColorScheme } from '@/hooks/use-color-scheme';

import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Komponentti, joka ohjaa käyttäjän oikealle sivulle autentikointitilasta riippuen
function AuthRedirector() {
  const { firebaseUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!firebaseUser) {
      
    } else {
      router.replace('/')
    }
  }, [firebaseUser, loading, router])

  return null
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Drawer screenOptions={{ headerShown: false }}>
          <Drawer.Screen name="(main)" options={{ drawerLabel: "Home", headerShown: false }} />
        </Drawer>

        <AuthRedirector />

        <StatusBar style="auto" />
        </ThemeProvider>
    </AuthProvider>
  );
}
