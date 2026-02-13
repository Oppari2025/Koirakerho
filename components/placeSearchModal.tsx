import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Geolocation, { GeolocationConfiguration } from '@react-native-community/geolocation';
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Modal, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CoordinatePickerModal from "./coordinatePickerModal";

const config: GeolocationConfiguration = {
    skipPermissionRequests: false,
    authorizationLevel: "whenInUse",
    locationProvider: "auto"
};

Geolocation.setRNConfiguration(config);

type PlaceSearchModalProps = {
    visible: boolean;
    pickType?: string;
    onPick: (coordinates: number[], placeName: string, pickType?: string) => void
    onClose: () => void;
    initialCoordinates?: number[];
}

type SearchResult = {
    placeName: string;
    location: string;
    longitude: number;
    latitude: number;
}

export default function PlaceSearchModal({ visible, pickType, onPick, onClose, initialCoordinates }: PlaceSearchModalProps): React.JSX.Element {
    const insets = useSafeAreaInsets();

    // state
    const [searchText, setSearchText] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [coordinatePickerModalVisible, setCoordinatePickerModalVisible] = useState<boolean>(false);

    //useEffect(() => {
    //    console.log(coordinatePickerModalVisible);
    //    
    //}, [coordinatePickerModalVisible])

    // effects

    useEffect(() => {
        setErrorMessage(null);

        if (searchText.length < 3) {
            setSearchResults(null);
            return;
        }

        async function getSearchResults() {
            try {
                const url = `https://photon.komoot.io/api/?q=${searchText}&lang=en&limit=10`;

                const response = await fetch(url);

                if (!response.ok) {
                    setErrorMessage("Ongelma haettaessa paikkatietoja.");
                    return;
                }

                const responseJson = await response.json();
                const featureCount = responseJson?.features?.length;

                if (featureCount === null) {
                    setErrorMessage("Ongelma haettaessa paikkatietoja.");
                    return;
                }

                let results: SearchResult[] = []

                for (let i = 0; i < featureCount; i++) {
                    const feature = responseJson?.features[i];
                    const coordinates: number[] | null = feature?.geometry?.coordinates;

                    const properties = feature.properties;

                    if (coordinates === null) {
                        setErrorMessage("Ongelma haettaessa paikkatietoja.");
                        return;
                    }

                    const { postcode, housenumber, name, city, street, country, state } = responseJson.features[i].properties;

                    let placeName: string;
                    let location: string;

                    if (name) {
                        placeName = name;
                    }
                    else {
                        placeName = `${state}, ${country}`;
                    }

                    if (street !== undefined && city !== undefined) {
                        if (housenumber !== undefined) {
                            location = `${street} ${housenumber}, ${city}`;
                            console.log(location);

                        }
                        else {
                            location = `${street}, ${city}`
                        }
                    }
                    else if (city !== undefined && state !== undefined && country !== undefined) {
                        location = `${city}, ${state}, ${country}`;
                    }
                    else {
                        location = `${state}, ${country}`;
                    }

                    const result: SearchResult = {
                        placeName: placeName,
                        location: location,
                        longitude: coordinates[0],
                        latitude: coordinates[1],
                    };

                    results.push(result);
                }

                setSearchResults(results);
            }
            catch {
                setErrorMessage("Ongelma haettaessa paikkatietoja.");
            }
        }

        getSearchResults();
    }, [searchText]);

    async function coordinatesToPlaceName(coordinates: number[]): Promise<string> {
        try {
            const url = `https://photon.komoot.io/reverse?lon=${coordinates[0]}&lat=${coordinates[1]}&lang=en&limit=1&distance_sort=true`;
            console.log(url);
            

            const response = await fetch(url);

            if (!response.ok) {
                return "-";
            }

            const responseJson: GeoJSON.FeatureCollection = await response.json();
            const featureCount = responseJson.features.length;

            console.log(responseJson);
            

            if (featureCount <= 0) {
                return "-";
            }

            const { city, country, countrycode, street, housenumber, locality, postcode, name } = responseJson.features[0].properties as any;

            let ret = "";
            if (name && name.length !== 0) {
                ret += name;
            }

            if (street && housenumber) {
                if (ret.length > 0) {
                    ret += ", ";
                }

                ret += `${street} ${housenumber}`;

                if (locality) {
                    ret += `, ${locality}`;
                }

                if (city) {
                    ret += `, ${city}`;
                }

                return ret;
            }
        } catch (e: any) {
            // do nothing
        }

        return "-";
    }

    async function onPickCoordinates(pickedCoordinates: number[]) {
        setCoordinatePickerModalVisible(false);

        console.log("placeSearchModal onPickCoordinates");

        if (pickedCoordinates?.length !== 2) {
            return;
        }

        coordinatesToPlaceName(pickedCoordinates).then((placeName) => {
            console.log("place", placeName);

            setErrorMessage(null);
            setSearchResults(null);
            onPick(pickedCoordinates, placeName, pickType);
        });
    }

    async function onPressSearchResult(item: SearchResult) {
        const coordinates = [item.longitude, item.latitude];
        onPick(coordinates, item.placeName, pickType);
    }

    async function onPressClose() {
        console.log("placeSearchModal: onPressClose");

        //setSearchResults(null);
        setErrorMessage(null);
        onClose();
    }

    async function onCloseCoordinatePickerModal() {
        console.log("placeSearchModal: onCloseCoordinatePickerModal");

        setCoordinatePickerModalVisible(false);
    }

    async function onPressOpenCoordinatePickerModal() {
        console.log("placeSearchModal: onPressOpenCoordinatePickerModal");

        setCoordinatePickerModalVisible(true);
    }

    async function onPressCurrentLocation() {
        setErrorMessage(null);

        Geolocation.requestAuthorization(
            () => {
                // success
                Geolocation.getCurrentPosition(
                    (position) => {
                        const coords = [
                            position.coords.longitude,
                            position.coords.latitude
                        ];

                        coordinatesToPlaceName(coords).then((placeName) => {
                            console.log("place", placeName);

                            setErrorMessage(null);
                            setSearchResults(null);
                            onPick(coords, placeName, pickType);
                        });
                    },
                    (error) => {
                        console.log("Location error:", error);

                        if (error.code === error.TIMEOUT) {

                        }
                        else if (error.code === error.PERMISSION_DENIED) {

                        }
                        else if (error.code === error.POSITION_UNAVAILABLE) {

                        }
                        else {

                        }
                    },
                    {
                        timeout: 1000
                    }
                )
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    Alert.alert("Sijainti", "Anna sovellukselle lupa käyttää sijaintiasi.");
                }
                else {
                    Alert.alert("Sijainti", "Tuntematon virhe.");
                }
            }
        )
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                onPressClose();
            }}
        >
            <CoordinatePickerModal
                visible={coordinatePickerModalVisible}
                onClose={onCloseCoordinatePickerModal}
                onPick={onPickCoordinates}
                initialCoordinates={initialCoordinates}
            />

            <View
                style={[
                    styles.modalMainContainer,
                    {
                        marginBottom: (insets.bottom),
                        marginTop: (StatusBar.currentHeight || 0),
                        //marginHorizontal: 8,
                    }
                ]}
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 8,
                        gap: 8,
                        backgroundColor: "white",
                        borderRadius: 10,
                        borderWidth: 1
                    }}
                >
                    <TouchableOpacity onPress={onPressClose}>
                        <MaterialIcons
                            name="arrow-back-ios-new"
                            style={{ fontSize: 24, color: "black" }}
                        />
                    </TouchableOpacity>

                    <TextInput
                        style={styles.textInput}
                        value={searchText}
                        placeholderTextColor={"gray"}
                        placeholder="Kirjoita hakeaksesi"
                        onChangeText={setSearchText}
                        numberOfLines={1}
                    />
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                        style={{
                            width: 44,
                            height: 44,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 8,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "black"
                        }}
                        onPress={onPressCurrentLocation}
                    >
                        <MaterialIcons
                            name="gps-fixed"
                            style={{ fontSize: 24, color: "black" }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            width: 44,
                            height: 44,
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 8,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "black"
                        }}
                        onPress={onPressOpenCoordinatePickerModal}
                    >
                        <MaterialIcons
                            name="map"
                            style={{ fontSize: 24, color: "black" }}
                        />
                    </TouchableOpacity>
                </View>



                {
                    errorMessage ? (
                        <Text style={[styles.text, styles.headingText, { color: "red" }]}>
                            {errorMessage}
                        </Text>
                    ) : (
                        <Text style={[styles.text, styles.headingText]}>
                            {searchResults ? `${searchResults.length} hakutulosta` : "Kirjoita vähintään 3 kirjainta hakeaksesi."}
                        </Text>
                    )
                }

                <FlatList
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    ListFooterComponent={() => <View style={{ height: 200 }} />}
                    data={searchResults}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity
                                style={styles.searchResultContainer}
                                onPress={() => onPressSearchResult(item)}
                            >
                                <View style={styles.searchResultContainerRow}>
                                    <MaterialIcons
                                        name="location-on"
                                        style={styles.iconGray}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.text, styles.headingText]} numberOfLines={1}>
                                            {item.placeName}
                                        </Text>
                                        <Text style={[styles.text, styles.normalText]} numberOfLines={1}>
                                            {item.location}
                                        </Text>
                                    </View>
                                    <MaterialIcons
                                        name="arrow-forward-ios"
                                        style={styles.iconBlack}
                                    />
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>

        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff3c0ff',
        padding: 8,
        gap: 8
    },
    modalMainContainer: {
        backgroundColor: '#fff3c0ff',
        width: "100%",
        height: "100%",
        zIndex: 9,
        pointerEvents: "box-none",
        gap: 8,
        padding: 8
    },
    searchBar: {
        backgroundColor: "white",
        flexDirection: "row",
        padding: 8,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        //alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
    },
    textInput: {
        flex: 1,
        borderRadius: 10,
        //backgroundColor: "green",
        color: "black",
        fontSize: 16,
        padding: 8
    },
    iconBlack: {
        color: "black",
        fontSize: 32
    },
    iconGray: {
        color: "gray",
        fontSize: 32
    },
    text: {
        color: "black",
    },
    headingText: {
        fontSize: 16,
        fontWeight: "bold"
    },
    normalText: {
        fontSize: 14,
    },
    searchResultContainer: {
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 8
    },
    searchResultContainerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    }
});