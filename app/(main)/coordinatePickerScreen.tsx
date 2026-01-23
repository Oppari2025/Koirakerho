import { OSM_RASTER_STYLE } from "@/constants/OSM_RASTER_STYLE";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import Geolocation, { GeolocationError, GeolocationResponse } from "@react-native-community/geolocation";
import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

MapLibreRN.setAccessToken(null);
MapLibreRN.setConnected(true);

export default function coordinatePickerScreen(): React.JSX.Element {


    // Settings
    const [isPositionToggledOn, setIsPositionToggledOn] = React.useState<boolean>(false);
    const [followUserLocation, setFollowUserLocation] = React.useState<boolean>(false);
    const [zoomedToUserLocation, setZoomedToUserLocation] = React.useState<boolean>(false);
    const [locationFound, setLocationFound] = React.useState<boolean>(false);
    const [location, setLocation] = React.useState<MapLibreRN.Location>();
    const [pickedCoordinates, setPickedCoordinates] = React.useState<number[]>([0, 0]);
    const [locationWatchId, setLocationWatchId] = React.useState<number | null>(null);
    const [locationPoint, setLocationPoint] = React.useState<GeoJSON.MultiPoint | null>(null);

    // Map
    const mapCameraRef = React.useRef<MapLibreRN.CameraRef>(null);
    const mapRef = React.useRef<MapLibreRN.MapViewRef>(null);
    const locRef = React.useRef<View>(null);
    const userLocationRef = React.useRef<MapLibreRN.PointAnnotationRef>(null);

    // Permissions
    const [isFetchingLocationPermission, setIsFetchingLocationPermission] = React.useState(true);
    const [isLocationPermissionGranted, setIsLocationPermissionGranted] = React.useState(false);


    React.useEffect(() => {
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
                if (locationWatchId) {
                    Geolocation.clearWatch(locationWatchId);
                }
            };
        })();
    }, []);

    function handlePosition(response: GeolocationResponse) {
        console.log("location updt: ", response.coords);

        setLocationPoint({
            type: "MultiPoint",
            coordinates: [[response.coords.longitude, response.coords.latitude]]
        });

        setLocationFound(true);

        if (!zoomedToUserLocation) {
            console.log("zoom 1");

            mapCameraRef.current?.moveTo([response.coords.longitude, response.coords.latitude], 0);
            mapCameraRef.current?.zoomTo(16, 0);
            setZoomedToUserLocation(true);
        }
        else if (followUserLocation) {
            console.log("zoom 2");
            mapCameraRef.current?.moveTo([response.coords.longitude, response.coords.latitude], 0);
            mapCameraRef.current?.zoomTo(16, 0);
        }
    }

    function handlePositionError(error: GeolocationError) {
        console.log(error.code, error.message);
    }

    function onPressUserLocation() {
        if (!location) {
            return;
        }

        mapCameraRef.current?.moveTo([location.coords.longitude, location.coords.latitude]);
        mapCameraRef.current?.zoomTo(16, 3000);
    }

    function onTogglePosition() {
        console.log("toggle");

        if (locationWatchId) {
            Geolocation.clearWatch(locationWatchId);
            setLocationWatchId(null);
        }

        if (isPositionToggledOn) {
            setIsPositionToggledOn(false);
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000,
            interval: 100,
            distanceFilter: 0,
        };

        const watchId = Geolocation.watchPosition(
            handlePosition,
            handlePositionError,
            options
        );

        setLocationWatchId(watchId);
        setIsPositionToggledOn(true);

        console.log("sdsdgds");
        setZoomedToUserLocation(false);
    }

    const renderLocation = isPositionToggledOn && isLocationPermissionGranted && !isFetchingLocationPermission && locationFound;
    console.log("render location:", renderLocation);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.page}>
                <View
                    style={{
                        flex: 1,
                        padding: 8,
                        //backgroundColor: "#dcf11859",
                        position: "absolute",
                        zIndex: 10,
                        height: "100%",
                        width: "100%",
                        flexDirection: "column",
                        pointerEvents: "box-none"
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            padding: 8,
                            bottom: 24,
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                            alignSelf: "center",
                            position: "absolute",
                            pointerEvents: "box-none"
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#144100ff',
                                padding: 14,
                                zIndex: 99,
                                width: 128,
                                height: 64,
                                borderRadius: 10,
                                margin: 8,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 24
                                }}
                            >
                                OK
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            padding: 8,
                            bottom: 24,
                            right: 0,
                            position: "absolute",
                            pointerEvents: "box-none"
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#144100ff',
                                padding: 14,
                                zIndex: 99,
                                width: 64,
                                height: 64,
                                borderRadius: 50,
                                margin: 8,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onPress={onTogglePosition}
                        >
                            <MaterialIcons
                                name={isPositionToggledOn ? "gps-fixed" : "gps-not-fixed"}
                                size={32}
                                color={isPositionToggledOn ? "#FFF" : "#000"}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#144100ff',
                                padding: 14,
                                zIndex: 99,
                                width: 64,
                                height: 64,
                                borderRadius: 50,
                                margin: 8,
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                            onPress={() => setFollowUserLocation(!followUserLocation)}
                        >
                            <MaterialIcons
                                name={"person-pin-circle"}
                                size={32}
                                color={followUserLocation ? "#FFF" : "#000"}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.mapContainer}>
                    <MapLibreRN.MapView
                        style={{ flex: 1 }}
                        mapStyle={OSM_RASTER_STYLE}
                        localizeLabels={true}
                        attributionEnabled={true}
                        attributionPosition={{ top: 0, right: 0 }}
                        logoEnabled={true}
                        logoPosition={{ top: 0, right: 32 }}
                        compassEnabled={true}
                        compassViewMargins={{ x: 0, y: 32 }}
                        zoomEnabled={true}
                        rotateEnabled={true}
                        scrollEnabled={true}
                        onPress={(e: any) => {
                            console.log("Pressed:", e.geometry.coordinates);
                            setPickedCoordinates(e.geometry.coordinates)
                        }}
                    >
                        <MapLibreRN.UserLocation
                            visible={false}
                        />

                        <MapLibreRN.Camera
                            ref={mapCameraRef}
                            followUserLocation={false}
                        />

                        <MapLibreRN.ShapeSource
                            key="shape-source"
                            id="line-source"
                            shape={locationPoint || { type: "MultiPoint", coordinates: [] }}
                        >
                            <MapLibreRN.CircleLayer
                                id="locationPuckLayer"
                                style={{
                                    circleRadius: 8,
                                    circleColor: '#00cccc',
                                    circleStrokeWidth: 8,
                                    circleStrokeColor: '#ffffff',
                                    circleStrokeOpacity: 0.5
                                }}
                            />

                        </MapLibreRN.ShapeSource>
                    </MapLibreRN.MapView>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        height: "100%"
    }
});