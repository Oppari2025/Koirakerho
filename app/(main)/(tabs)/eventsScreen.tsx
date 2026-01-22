import EventListScreen from "@/app/eventListScreen";
import TicketsScreen from "@/app/ticketsScreen";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from "react";

const Tab = createMaterialTopTabNavigator();

export default function eventsScreen(): React.JSX.Element {
    return (
        <Tab.Navigator
            initialRouteName="EventListScreen"
            screenOptions={{
                tabBarLabelStyle: {
                    fontWeight: "bold",
                },
                tabBarIndicatorStyle: {
                    backgroundColor: "#009200ff"
                }
            }}
        >
            <Tab.Screen
                name="EventListScreen"
                component={EventListScreen}
                options={{
                    title: "Listing"
                }}
            />
            <Tab.Screen
                name="TicketsScreen"
                component={TicketsScreen}
                options={{
                    title: "Tickets"
                }}
            />
        </Tab.Navigator>
    )
}