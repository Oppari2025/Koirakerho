import Button from "@/components/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function EventScreen() {
    const router = useRouter();

    const eventId = useLocalSearchParams<{ id: string }>();

    // State flags
    const [isAdminControlsEnabled, setIsAdminControlsEnabled] = React.useState<boolean>(true);
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);

    // Form values
    const [eventName, setEventName] = React.useState<string>("");
    const previousEventName = React.useRef<string>("");
    const [eventDescription, setEventDescription] = React.useState<string>("");
    const previousEventDescription = React.useRef<string>("");
    const [allowedDogs, setAllowedDogs] = React.useState<string[]>([]);
    const [allowedPeople, setAllowedPeople] = React.useState<string[]>([]);
    const [imageUrl, setImageUrl] = React.useState<string>("https://gluestack.github.io/public-blog-video-assets/saree.png");

    async function onPressEdit() {
        // Back up old values.
        previousEventName.current = eventName;
        previousEventDescription.current = eventDescription;

        setIsEditMode(true);
    }

    async function onPressDiscardChanges() {
        // Restore old values.
        setEventName(previousEventName.current);
        setEventDescription(previousEventDescription.current);

        setIsEditMode(false);
    }

    async function onPressSaveChanges() {
        setIsEditMode(false);
    }

    async function onPressEventDate() {
        if (isEditMode) {
            showDateTimePicker("date");
        }
    }

    async function onPressEventTime() {
        if (isEditMode) {
            showDateTimePicker("time");
        }
    }

    async function onPressEventPlace() {
        if (isEditMode) {
            router.navigate("/coordinatePickerScreen");
        } else {
            router.navigate("/navigatorScreen")
        }
    }

    const defaultDate = new Date(Date.now());
    const [date, setDate] = React.useState<Date>(defaultDate);

    const onChangeDateTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
        let currentDate = selectedDate;
        if (currentDate) {
            setDate(currentDate);
        }
    };

    const showDateTimePicker = (currentMode: "date" | "time") => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: onChangeDateTime,
            mode: currentMode,
            is24Hour: true,
        });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.page}>
                <ScrollView style={styles.scrollContainer}>
                    <Image
                        style={styles.bannerImage}
                        source={{ uri: imageUrl }}
                        alt="image"
                    />

                    <View style={styles.eventInfoContainer}>
                        <View style={styles.textInputContainer}>
                            {
                                isEditMode && (
                                    <Text style={styles.textInputLabel}>
                                        Event Name
                                    </Text>
                                )
                            }
                            <TextInput
                                style={[styles.textInput, {
                                    backgroundColor: isEditMode ? "#FFF" : undefined,
                                    borderWidth: isEditMode ? 1 : 0,
                                }]}
                                value={eventName}
                                onChangeText={setEventName}
                                placeholder="Nameless Event"
                                placeholderTextColor="gray"
                                editable={isEditMode}
                                multiline={true}
                            />
                        </View>

                        <View style={styles.dashedHorizontalLine} />

                        <View style={styles.detailsContainer}>
                            <TouchableOpacity
                                style={styles.detail}
                                onPress={onPressEventDate}
                            >
                                <MaterialIcons
                                    name="calendar-month"
                                    size={32}
                                />
                                <Text>
                                    {date.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.detail}
                                onPress={onPressEventTime}
                            >
                                <MaterialIcons
                                    name="access-time"
                                    size={32}
                                />
                                <Text>
                                    {date.toLocaleTimeString()}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.detail}
                                onPress={onPressEventPlace}
                            >
                                <MaterialIcons
                                    name="place"
                                    size={32}
                                />
                                <Text>
                                    Test Road 1
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.dashedHorizontalLine} />

                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 16
                            }}
                        >
                            Description
                        </Text>
                        <TextInput
                            style={{
                                backgroundColor: isEditMode ? "#FFF" : undefined,
                                borderWidth: isEditMode ? 1 : 0,
                                borderColor: "black",
                                borderRadius: 10,
                                color: "black",
                                fontSize: 16,
                            }}
                            value={eventDescription}
                            onChangeText={setEventDescription}
                            placeholder="No Description"
                            placeholderTextColor="gray"
                            editable={isEditMode}
                            multiline={true}

                        />


                        <View style={{ height: 3000 }} />
                    </View>
                </ScrollView>

                <View style={styles.adminControlsContainer}>
                    {
                        isAdminControlsEnabled && (
                            <View style={{ width: "50%", flexDirection: "row", alignSelf: "center", justifyContent: "center", position: "relative", zIndex: 99, bottom: "200%", gap: 4 }}>
                                {
                                    isEditMode
                                        ? (
                                            <>
                                                <Button
                                                    style={{ backgroundColor: "#006b00ff", padding: 16, flexGrow: 1, borderRadius: 10 }}
                                                    textColor="#FFF"
                                                    title="Save"
                                                    key="save"
                                                    onPress={onPressSaveChanges}
                                                />
                                                <Button
                                                    style={{ backgroundColor: "#bd003fff", padding: 16, flexGrow: 1, borderRadius: 10 }}
                                                    textColor="#FFF"
                                                    title="Discard"
                                                    key="discard"
                                                    onPress={onPressDiscardChanges}
                                                />
                                            </>
                                        )
                                        : (
                                            <>
                                                <Button
                                                    style={{ backgroundColor: "#e07b1cff", padding: 16, flexGrow: 1, borderRadius: 10 }}
                                                    textColor="#FFF"
                                                    title="Edit"
                                                    key="edit"
                                                    onPress={onPressEdit}
                                                />
                                            </>
                                        )
                                }
                            </View>
                        )
                    }
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    page: {
        width: "100%",
        height: "100%",
        backgroundColor: '#fff3c0ff',
    },
    scrollContainer: {
        width: "100%",
        height: "100%",
    },
    bannerImage: {
        width: "100%",
        height: 140
    },
    eventInfoContainer: {
        padding: 8,
        gap: 8
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
    },
    textInputContainer: {

    },
    dashedHorizontalLine: {
        borderBottomColor: "gray",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: "dashed"
    },
    detailsContainer: {
        gap: 8
    },
    detail: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16
    },
    adminControlsContainer: {
        width: "100%"
    }
});