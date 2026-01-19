import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import React from 'react';

export const unstable_settings = {
    anchor: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (

        <GluestackUIProvider mode="dark">
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="eventScreen" options={{ headerShown: true, title: "Event" }} />
                    <Stack.Screen name="addEventScreen" options={{ headerShown: true, title: "Add Event" }} />
                    <Stack.Screen name="ticketScreen" options={{ headerShown: true, title: "Ticket" }} />
                    <Stack.Screen name="dogProfileScreen" options={{ headerShown: false, title: "Dog Profile" }} />
                    <Stack.Screen name="addDogScreen" options={{ headerShown: false, title: "Add Dog" }} />
                    <Stack.Screen name="friendChatScreen" options={{ headerShown: true, title: "Ronald Richards" }} /> {/* Tittle should be dynamic */}
                </Stack>
                <StatusBar style="auto" />
            
            </ThemeProvider>
        </GluestackUIProvider>

    );
}
