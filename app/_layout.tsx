import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

import { AuthProvider, useAuth } from "../src/context/AuthContext";


import { useColorScheme } from '@/hooks/use-color-scheme';

import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthRedirector() {
  const { firebaseUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!firebaseUser) {
      
    } else {
      router.replace('/')
    }
  }, [firebaseUser, loading])

  return null
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)/register" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>

        <AuthRedirector />

        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
