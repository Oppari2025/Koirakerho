import * as OSRM from "@/apis/osrm";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { ArrowRightIcon, Icon } from "@/components/ui/icon";
import { Switch } from "@/components/ui/switch";
import { VStack } from "@/components/ui/vstack";
import { OSM_RASTER_STYLE } from "@/constants/OSM_RASTER_STYLE";
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import { Position } from 'geojson';
import React from "react";
import { Platform, Pressable, StyleSheet, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type MarkerConfig = {
    coords: Position;
    color: string;
};

type MarkerProps = {
    coordinate: number[]
};

type Location = {
    name: string
    address: string
    coords: {
        latitude: number,
        longitude: number
    }
}

type EventAttraction = {
    id: string
    name: string
    location: Location
};

type EventInfo = {
    id: string
    name: string
    startTime: string
    endTime: string
    location: Location
    attractions: EventAttraction[]
};

const MAP_STYLE = OSM_RASTER_STYLE
const MAP_DEFAULT_COORDINATES = [24.945831, 60.192059]
const MAP_DEFAULT_ZOOM_LEVEL = 10

const TEST_EVENT: EventInfo = {
    id: "asdfasdf",
    name: "Test Event 1",
    startTime: "1.1.2020",
    endTime: "2.1.2020",
    location: {
        name: "Test Location",
        address: "Test Road 1",
        coords: {
            longitude: 25.8578,
            latitude: 62.0457
        },
    },
    attractions: []
}

MapLibreRN.Logger.setLogCallback(log => {
    const { message } = log;
    return true;
});

MapLibreRN.setConnected(true);



export default function MapScreen() {
    // Event information
    const [eventInfo, setEventInfo] = React.useState<EventInfo>(TEST_EVENT);

    // Settings
    const [isCarAvailable, setIsCarAvailable] = React.useState<boolean>(true);
    const [isBikeAvailable, setIsBikeAvailable] = React.useState<boolean>(true);
    const [isFootAvailable, setIsFootAvailable] = React.useState<boolean>(true);
    const [routingMode, setRoutingMode] = React.useState<OSRM.RoutingMode>("car");
    const [isNavigationToggledOn, setIsNavigationToggledOn] = React.useState<boolean>(false);
    const [isPositionToggledOn, setIsPositionToggledOn] = React.useState<boolean>(false);

    // Locations
    const [location, setLocation] = React.useState<MapLibreRN.Location>();
    const [selectedLocation, setSelectedLocation] = React.useState<number>();

    // Navigation
    const [carRoute, setCarRoute] = React.useState<GeoJSON.LineString | null>(null);
    const [otherRoute, setOtherRoute] = React.useState<GeoJSON.LineString | null>(null);
    const [otherRoute2, setOtherRoute2] = React.useState<GeoJSON.LineString | null>(null);
    const [navigationStartPosition, setNavigationStartPosition] = React.useState<number[]>([0, 0]);
    const [navigationEndPosition, setNavigationEndPosition] = React.useState<number[]>([0, 0]);

    // Permissions
    const [isFetchingLocationPermission, setIsFetchingLocationPermission] = React.useState<boolean>(false);
    const [isLocationPermissionGranted, setIsLocationPermissionGranted] = React.useState<boolean>(false);

    // Refs
    const mapCameraRef = React.useRef<MapLibreRN.CameraRef>(null);
    const userLocationRef = React.useRef<MapLibreRN.UserLocationRef>(null);

    async function requestLocationPermission(): Promise<boolean> {
        setIsFetchingLocationPermission(true);

        let isLocationPermissionGranted = false;
        if (Platform.OS === "android") {
            isLocationPermissionGranted = await MapLibreRN.requestAndroidLocationPermissions();
        }
        else if (Platform.OS === "ios") {
            // TODO: Request permission on iOS
            isLocationPermissionGranted = false;
        }

        setIsFetchingLocationPermission(false);
        return isLocationPermissionGranted;
    }

    function zoomToLocation(longitude: number, latitude: number) {
        mapCameraRef.current?.moveTo([longitude, latitude]);
        mapCameraRef.current?.zoomTo(16, 3000);
    }

    React.useEffect(() => {
        (async () => {
            const isLocationPermissionGranted = await requestLocationPermission();
            setIsLocationPermissionGranted(isLocationPermissionGranted);
        })();
    }, []);

    React.useEffect(() => {
        (async () => {
            if (!isPositionToggledOn) {
                return;
            }

            const isLocationPermissionGranted = await requestLocationPermission();
            setIsLocationPermissionGranted(isLocationPermissionGranted);

            if (!isLocationPermissionGranted) {
                setIsPositionToggledOn(false);
                return;
            }
        })();

    }, [isPositionToggledOn]);

    React.useEffect(() => {
        (async () => {
            if (!isNavigationToggledOn) {
                return;
            }

            setCarRoute(null);
            setOtherRoute(null);
            setOtherRoute2(null);

            const isLocationPermissionGranted = await requestLocationPermission();
            setIsLocationPermissionGranted(isLocationPermissionGranted);

            if (!isLocationPermissionGranted) {
                setIsNavigationToggledOn(false);
                console.log("no location permission")
                return;
            }

            if (!location) {
                setIsNavigationToggledOn(false);
                console.log("no location")
                return;
            }

            const navigationStartPosition = [location.coords.longitude, location.coords.latitude];
            setNavigationStartPosition(navigationStartPosition);

            const navigationEndPosition = [eventInfo.location.coords.longitude, eventInfo.location.coords.latitude];
            setNavigationEndPosition(navigationEndPosition);

            let carRoute: GeoJSON.LineString | null = null

            if (isCarAvailable) {
                try {
                    carRoute = await OSRM.getRoute([navigationStartPosition, navigationEndPosition], "car");
                } catch {
                    return;
                }
            }

            if (carRoute?.coordinates && carRoute.coordinates.length >= 2) {
                setCarRoute(carRoute);
            }
            else {
                return;
            }

            if (isFootAvailable) {
                try {
                    const mainRouteStart = carRoute.coordinates[0]
                    const mainRouteEnd = carRoute.coordinates[carRoute!.coordinates.length - 1]

                    const footRoute1 = await OSRM.getRoute([navigationStartPosition, mainRouteStart], "foot");
                    setOtherRoute(footRoute1?.coordinates && footRoute1.coordinates.length >= 2 ? footRoute1 : null);

                    const footRoute2 = await OSRM.getRoute([mainRouteEnd, navigationEndPosition], "foot");
                    setOtherRoute2(footRoute2?.coordinates && footRoute2.coordinates.length >= 2 ? footRoute2 : null);

                } catch {
                    setOtherRoute(null);
                    setOtherRoute2(null);
                }
            }
        })();
    }, [isNavigationToggledOn, isCarAvailable, isBikeAvailable, isFootAvailable]);

    // Bottom sheet
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = React.useMemo(() => ["30%", "40%", "50%", "60%", "70%", "80%"], []);
    const handleSheetChanges = React.useCallback((index: number) => {
        //console.log('handleSheetChanges', index);
    }, []);

    const renderItem = React.useCallback(
        (item: string) => (
            <VStack
                key={item}
                style={{ backgroundColor: "#eeeeee", borderRadius: 8, flexDirection: "row", padding: 8 }}
            >
                <VStack style={{ flex: 0, marginRight: "auto" }}>
                    <Text className="text-md">{item}</Text>
                </VStack>
                <Pressable
                    style={{ flex: 0, marginLeft: "auto" }}
                    onPress={(e) => {
                        setSelectedLocation(2);
                    }}
                >
                    <Icon
                        as={ArrowRightIcon}
                        size="md"
                    />
                </Pressable>
            </VStack>
        ),
        []
    );

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1 }}>

                    <MapLibreRN.MapView
                        style={{ flex: 1 }}
                        mapStyle={MAP_STYLE}
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
                            console.log("Pressed:", e.geometry.coordinates)
                        }}
                    >

                        <MapLibreRN.UserLocation
                            ref={userLocationRef}
                            visible={isPositionToggledOn}
                            minDisplacement={0}
                            showsUserHeadingIndicator={true}
                            androidRenderMode="gps"
                            animated={true}
                            renderMode={MapLibreRN.UserLocationRenderMode.Normal}
                            onUpdate={(newLocation) => setLocation(newLocation)}
                            onPress={() => {
                                if (!location) {
                                    return;
                                }

                                zoomToLocation(location.coords.longitude, location.coords.latitude);
                            }}
                        />

                        <MapLibreRN.Camera
                            ref={mapCameraRef}
                            defaultSettings={{
                                zoomLevel: MAP_DEFAULT_ZOOM_LEVEL,
                                centerCoordinate: MAP_DEFAULT_COORDINATES,

                            }}
                            onUserTrackingModeChange={(e) => {
                                console.log(e.nativeEvent.payload)
                            }}
                        />

                        {
                            (carRoute && isNavigationToggledOn) && (
                                <>
                                    <MapLibreRN.ShapeSource
                                        id="routeSource"
                                        hitbox={{ width: 0, height: 0 }}
                                        shape={carRoute}
                                    >
                                        <MapLibreRN.LineLayer
                                            id="routeLines"
                                            style={{
                                                lineOpacity: 1,
                                                lineBlur: 1.1,
                                                lineColor: '#1322ffff',
                                                lineWidth: 4
                                            }}
                                        />
                                    </MapLibreRN.ShapeSource>

                                    {
                                        otherRoute && (
                                            <MapLibreRN.ShapeSource
                                                id="routeSource2"
                                                hitbox={{ width: 0, height: 0 }}
                                                shape={otherRoute}
                                            >
                                                <MapLibreRN.LineLayer
                                                    id="routeLines2"
                                                    style={{
                                                        lineDasharray: [1, 1, 1],
                                                        lineOpacity: 1,
                                                        lineBlur: 1.1,
                                                        lineColor: '#3d3d3dff',
                                                        lineWidth: 4
                                                    }}
                                                />
                                            </MapLibreRN.ShapeSource>
                                        )
                                    }

                                    {
                                        otherRoute2 && (
                                            <MapLibreRN.ShapeSource
                                                id="routeSource3"
                                                hitbox={{ width: 0, height: 0 }}
                                                shape={otherRoute2}
                                            >
                                                <MapLibreRN.LineLayer
                                                    id="routeLines3"
                                                    style={{
                                                        lineDasharray: [1, 1, 1],
                                                        lineOpacity: 1,
                                                        lineBlur: 1.1,
                                                        lineColor: '#3d3d3dff',
                                                        lineWidth: 4
                                                    }}
                                                />
                                            </MapLibreRN.ShapeSource>
                                        )
                                    }

                                    <MapLibreRN.ShapeSource
                                        id="startPosSource"
                                        shape={{
                                            type: "MultiPoint",
                                            coordinates: [navigationStartPosition]
                                        }}
                                        onPress={(e) => {
                                            zoomToLocation(e.coordinates.longitude, e.coordinates.latitude)
                                        }}
                                    >
                                        <MapLibreRN.CircleLayer
                                            id="startPos"
                                            style={{
                                                circleOpacity: 1,
                                                circleRadius: 8,
                                                circleBlur: 0,
                                                circleColor: '#ffffffff',
                                                circleStrokeWidth: 4,
                                                circleStrokeColor: "#0c740cff"
                                            }}
                                        />
                                    </MapLibreRN.ShapeSource>

                                    <MapLibreRN.ShapeSource
                                        id="endPosSource"
                                        shape={{
                                            type: "MultiPoint",
                                            coordinates: [navigationEndPosition]
                                        }}
                                        onPress={(e) => {
                                            zoomToLocation(e.coordinates.longitude, e.coordinates.latitude)
                                        }}
                                    >
                                        <MapLibreRN.CircleLayer
                                            id="endPos"
                                            style={{
                                                circleOpacity: 1,
                                                circleRadius: 8,
                                                circleBlur: 0,
                                                circleColor: '#ffffffff',
                                                circleStrokeWidth: 4,
                                                circleStrokeColor: "#ff625dff"

                                            }}
                                        />
                                    </MapLibreRN.ShapeSource>
                                </>

                            )
                        }
                    </MapLibreRN.MapView>

                    <BottomSheet
                        ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                        enableDynamicSizing={false}
                        onChange={handleSheetChanges}
                    >

                        <VStack className="items-center ml-4 mr-4 my-0.5">
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Navigator</Text>
                        </VStack>
                        <BottomSheetScrollView className="">
                            <VStack className="ml-4 mr-4 mt-4 gap-2">
                                <HStack space="md" className="flex justify-between">
                                    <Text className="text-lg">Location</Text>
                                    <Switch
                                        value={isPositionToggledOn}
                                        onValueChange={(value) => setIsPositionToggledOn(value)}
                                        trackColor={{ false: '#d4d4d4', true: '#525252' }}
                                        thumbColor="#fafafa"
                                        ios_backgroundColor="#d4d4d4"
                                        size="lg"
                                    />

                                </HStack>
                                <HStack space="md" className="flex justify-between">
                                    <Text className="text-lg">Routing</Text>
                                    <Switch
                                        value={isNavigationToggledOn}
                                        onValueChange={(value) => setIsNavigationToggledOn(value)}
                                        trackColor={{ false: '#d4d4d4', true: '#525252' }}
                                        thumbColor="#fafafa"
                                        ios_backgroundColor="#d4d4d4"
                                        size="lg"
                                    />
                                </HStack>

                            </VStack>

                            <VStack className="items-center ml-4 mr-4 my-4">
                                <Divider className="bg-gray-300" />
                            </VStack>

                            <VStack className="ml-4 mr-4">
                                <Text className="font-bold mb-4">Transport Modes</Text>

                                <VStack className="gap-2">

                                    <HStack space="md" className="flex justify-between">
                                        <Text className="text-lg">Car</Text>
                                        <Switch
                                            className=""
                                            value={isCarAvailable}
                                            onValueChange={(value) => setIsCarAvailable(value)}
                                            trackColor={{ false: '#d4d4d4', true: '#525252' }}
                                            thumbColor="#fafafa"
                                            //activeThumbColor="#fafafa"
                                            ios_backgroundColor="#d4d4d4"
                                            size="lg"
                                        />
                                    </HStack>

                                    <HStack space="md" className="flex justify-between">
                                        <Text className="text-lg">Bike</Text>
                                        <Switch
                                            value={isBikeAvailable}
                                            onValueChange={(value) => setIsBikeAvailable(value)}
                                            trackColor={{ false: '#d4d4d4', true: '#525252' }}
                                            thumbColor="#fafafa"
                                            //activeThumbColor="#fafafa"
                                            ios_backgroundColor="#d4d4d4"
                                            size="lg"
                                        />
                                    </HStack>
                                    <HStack space="md" className="flex justify-between">
                                        <Text className="text-lg">Foot</Text>
                                        <Switch
                                            value={isFootAvailable}
                                            onValueChange={(value) => setIsFootAvailable(value)}
                                            trackColor={{ false: '#d4d4d4', true: '#525252' }}
                                            thumbColor="#fafafa"
                                            //activeThumbColor="#fafafa"
                                            ios_backgroundColor="#d4d4d4"
                                            size="lg"
                                        />
                                    </HStack>
                                </VStack>


                            </VStack>

                            <VStack className="items-center ml-4 mr-4 my-4">
                                <Divider className="bg-gray-300" />
                            </VStack>

                            <VStack className="ml-4 mr-4">
                                <Text className="text-lg">Navigate</Text>
                                <VStack style={{ gap: 4 }}>
                                    {
                                        //renderItem(eventInfo)
                                    }
                                </VStack>
                            </VStack>

                            <VStack className="items-center ml-4 mr-4 my-4">
                                <Divider className="bg-gray-300" />
                            </VStack>

                            <VStack className="h-24" />
                        </BottomSheetScrollView>
                    </BottomSheet>

                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider >
    )
}

const styles = StyleSheet.create({
    touchableContainer: { borderColor: 'black', borderWidth: 1.0, width: 10 },
    touchable: {
        backgroundColor: 'blue',
        width: 1,
        height: 1,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchableText: {
        color: 'white',
        fontWeight: 'bold',
    },
    matchParent: { flex: 1 },
    contentContainer: {
        flex: 1,
        padding: 1,
        alignItems: 'center',
    },
    itemContainer: {
        padding: 6,
        margin: 6,
        backgroundColor: "#eee",
    },
    marker: {
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: 'red',
    }
});