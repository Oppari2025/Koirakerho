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
                <Drawer>
                    <Drawer.Screen
                        name="(main)"
                        options={{ drawerLabel: "Home", title: "Home" }}
                        />
                        <Drawer.Screen
                        name="profileScreen"
                        options={{ drawerLabel: "My Profile", title: "My Profile" }}
                    />
                </Drawer>
                

                <StatusBar style="auto" />
            
            </ThemeProvider>
        </GluestackUIProvider>

    );
}
