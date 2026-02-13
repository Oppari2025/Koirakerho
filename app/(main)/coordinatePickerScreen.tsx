import { OSM_RASTER_STYLE } from "@/components/OSM_RASTER_STYLE";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

MapLibreRN.setConnected(true);
//MapLibreRN.setAccessToken(null);

export default function coordinatePickerScreen(): React.JSX.Element {
    // routing
    const router = useRouter();
    const routerParams = useLocalSearchParams<{ lon: string, lat: string, searchText: string }>();
    console.log("router", routerParams);


    // state
    const [selectedLatitude, setSelectedLatitude] = useState<number>();
    const [selectedLongitude, setSelectedLongitude] = useState<number>();
    const [followUserLocation, setFollowUserLocation] = useState<boolean>(false);
    const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState<boolean>(false);
    const [isFetchingLocationPermission, setIsFetchingLocationPermission] = useState<boolean>(false);
    const [locationWatchId, setLocationWatchId] = React.useState<number>();
    const [pickedCoordinates, setPickedCoordinates] = React.useState<number[]>();


    // effects

    useEffect(() => {
        (async () => {
            let isLocationPermissionGranted = false;
            if (Platform.OS === "android") {
                isLocationPermissionGranted = await MapLibreRN.requestAndroidLocationPermissions();
            }
            else if (Platform.OS === "ios") {
                // TODO: Request permission on iOS
                isLocationPermissionGranted = false;
            }

            setIsLocationPermissionGranted(isLocationPermissionGranted);
            setIsFetchingLocationPermission(false);

            if (isLocationPermissionGranted) {

            }

            return () => {

            };
        })();
    }, []);

    async function onPressSearchBar() {
        router.navigate("/(main)/placeSearchScreen");
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <MapLibreRN.MapView
                    style={{ flex: 1 }}
                    mapStyle={OSM_RASTER_STYLE}
                    localizeLabels={true}
                    attributionEnabled={true}
                    attributionPosition={{ top: 72, right: 8 }}
                    logoEnabled={true}
                    logoPosition={{ top: 100, right: 48 }}
                    compassEnabled={true}
                    compassViewMargins={{ x: 8, y: 160 }}
                    zoomEnabled={true}
                    rotateEnabled={true}
                    scrollEnabled={true}
                    onPress={(e: any) => {
                        console.log("Pressed:", e.geometry.coordinates);
                        setPickedCoordinates(e.geometry.coordinates)
                    }}
                >
                    <MapLibreRN.Camera
                        followUserLocation={followUserLocation}
                        followZoomLevel={16}
                        onUserTrackingModeChange={(event) => {
                            if (!event.nativeEvent.payload.followUserLocation) {
                                setFollowUserLocation(false);
                            }
                        }}
                    />

                    {
                        pickedCoordinates && (
                            <MapLibreRN.MarkerView
                                coordinate={pickedCoordinates}
                                allowOverlap={true}
                            >
                                <View style={{ flex: 0, borderWidth: 1, borderColor: "black", backgroundColor: "red" }}>
                                    <MaterialIcons
                                        name="location-on"
                                        style={{ fontSize: 32, width: "auto", height: "auto", alignSelf: "baseline", justifyContent: "center", color: "red" }}
                                    />
                                </View>

                            </MapLibreRN.MarkerView>
                        )
                    }

                </MapLibreRN.MapView>

                <View style={styles.mapOverlay}>
                    <View style={{ width: "100%", backgroundColor: "white", padding: 8, gap: 8, borderRadius: 10, borderColor: "gray", borderWidth: 1 }}>
                        <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                            onPress={onPressSearchBar}
                        >
                            <MaterialIcons
                                name="search"
                                style={{ fontSize: 32, color: "black" }}
                            />
                            <Text style={{ color: routerParams?.searchText ? "black" : "gray", fontSize: 16, borderWidth: 1, borderColor: "black", borderRadius: 10, padding: 8, flex: 1 }}>
                                {routerParams?.searchText ? routerParams?.searchText : "Hae paikkaa"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 1 }} />

                    <TouchableOpacity style={styles.okButton}>
                        <Text style={styles.okButtonText}>
                            OK
                        </Text>
                    </TouchableOpacity>
                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    text: {
        color: "black"
    },
    mapOverlay: {
        position: "absolute",
        flex: 1,
        width: "100%",
        height: "100%",
        pointerEvents: "box-none",
        padding: 8,
        zIndex: 2,
        alignItems: "center",
    },
    okButton: {
        backgroundColor: "green",
        borderRadius: 10,
        width: 128,
        height: 64,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "gray"
    },
    okButtonText: {
        color: "black",
        fontWeight: "bold",
        fontSize: 16
    }
});