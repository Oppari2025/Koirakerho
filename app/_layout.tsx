import StripeProvider from '@/components/stripeProvider';
import '@/global.css';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
        <AuthProvider>
    <StripeProvider>
      <GestureHandlerRootView>
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
      </GestureHandlerRootView>
    </StripeProvider>
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