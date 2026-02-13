import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as MapLibreRN from "@maplibre/maplibre-react-native";
import Geolocation from "@react-native-community/geolocation";
import React, { useEffect, useState } from "react";
import { Modal, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { OSM_RASTER_STYLE } from "./OSM_RASTER_STYLE";

type CoordinatePickerModalProps = {
    visible: boolean;
    onClose: () => void;
    onPick: (coordinates: number[], pickType?: string) => void;
    pickType?: string;
    initialCoordinates?: number[];
}

export default function CoordinatePickerModal({ visible, onClose, onPick, pickType, initialCoordinates }: CoordinatePickerModalProps): React.JSX.Element {
    const insets = useSafeAreaInsets();

    // state
    const [pickedCoordinates, setPickedCoordinates] = useState<number[]>([0, 0]);
    const [followUserLocation, setFollowUserLocation] = useState<boolean>(false);

    // effects
    useEffect(() => {
        console.log("CoordinatePickerModal visible", visible);

        if (visible) {
            Geolocation.requestAuthorization(
                () => {
                    // success
                },
                (error) => {

                }
            )
        }
    }, [visible]);

    // functions

    async function onPressOk() {
        onPick(pickedCoordinates, pickType);
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                onClose();
            }}
        >
            <View
                style={{ height: "100%", width: "100%", position: "absolute", paddingBottom: (insets.bottom), zIndex: 9, paddingTop: (StatusBar.currentHeight || 0), paddingLeft: 0, pointerEvents: "box-none", flex: 1 }}
            >
                <View style={{ width: "100%", flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <TouchableOpacity
                        style={{ width: 64, height: 64, borderRadius: 50, alignItems: "center", justifyContent: "center" }}
                        onPress={onClose}
                    >
                        <MaterialIcons
                            name="arrow-back"
                            style={{ fontSize: 24, color: "black" }}
                        />
                    </TouchableOpacity>
                    <Text style={{ color: "black", fontSize: 20, fontWeight: "bold", alignSelf: "center" }}>
                        Valitse paikka
                    </Text>
                </View>
                <View style={{ flex: 1 }} />

                <View
                    style={{ alignSelf: "center", width: "100%", alignItems: "center", margin: 8 }}
                >
                    <TouchableOpacity
                        style={styles.okButton}
                        onPress={onPressOk}
                    >
                        <Text className="text-black text-lg font-bold">
                            OK
                        </Text>
                    </TouchableOpacity>
                </View>

            </View>

            <MapLibreRN.MapView
                style={{ flex: 1 }}
                mapStyle={OSM_RASTER_STYLE}
                localizeLabels={true}
                attributionEnabled={true}
                attributionPosition={{ top: 80, right: 8 }}
                logoEnabled={true}
                logoPosition={{ top: 108, right: 48 }}
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
                <MapLibreRN.UserLocation
                    //ref={userLocationRef}
                    visible={true}
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
                    onPress={() => {
                        console.log("press user location");
                    }}
                />

                <MapLibreRN.Camera
                    defaultSettings={{ centerCoordinate: initialCoordinates }}
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
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    okButton: {
        width: 144,
        height: 48,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#bdb76b",
        borderWidth: 1,
        borderColor: "gray"
    }
});