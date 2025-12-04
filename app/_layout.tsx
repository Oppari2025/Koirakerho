import { useColorScheme } from "@/hooks/use-color-scheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Drawer } from "expo-router/drawer";
import React from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Drawer screenOptions={{ headerShown: false }}>
        <Drawer.Screen
          name="(main)"
          options={{ drawerLabel: "Home", title: "Home" }}
        />
        <Drawer.Screen
          name="profileScreen"
          options={{ drawerLabel: "My Profile", title: "My Profile" }}
        />
      </Drawer>
    </ThemeProvider>
  );
}
