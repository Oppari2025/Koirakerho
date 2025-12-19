import { Button, ButtonText } from "@/components/ui/button";
import { OSM_RASTER_STYLE } from "@/constants/OSM_RASTER_STYLE";
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const MAP_STYLE = OSM_RASTER_STYLE;

MapLibreRN.setAccessToken(null);
MapLibreRN.setConnected(true);

export default function CoordinatePickerScreen(): React.JSX.Element {
    const router = useRouter();
    const { json } = useLocalSearchParams();

    const [pickedCoordinates, setPickedCoordinates] = React.useState<number[]>([0, 0]);

    function onPressOk() {
        router.dismissTo({
            pathname: "/(main)/addEventScreen",
            params: {
                selection: pickedCoordinates,
            },
        });
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
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
                        console.log("Pressed:", e.geometry.coordinates);
                        setPickedCoordinates(e.geometry.coordinates)
                    }}
                >
                    {
                        pickedCoordinates && (
                            <MapLibreRN.ShapeSource
                                id="posSource"
                                shape={{
                                    type: "MultiPoint",
                                    coordinates: [pickedCoordinates]
                                }}
                                onPress={(e) => {
                                    //zoomToLocation(e.coordinates.longitude, e.coordinates.latitude)
                                }}
                            >
                                <MapLibreRN.CircleLayer
                                    id="pos"
                                    style={{
                                        circleOpacity: 1,
                                        circleRadius: 8,
                                        circleBlur: 0,
                                        circleColor: '#ffffffff',
                                        circleStrokeWidth: 4,
                                        circleStrokeColor: "#ff00aaff"
                                    }}
                                />
                            </MapLibreRN.ShapeSource>
                        )
                    }

                </MapLibreRN.MapView>
                <Button
                    variant="solid"
                    onPress={onPressOk}
                >
                    <ButtonText>OK</ButtonText>
                </Button>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}