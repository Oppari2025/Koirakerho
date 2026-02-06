import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type SearchResult = {
    placeName: string;
    location: string;
    longitude: number;
    latitude: number;
}

export default function placeSearchScreen(): React.JSX.Element {
    // routing
    const router = useRouter();

    // state
    const [searchText, setSearchText] = useState<string>("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // effects

    useEffect(() => {
        setErrorMessage(null);

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

    async function onPressSearchResult(item: SearchResult) {
        router.dismissTo({
            pathname: "/coordinatePickerScreen",
            params: {
                lon: item.longitude,
                lat: item.latitude,
                searchText: item.placeName
            }
        })
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <TextInput
                    style={styles.textInput}
                    value={searchText}
                    placeholderTextColor={"gray"}
                    placeholder="Kirjoita hakeaksesi"
                    onChangeText={setSearchText}
                    numberOfLines={1}
                />
                {
                    errorMessage ? (
                        <Text style={[styles.text, styles.headingText, { color: "red" }]}>
                            {errorMessage}
                        </Text>
                    ) : (
                        <Text style={[styles.text, styles.headingText]}>
                            {searchResults ? `${searchResults.length} hakutulosta` : "Kirjoita hakeaksesi."}
                        </Text>
                    )
                }

                <FlatList
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
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

            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff3c0ff',
        padding: 8,
        gap: 8
    },
    textInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        backgroundColor: "white",
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