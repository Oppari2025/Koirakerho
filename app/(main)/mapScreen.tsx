import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { OSM_RASTER_STYLE } from "@/constants/OSM_RASTER_STYLE";
import * as Map from "@maplibre/maplibre-react-native";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type RoutingMode = "car" | "bike" | "foot"

//const mapStyle = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
const mapStyle = OSM_RASTER_STYLE;

Map.setConnected(true);

export default function MapScreen() {
    // Event information
    const [eventLocationAddress, setEventLocationAddress] = React.useState<string>();
    const [eventLocationLatitude, setEventLocationLatitude] = React.useState<number>(0);
    const [eventLocationLongitude, setEventLocationLongitude] = React.useState<number>(0);

    // User information
    const [userLocation, setLocation] = React.useState<Map.Location>();

    // Settings
    const [routingMode, setRoutingMode] = React.useState<RoutingMode>("bike");
    const [navigationActive, setNavigationActive] = React.useState<boolean>(true);

    // Permissions
    const [isFetchingLocationPermission, setIsFetchingLocationPermission] = React.useState(true);
    const [isLocationPermissionGranted, setIsLocationPermissionGranted] = React.useState(false);

    React.useEffect(() => {
        (async () => {
            let isLocationPermissionGranted = false;
            if (Platform.OS === "android") {
                isLocationPermissionGranted = await Map.requestAndroidLocationPermissions();
            }
            else if (Platform.OS === "ios") {
                // TODO: Request permission on iOS
                isLocationPermissionGranted = false;
            }

            setIsLocationPermissionGranted(isLocationPermissionGranted);
            setIsFetchingLocationPermission(false);
        })();

        Map.LocationManager.start();

        return () => {
            Map.LocationManager.stop();
        };
    }, []);

    async function getRoute(): Promise<GeoJSON.LineString> {
        if (!userLocation) {
            throw new Error("Current user location is undefined.");
        }

        const url = `https://routing.openstreetmap.de/routed-${routingMode}/route/v1/driving/${userLocation.coords.longitude},${userLocation.coords.latitude};${eventLocationLongitude},${eventLocationLatitude}?overview=simplified&geometries=geojson`
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const responseData = await response.json();
        return responseData["routes"]["geometry"] as GeoJSON.LineString;
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ width: "100%", height: "100%" }}>
                <Map.MapView
                    style={{ flex: 1 }}
                    mapStyle={mapStyle}
                    compassEnabled={true}
                    logoEnabled={true}
                >

                    {navigationActive ? (
                        <Map.UserLocation
                            renderMode={
                                navigationActive
                                    ? Map.UserLocationRenderMode.Normal
                                    : Map.UserLocationRenderMode.Native
                            }
                            showsUserHeadingIndicator={true}
                        >
                            <Map.SymbolLayer
                                id="navigation-icon"
                                style={{
                                    //iconImage: maplibreIcon,
                                    iconPitchAlignment: "map",
                                    iconAllowOverlap: true,
                                }}
                            />
                        </Map.UserLocation>
                    ) : null}

                    <Map.Camera
                        followUserLocation={navigationActive}
                        followUserMode={
                            navigationActive
                                ? Map.UserTrackingMode.FollowWithHeading
                                : Map.UserTrackingMode.Follow
                        }
                        followZoomLevel={12}
                        //followPitch={60}
                        //pitch={0}
                        onUserTrackingModeChange={(event) => {
                            if (navigationActive && !event.nativeEvent.payload.followUserLocation) {
                                setNavigationActive(false);
                            }
                        }}
                    />

                </Map.MapView>

                <VStack>
                    {userLocation && (
                        <>
                            <Text>Timestamp: {userLocation.timestamp}</Text>
                            <Text>Longitude: {userLocation.coords.longitude}</Text>
                            <Text>Latitude: {userLocation.coords.latitude}</Text>
                            <Text>Altitude: {userLocation.coords.altitude}</Text>
                            <Text>Heading: {userLocation.coords.heading}</Text>
                            <Text>Accuracy: {userLocation.coords.accuracy}</Text>
                            <Text>Speed: {userLocation.coords.speed}</Text>
                        </>
                    )}
                </VStack>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    touchableContainer: { borderColor: 'black', borderWidth: 1.0, width: 60 },
    touchable: {
        backgroundColor: 'blue',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchableText: {
        color: 'white',
        fontWeight: 'bold',
    },
    matchParent: { flex: 1 },
});