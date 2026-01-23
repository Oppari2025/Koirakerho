import { OSM_RASTER_STYLE } from "@/constants/OSM_RASTER_STYLE";
import { Event } from "@/src/types/event";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import BottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

MapLibreRN.setConnected(true);

export default function navigatorScreen(): React.JSX.Element {
    const [routes, setRoutes] = React.useState<any | null>(null);
    const bottomSheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = React.useMemo(() => ["20%", "30%", "40%", "50%", "60%", "70%", "80%"], []);
    const handleSheetChanges = React.useCallback((index: number) => {
        //console.log('handleSheetChanges', index);
    }, []);

    const [userLocation, setUserLocation] = React.useState<number[] | null>(null);
    const [eventData, setEventData] = React.useState<Event | null>(null);
    const [startLocation, setStartLocation] = React.useState<{ coordinates: number[], name: string } | null>(null);
    const [endLocation, setEndLocation] = React.useState<{ coordinates: number[], name: string } | null>(null);


    React.useEffect(() => {

    }, []);


    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={styles.page}>
                <SafeAreaView style={styles.page}>
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
                            }}
                        >

                        </MapLibreRN.MapView>
                    </View>

                    <BottomSheet
                        ref={bottomSheetRef}
                        enableHandlePanningGesture={true}
                        index={1}
                        snapPoints={snapPoints}
                        enableDynamicSizing={false}
                        onChange={handleSheetChanges}
                        containerStyle={{
                            padding: 8
                        }}
                        style={{}}
                    >
                        <BottomSheetView style={{ flex: 1, }} >
                            <BottomSheetScrollView
                                style={{
                                    flex: 1,
                                }}
                            >
                                <View style={{}}>
                                    <View style={styles.dashedHorizontalLine} />

                                    <View style={styles.textInputContainer}>
                                        <MaterialIcons
                                            name="place"
                                            size={32}
                                            color="green"
                                        />
                                        <TextInput
                                            style={[styles.textInput, {
                                                backgroundColor: "#FFF",
                                                borderWidth: 1,
                                            }]}
                                            value={startLocation?.name}
                                            placeholder=""
                                            placeholderTextColor="gray"
                                            editable={false}
                                            multiline={false}
                                        />
                                    </View>
                                    <View style={styles.textInputContainer}>
                                        <MaterialIcons
                                            name="place"
                                            size={32}
                                            color="red"
                                        />
                                        <View style={{ width: "100%" }}>
                                            <TextInput
                                                style={[styles.textInput, {
                                                    backgroundColor: "#FFF",
                                                    borderWidth: 1,
                                                }]}
                                                value={startLocation?.name}
                                                placeholder=""
                                                placeholderTextColor="gray"
                                                editable={false}
                                                multiline={false}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.dashedHorizontalLine} />
                                </View>


                            </BottomSheetScrollView>
                        </BottomSheetView>

                    </BottomSheet>

                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    mapContainer: {
        flex: 1,
        width: "100%",
        height: "100%"
    },
    textInputLabel: {
        fontWeight: "bold",
        fontSize: 16
    },
    textInput: {
        borderColor: "black",
        borderRadius: 10,
        color: "black",
        fontSize: 20,
        width: "100%",
    },
    textInputContainer: {
        flexDirection: "row",
        flex: 1,
        alignItems: "center",
        gap: 8,
        //width: "88%"
        //width: "100%"
    },
    dashedHorizontalLine: {
        borderBottomColor: "gray",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: "dashed"
    },
});