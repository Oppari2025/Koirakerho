import * as MapLibreRN from "@maplibre/maplibre-react-native";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

MapLibreRN.setConnected(true);

export default function navigatorScreen(): React.JSX.Element {
    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <MapLibreRN.MapView
                
                >

                </MapLibreRN.MapView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}