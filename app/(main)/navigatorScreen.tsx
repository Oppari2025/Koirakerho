import { OSM_RASTER_STYLE } from "@/components/OSM_RASTER_STYLE";
import PlaceSearchModal from "@/components/placeSearchModal";
import * as OSRM from "@/src/osrm/osrm";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function navigatorScreen(): React.JSX.Element {
    // routing
    const router = useRouter();
    const routerParams = useLocalSearchParams<{ latitude: string, longitude: string, destinationName: string }>();

    // state
    const [followUserLocation, setFollowUserLocation] = useState<boolean>(false);
    const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState<boolean>(false);
    const [isFetchingLocationPermission, setIsFetchingLocationPermission] = useState<boolean>(false);
    const [locationWatchId, setLocationWatchId] = React.useState<number>();
    const [startLocationName, setStartLocationName] = useState<string>("");
    const [destination, setDestination] = useState<string>(routerParams.destinationName || "");
    const [isModeSelectModalVisible, setIsModeSelectModalVisible] = useState<boolean>(false);
    const [startLocationCoordinates, setStartLocationCoordinates] = React.useState<number[]>();
    const [destinationCoordinates, setDestinationCoordinates] = React.useState<number[]>([Number(routerParams.longitude), Number(routerParams.latitude)]);
    const [routingMode, setRoutingMode] = useState<OSRM.RouteType>("car");
    const [errorMessage, setErrorMessage] = useState<string>();
    const [route, setRoute] = useState<GeoJSON.LineString>();
    const [isLoadingRoute, setIsLoadingRoute] = useState<boolean>(false);
    const [isLocationOn, setIsLocationOn] = useState<boolean>(false);
    const [isCoordinatePickerModalVisible, setIsCoordinatePickerModalVisible] = useState<boolean>(false);
    const [coordinatePickerType, setCoordinatePickerType] = useState<string>("");
    const [userLocation, setUserLocation] = useState<MapLibreRN.Location>();
    const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(0);

    // refs

    const bottomSheetRef = useRef<BottomSheet>(null);
    const userLocationRef = useRef<MapLibreRN.UserLocationRef>(null);

    // memos

    const snapPoints = React.useMemo(() => ["20%", "30%", "40%", "50%", "60%", "70%", "80%"], []);

    // callbacks

    const handleSheetChanges = React.useCallback((index: number) => {
        console.log('handleSheetChanges', index);
        setBottomSheetIndex(index);
    }, []);

    // presses

    async function onPressLocation() {
        setIsLocationOn(!isLocationOn);
    }

    async function onPressFollowUserLocation() {
        if (!isLocationOn) {
            Alert.alert("Seuraa sijaintiani", "Ota paikannus käyttöön ensin.");
            return;
        }

        setFollowUserLocation(!followUserLocation);
    }

    async function fetchLocationPermission(): Promise<boolean> {
        let isLocationPermissionGranted = false;
        if (Platform.OS === "android") {
            isLocationPermissionGranted = await MapLibreRN.requestAndroidLocationPermissions();
        }
        else if (Platform.OS === "ios") {
            // TODO: Request permission on iOS
            isLocationPermissionGranted = false;
        }

        return isLocationPermissionGranted;
    }

    async function onPressStartLocation() {
        setCoordinatePickerType("start-location");
        setIsCoordinatePickerModalVisible(true);
    }

    async function onPressDestination() {
        setCoordinatePickerType("destination");

        if (bottomSheetIndex !== snapPoints.length - 1) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.collapse();
        }
    }

    async function onPickCoordinates(coordinates: number[], placeName: string, pickType?: string) {
        console.log("picked:", pickType, coordinates);

        if (pickType && pickType === "start-location") {
            setStartLocationCoordinates(coordinates);
            setStartLocationName(placeName);
        }
        else {
            setDestinationCoordinates(coordinates);
            setDestination(placeName);
        }

        setIsCoordinatePickerModalVisible(false);
    }

    // effects

    useEffect(() => {
        MapLibreRN.setConnected(true);

        return () => {
            MapLibreRN.setConnected(false);
        }
    }, [])

    useEffect(() => {
        (async () => {
            setIsFetchingLocationPermission(true);

            if (isLocationOn && !isLocationPermissionGranted) {
                const isLocationPermissionGranted = await fetchLocationPermission();

                setIsLocationPermissionGranted(isLocationPermissionGranted);
                setIsFetchingLocationPermission(false);

                if (!isLocationPermissionGranted) {
                    setIsLocationOn(false);
                    Alert.alert("Sijainti", "Anna sovellukselle lupa käyttää sijaintiasi.")
                }
            }

            return () => { };
        })();
    }, [isLocationOn]);

    useEffect(() => {
        (async () => {
            if (!startLocationCoordinates || !destinationCoordinates) {
                return;
            }

            console.log("recalculate route");
            setIsLoadingRoute(true);

            try {
                const waypoints: number[][] = [
                    startLocationCoordinates,
                    destinationCoordinates
                ];

                const route = await OSRM.getRoute(waypoints, routingMode);

                setRoute(route.route);
            } catch (e) {
                console.log("error");
                setErrorMessage("Virhe reittitietojen hakemisessa.");
            }

            setIsLoadingRoute(false);

            return () => { };
        })();
    }, [startLocationCoordinates, destinationCoordinates, routingMode]);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <PlaceSearchModal
                    visible={isCoordinatePickerModalVisible}
                    onClose={() => setIsCoordinatePickerModalVisible(false)}
                    onPick={onPickCoordinates}
                    pickType={coordinatePickerType}
                />


                <MapLibreRN.MapView
                    style={{ flex: 1 }}
                    mapStyle={OSM_RASTER_STYLE}
                    localizeLabels={true}
                    attributionEnabled={true}
                    attributionPosition={{ top: 122, right: 8 }}
                    logoEnabled={true}
                    logoPosition={{ top: 170, right: 48 }}
                    compassEnabled={true}
                    compassViewMargins={{ x: 8, y: 160 }}
                    zoomEnabled={true}
                    rotateEnabled={true}
                    scrollEnabled={true}
                    onPress={(e: any) => {
                        console.log("Pressed:", e.geometry.coordinates);
                        //setStartLocationCoordinates(e.geometry.coordinates)
                    }}
                >

                    <MapLibreRN.UserLocation
                        ref={userLocationRef}
                        visible={isLocationOn}
                        showsUserHeadingIndicator={true}
                        animated={true}
                        minDisplacement={0}
                        androidPreferredFramesPerSecond={30}
                        renderMode={Platform.OS === "android"
                            ? MapLibreRN.UserLocationRenderMode.Native
                            : MapLibreRN.UserLocationRenderMode.Normal}
                        androidRenderMode="compass"
                        onUpdate={(newLocation) => {
                            // this only fires on mount for some reason
                            console.log("new location:", newLocation);
                        }}
                    />

                    <MapLibreRN.Camera
                        followUserLocation={true}
                        animationMode="flyTo"
                        defaultSettings={{ centerCoordinate: [destinationCoordinates[0], destinationCoordinates[1]], zoomLevel: 8 }}
                        followZoomLevel={16}
                    />


                    <MapLibreRN.ShapeSource
                        id="routeSource"
                        hitbox={{ width: 0, height: 0 }}
                        shape={route || { type: "LineString", coordinates: [[0, 0], [69, 69]] }}
                    >
                        <MapLibreRN.LineLayer
                            id="routeLines"
                            style={route ? {
                                lineOpacity: 1,
                                lineBlur: 1.1,
                                lineColor: routingMode == "car"
                                    ? "blue"
                                    : routingMode == "bike"
                                        ? "magenta"
                                        : "green",
                                lineWidth: 4,
                            } : {
                                lineOpacity: 0,
                                lineBlur: 0,
                                lineColor: "#ffffff00",
                                lineWidth: 0,
                            }
                            }
                        />
                    </MapLibreRN.ShapeSource>


                    <MapLibreRN.ShapeSource
                        id="routeBeforeStartSource"
                        hitbox={{ width: 0, height: 0 }}
                        shape={route ? {
                            type: "LineString",
                            coordinates: [startLocationCoordinates || [0, 0], route.coordinates[0]]
                        } : {
                            type: "LineString",
                            coordinates: [[0, 0], [69, 69]]
                        }
                        }
                    >
                        <MapLibreRN.LineLayer
                            id="routeBeforeStart"
                            style={route ? {
                                lineOpacity: 1,
                                lineBlur: 1.1,
                                lineColor: "gray",
                                lineWidth: 4,
                                lineDasharray: [2, 1]
                            } : {
                                lineOpacity: 0,
                                lineBlur: 0,
                                lineColor: "#ffffff00",
                                lineWidth: 0,
                            }
                            }
                        />
                    </MapLibreRN.ShapeSource>

                    <MapLibreRN.ShapeSource
                        id="routeAfterEndSource"
                        hitbox={{ width: 0, height: 0 }}
                        shape={route ? {
                            type: "LineString",
                            coordinates: [route.coordinates[route.coordinates.length - 1], destinationCoordinates || [0, 0]]
                        } : {
                            type: "LineString",
                            coordinates: [[0, 0], [69, 69]]
                        }
                        }
                    >
                        <MapLibreRN.LineLayer
                            id="routeAfterEnd"
                            style={route ? {
                                lineOpacity: 1,
                                lineBlur: 1.1,
                                lineColor: "gray",
                                lineWidth: 4,
                                lineDasharray: [2, 1]
                            } : {
                                lineOpacity: 0,
                                lineBlur: 0,
                                lineColor: "#ffffff00",
                                lineWidth: 0,
                            }
                            }
                        />
                    </MapLibreRN.ShapeSource>



                    {
                        startLocationCoordinates && (
                            <MapLibreRN.MarkerView
                                coordinate={startLocationCoordinates}
                                allowOverlap={true}
                            >
                                <View style={{ width: 24, height: 24, borderRadius: 50, borderWidth: 6, borderColor: "green", backgroundColor: "white" }}>

                                </View>

                            </MapLibreRN.MarkerView>
                        )
                    }

                    {
                        destinationCoordinates && (
                            <MapLibreRN.MarkerView
                                coordinate={destinationCoordinates}
                                allowOverlap={true}
                            >
                                <View style={{ width: 24, height: 24, borderRadius: 50, borderWidth: 6, borderColor: "red", backgroundColor: "white" }}>

                                </View>
                            </MapLibreRN.MarkerView>
                        )
                    }

                </MapLibreRN.MapView>

                <View style={styles.mapOverlay}>
                    <View style={{ width: "100%", backgroundColor: "white", padding: 8, gap: 8, borderRadius: 10, borderColor: "gray", borderWidth: 1 }}>

                        <View style={{ gap: 8, flexDirection: "row", alignItems: "center" }}>
                            <View style={{ gap: 8, flex: 1 }}>

                                <TouchableOpacity
                                    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                                    onPress={onPressStartLocation}
                                >
                                    <MaterialIcons
                                        name="location-on"
                                        style={{ fontSize: 32, color: "green" }}
                                    />
                                    <Text
                                        style={{ color: startLocationName ? "black" : "gray", fontSize: 16, borderWidth: 1, borderColor: "black", borderRadius: 10, padding: 8, flex: 1 }}
                                        numberOfLines={1}
                                    >
                                        {startLocationName ? startLocationName : "Syötä lähtöpaikka"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                                    onPress={onPressDestination}
                                >
                                    <MaterialIcons
                                        name="location-on"
                                        style={{ fontSize: 32, color: "red" }}
                                    />
                                    <Text
                                        style={{ color: destination ? "black" : "gray", fontSize: 16, borderWidth: 1, borderColor: "black", borderRadius: 10, padding: 8, flex: 1 }}
                                        numberOfLines={1}
                                    >
                                        {destination ? destination : "Syötä määränpää"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "column",
                            justifyContent: "flex-end",
                            right: 0,
                            width: "100%",
                            height: "100%",
                            gap: 8,
                            bottom: "50%"
                        }}
                    >
                        <View style={{ alignItems: "flex-end", pointerEvents: "box-none" }}>
                            <TouchableOpacity
                                style={{ borderRadius: 10, borderWidth: 1, borderColor: "gray", height: 48, width: 48, alignItems: "center", justifyContent: "center" }}
                                onPress={onPressLocation}
                            >
                                <MaterialIcons
                                    name={isLocationOn ? "location-on" : "location-off"}
                                    style={{ fontSize: 32 }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ alignItems: "flex-end", pointerEvents: "box-none" }}>
                            <TouchableOpacity
                                style={{ borderRadius: 10, borderWidth: 1, borderColor: "gray", height: 48, width: 48, alignItems: "center", justifyContent: "center" }}
                                onPress={onPressFollowUserLocation}
                            >
                                <MaterialIcons
                                    name={followUserLocation ? "lock" : "lock-open"}
                                    style={{ fontSize: 32 }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <BottomSheet
                    ref={bottomSheetRef}
                    enableHandlePanningGesture={true}
                    index={1}
                    snapPoints={snapPoints}
                    enableDynamicSizing={false}
                    onChange={handleSheetChanges}
                    containerStyle={{
                        padding: 8,
                        flex: 1,
                        //zIndex: 0
                    }}
                    style={{}}
                >
                    <BottomSheetView style={{}} >
                        <BottomSheetScrollView
                            style={{
                                flex: 1,

                            }}

                        >
                            <View style={{ padding: 8, gap: 8, alignItems: "center" }}>
                                <View style={{ flex: 1, flexDirection: "row", height: 48, gap: 8, maxWidth: 300 }}>
                                    <TouchableOpacity
                                        style={[
                                            { flex: 1, borderColor: "gray", borderWidth: 1, borderRadius: 50, alignItems: "center", justifyContent: "center" },
                                            routingMode == "car"
                                                ? { backgroundColor: "green" }
                                                : { backgroundColor: "white" }
                                        ]}
                                        disabled={routingMode == "car"}
                                        onPress={() => setRoutingMode("car")}
                                    >
                                        <MaterialIcons
                                            style={{ fontSize: 32, color: "black" }}
                                            name="directions-car"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            { flex: 1, borderColor: "gray", borderWidth: 1, borderRadius: 50, alignItems: "center", justifyContent: "center" },
                                            routingMode == "bike"
                                                ? { backgroundColor: "green" }
                                                : { backgroundColor: "white" }
                                        ]}
                                        disabled={routingMode == "bike"}
                                        onPress={() => setRoutingMode("bike")}
                                    >
                                        <MaterialIcons
                                            style={{ fontSize: 32, color: "black" }}
                                            name="directions-bike"
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            { flex: 1, borderColor: "gray", borderWidth: 1, borderRadius: 50, alignItems: "center", justifyContent: "center" },
                                            routingMode == "foot"
                                                ? { backgroundColor: "green" }
                                                : { backgroundColor: "white" }
                                        ]}
                                        disabled={routingMode == "foot"}
                                        onPress={() => setRoutingMode("foot")}
                                    >
                                        <MaterialIcons
                                            style={{ fontSize: 32, color: "black" }}
                                            name="directions-walk"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>


                        </BottomSheetScrollView>
                    </BottomSheetView>

                </BottomSheet>
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
        alignItems: "center"
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
    },
    dashedHorizontalLine: {
        borderBottomColor: "gray",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: "dashed"
    },
});