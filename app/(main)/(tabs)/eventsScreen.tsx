import EventListScreen from "@/app/(main)/eventListScreen";
import TicketsScreen from "@/app/(main)/ticketsScreen";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();

export default function eventsScreen(): React.JSX.Element {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            style={{ paddingTop: insets.top }}
            initialRouteName="EventListScreen"
            screenOptions={{
                tabBarLabelStyle: {
                    fontWeight: "bold",
                },
                tabBarIndicatorStyle: {
                    backgroundColor: "green"
                }
            }}
        >
            <Tab.Screen
                name="EventListScreen"
                component={EventListScreen}
                options={{
                    title: "Listaus"
                }}
            />
            <Tab.Screen
                name="TicketsScreen"
                component={TicketsScreen}
                options={{
                    title: "Liput"
                }}
            />
        </Tab.Navigator>
    )
}