import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider } from '../src/context/AuthContext';

import '@/global.css';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
//Lisäsin ton colorScheme tähän väliin myös -J
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

function InnerRoot() {
  const { firebaseUser, loading } = useAuth();
  const colorScheme = useColorScheme();

  // näytetään latausindikaattori, kun autentikointitila on latautumassa
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {firebaseUser ? (
          <>
            <Stack.Screen name="(main)/(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(main)/eventScreen" options={{ headerShown: true, title: "Event" }} />
            <Stack.Screen name="(main)/addEventScreen" options={{ headerShown: true, title: "Add Event" }} />
            <Stack.Screen name="(main)/dogProfileScreen" options={{ headerShown: false, title: "Dog Profile" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="/login" options={{ headerShown: false }} />
            <Stack.Screen name="/register" options={{ headerShown: false }} />
          </>
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}