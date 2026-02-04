import { CheckBoxOption } from "@/types/checkbox";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const ALLOWED_DOGS_OPTIONS: CheckBoxOption[] = [
    { value: "big", label: "Isot" },
    { value: "medium", label: "Keskikokoiset" },
    { value: "small", label: "Pienet" },
];

const ALLOWED_PEOPLE_OPTIONS: CheckBoxOption[] = [
    { value: "club_members", label: "Kerhon jäsenet" },
    { value: "dog_owners", label: "Koiranomistajat" },
    { value: "other", label: "Muut" },
];

export default function EventScreen() {
    const defaultDate = new Date(Date.now());

    const insets = useSafeAreaInsets();

    // routing
    const router = useRouter();
    const eventId = useLocalSearchParams<{ id: string }>();
    

    // state
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [isAdminControlsEnabled, setIsAdminControlsEnabled] = useState<boolean>(true);
    const [eventName, setEventName] = useState<string>("");
    const [eventStartDate, setEventStartDate] = React.useState<Date>(defaultDate);
    const [eventPlaceName, setEventPlaceName] = useState<string>("Testipaikka");
    const [eventLocationAddress, setEventLocationAddress] = useState<string>("Testikatu 1, Testikaupunki, 00000");
    const [eventDescription, setEventDescription] = useState<string>("");
    const [eventAllowedDogs, setEventAllowedDogs] = useState<string[]>(["big", "medium", "small"]);
    const [eventAllowedPeople, setEventAllowedPeople] = useState<string[]>(["club_members", "dog_owners", "other"]);
    const [eventImageUrl, setEventImageUrl] = useState<string>("");

    // refs
    const previousEventName = useRef<string>("");
    const previousEventDescription = useRef<string>("");
    const previousAllowedDogs = useRef<string[]>([]);
    const previousAllowedPeople = useRef<string[]>([]);
    const previousEventPlaceName = useRef<string>("");
    const previousEventDate = useRef<Date>(defaultDate);
    const previousImageUrl = useRef<string>("");


    const onChangeDateTime = (event: DateTimePickerEvent, selectedDate?: Date) => {
        let currentDate = selectedDate;
        if (currentDate) {
            setEventStartDate(currentDate);
        }
    };

    const showDateTimePicker = (currentMode: "date" | "time") => {
        DateTimePickerAndroid.open({
            value: eventStartDate,
            onChange: onChangeDateTime,
            mode: currentMode,
            is24Hour: true,
        });
    };

    async function onPressEdit() {
        // Back up old values.
        previousEventName.current = eventName;
        previousEventDescription.current = eventDescription;
        previousAllowedDogs.current = eventAllowedDogs;
        previousAllowedPeople.current = eventAllowedPeople;
        previousEventPlaceName.current = eventPlaceName;
        previousEventDate.current = eventStartDate;
        previousImageUrl.current = eventImageUrl;

        setIsEditMode(true);
    }

    async function onPressDiscardChanges() {
        // Restore old values.
        setEventName(previousEventName.current);
        setEventDescription(previousEventDescription.current);
        setEventAllowedDogs(previousAllowedDogs.current);
        setEventAllowedPeople(previousAllowedPeople.current);
        setEventPlaceName(previousEventPlaceName.current);
        setEventStartDate(previousEventDate.current);
        setEventImageUrl(previousImageUrl.current);

        setIsEditMode(false);
    }

    async function onPressSaveChanges() {
        // TODO: Save to the db

        setIsEditMode(false);
    }

    async function onPressDelete() {
        // TODO: Delete from the db

        router.back();
    }

    async function getDefaultCalendarSource(): Promise<Calendar.Source> {
        const defaultCalendar = await Calendar.getDefaultCalendarAsync();
        return defaultCalendar.source;
    }

    async function createEventInCalendar() {
        const event: Calendar.Event = {
            id: "",
            calendarId: "",
            title: eventName.length > 0 ? eventName : "Koirakerhon tapahtuma",
            location: `${eventPlaceName}${eventLocationAddress.length > 0 ? "," : ""} ${eventLocationAddress}`,
            timeZone: "",
            notes: eventDescription,
            alarms: [],
            recurrenceRule: null,
            startDate: eventStartDate,
            endDate: eventStartDate,
            allDay: false,
            availability: Calendar.Availability.FREE,
            status: Calendar.EventStatus.CONFIRMED
        }

        const options: Calendar.PresentationOptions = {
            startNewActivityTask: false
        }

        await Calendar.createEventInCalendarAsync(event, options);
    }

    async function createReminderInCalendar() {
        const reminder: Calendar.Reminder = {

        }

        const calendarId = ""
        await Calendar.createReminderAsync(calendarId, reminder);
    }

    async function onPressDate() {
        if (isEditMode) {
            showDateTimePicker("date");
        }
        else {
            const { status } = await Calendar.requestCalendarPermissionsAsync();

            if (status !== Calendar.PermissionStatus.GRANTED) {
                return;
            }

            await createEventInCalendar();
        }
    }

    async function onPressTime() {
        if (isEditMode) {
            showDateTimePicker("time");
        }
        else {
            const { status } = await Calendar.requestCalendarPermissionsAsync();

            if (status !== Calendar.PermissionStatus.GRANTED) {
                return;
            }

            await createEventInCalendar();
        }
    }

    async function onPressLocation() {
        if (isEditMode) {
            router.navigate("/(main)/coordinatePickerScreen");
        }
        else {

        }
    }

    async function pickImage() {
        // No permissions request is necessary for launching the image library.
        // Manually request permissions for videos on iOS when `allowsEditing` is set to `false`
        // and `videoExportPreset` is `'Passthrough'` (the default), ideally before launching the picker
        // so the app users aren't surprised by a system dialog after picking a video.
        // See "Invoke permissions for videos" sub section for more details.
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        console.log(permissionResult);

        if (!permissionResult.granted) {
            Alert.alert('Permission required', 'Permission to access the media library is required.');
            return;
        }

        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ["images"],
            shape: "rectangle",
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        };

        let result = await ImagePicker.launchImageLibraryAsync(options);

        console.log(result);

        if (!result.canceled) {
            setEventImageUrl(result.assets[0].uri);
        }
    };


    async function onPressChangeImage() {
        console.log("change image");

        await pickImage();
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={[styles.container]}
            >
                <ScrollView style={styles.container}>
                    <View>
                        <Image
                            source={{ uri: eventImageUrl }}
                            style={styles.image}
                            alt="image"
                        />
                        {
                            isEditMode && (
                                <View style={styles.imageOverlay}>
                                    <View style={styles.imageButtonRow}>
                                        <TouchableOpacity
                                            style={styles.changeImageButton}
                                            onPress={onPressChangeImage}
                                        >
                                            <MaterialIcons
                                                name="edit"
                                                style={styles.changeImageButtonIcon}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }

                    </View>

                    {
                        isAdminControlsEnabled && (
                            <>
                                {
                                    isEditMode
                                        ? (
                                            <View style={styles.adminControlsButtonRow}>
                                                <TouchableOpacity
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        borderColor: "gray",
                                                        backgroundColor: "red",
                                                    }}
                                                    onPress={onPressDelete}
                                                >
                                                    <MaterialIcons
                                                        style={{ fontSize: 32 }}
                                                        name="delete"
                                                    />
                                                </TouchableOpacity>
                                                <View style={{ flex: 1 }} />
                                                <TouchableOpacity
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        borderColor: "gray",
                                                        backgroundColor: "orange",
                                                    }}
                                                    onPress={onPressDiscardChanges}
                                                >
                                                    <MaterialIcons
                                                        style={{ fontSize: 32 }}
                                                        name="settings-backup-restore"
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        borderColor: "gray",
                                                        backgroundColor: "green",
                                                    }}
                                                    onPress={onPressSaveChanges}
                                                >
                                                    <MaterialIcons
                                                        style={{ fontSize: 32 }}
                                                        name="save"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View style={styles.adminControlsButtonRow}>
                                                <TouchableOpacity
                                                    style={{
                                                        width: 48,
                                                        height: 48,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderRadius: 10,
                                                        borderWidth: 1,
                                                        borderColor: "gray",
                                                        backgroundColor: "gold",
                                                    }}
                                                    onPress={onPressEdit}
                                                >
                                                    <MaterialIcons
                                                        style={{ fontSize: 32 }}
                                                        name="edit"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )
                                }
                            </>
                        )
                    }



                    <View style={styles.contentContainer}>
                        {
                            isEditMode && (
                                <Text
                                    style={[styles.text, styles.headerText]}
                                    numberOfLines={1}
                                >
                                    Tapahtuman nimi
                                </Text>
                            )
                        }
                        <TextInput
                            style={[
                                styles.text,
                                isEditMode
                                    ? [styles.eventNameTextInput, styles.textInputEditing]
                                    : styles.eventNameTextInput
                            ]}
                            multiline={true}
                            placeholderTextColor={"gray"}
                            placeholder="Nimetön tapahtuma"
                            editable={isEditMode}
                            value={eventName}
                            onChangeText={setEventName}
                        />

                        <View style={styles.horizontalLineDashed} />

                        <View style={styles.mainDetailsContainer}>
                            <Text
                                style={[styles.text, styles.headerText]}
                                numberOfLines={1}
                            >
                                Aika ja paikka
                            </Text>
                            <TouchableOpacity
                                style={styles.mainDetail}
                                onPress={onPressDate}
                            >
                                <MaterialIcons
                                    name={"calendar-month"}
                                    style={styles.mainDetailIcon}
                                />
                                <Text
                                    style={[styles.text, styles.mainDetailText]}
                                    numberOfLines={1}
                                >
                                    {eventStartDate.toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.mainDetail}
                                onPress={onPressTime}

                            >
                                <MaterialIcons
                                    name={"access-time"}
                                    style={styles.mainDetailIcon}
                                />
                                <Text
                                    style={[styles.text, styles.mainDetailText]}
                                    numberOfLines={1}
                                >
                                    {eventStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                            <View
                                style={styles.mainDetail}
                            >
                                <MaterialIcons
                                    name={"apartment"}
                                    style={styles.mainDetailIcon}
                                />
                                {
                                    isEditMode ? (
                                        <TextInput
                                            style={[
                                                styles.text,
                                                isEditMode
                                                    ? [styles.textInput, styles.textInputEditing]
                                                    : styles.textInput
                                            ]}
                                            value={eventPlaceName}
                                            onChangeText={setEventPlaceName}
                                            placeholder="Nimetön paikka"
                                            editable={isEditMode}
                                            multiline={true}
                                        />
                                    ) : (

                                        <Text
                                            style={[styles.text, { fontSize: 16, flex: 1 }]}
                                        >
                                            {eventPlaceName.length > 0 ? eventPlaceName : "-"}
                                        </Text>
                                    )
                                }

                            </View>
                            <View
                                style={styles.mainDetail}
                            >
                                <MaterialIcons
                                    name={"signpost"}
                                    style={styles.mainDetailIcon}
                                />
                                {
                                    isEditMode ? (
                                        <TextInput
                                            style={[
                                                styles.text,
                                                isEditMode
                                                    ? [styles.textInput, styles.textInputEditing]
                                                    : styles.textInput
                                            ]}
                                            value={eventLocationAddress}
                                            onChangeText={setEventLocationAddress}
                                            placeholder="Ei osoitetta"
                                            editable={isEditMode}
                                            multiline={true}
                                        />
                                    ) : (

                                        <Text
                                            style={[styles.text, { fontSize: 16, flex: 1 }]}
                                        >
                                            {eventLocationAddress.length > 0 ? eventLocationAddress : "-"}
                                        </Text>
                                    )
                                }

                            </View>
                            {
                                isEditMode && (
                                    <TouchableOpacity
                                        style={styles.mainDetail}
                                        onPress={onPressLocation}
                                    >
                                        <MaterialIcons
                                            name={"gps-fixed"}
                                            style={styles.mainDetailIcon}
                                        />
                                        <Text
                                            style={[styles.text, styles.mainDetailText]}
                                            numberOfLines={1}
                                        >
                                            Ei koordinaatteja valittu.
                                        </Text>
                                    </TouchableOpacity>
                                )
                            }
                        </View>

                        <View style={styles.horizontalLineDashed} />

                        <View style={styles.mainDetailsContainer}>
                            <Text
                                style={[styles.text, styles.headerText]}
                                numberOfLines={1}
                            >
                                Sallitut osallistujat
                            </Text>
                            <View style={{}}>
                                {
                                    ALLOWED_PEOPLE_OPTIONS.map((item) => {
                                        const isChecked = eventAllowedPeople.includes(item.value);

                                        return (
                                            <TouchableOpacity
                                                key={item.value}
                                                style={{
                                                    //backgroundColor: "white",
                                                    padding: 8,
                                                    borderRadius: 10,
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 8,
                                                }}
                                                disabled={!isEditMode}
                                                onPress={() => {
                                                    if (isChecked) {
                                                        console.log("uncheck");
                                                        setEventAllowedPeople(eventAllowedPeople.filter(x => x !== item.value));
                                                    }
                                                    else {
                                                        console.log("check");
                                                        setEventAllowedPeople([...eventAllowedPeople, item.value]);
                                                    }

                                                    console.log(eventAllowedPeople);

                                                }}
                                            >
                                                <MaterialIcons
                                                    name={isChecked ? "check-circle" : "remove-circle"}
                                                    style={{ color: isChecked ? "green" : "red" }}
                                                    size={20}
                                                />
                                                <Text
                                                    style={[
                                                        styles.text,
                                                        {
                                                            //fontWeight: "bold",
                                                            fontSize: 16
                                                        }
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>



                        <View style={styles.horizontalLineDashed} />



                        <View style={styles.mainDetailsContainer}>
                            <Text
                                style={[styles.text, styles.headerText]}
                                numberOfLines={1}
                            >
                                Sallitut koirat
                            </Text>
                            <View style={{}}>
                                {
                                    ALLOWED_DOGS_OPTIONS.map((item) => {
                                        const isChecked = eventAllowedDogs.includes(item.value);

                                        return (
                                            <TouchableOpacity
                                                key={item.value}
                                                style={{
                                                    //backgroundColor: "white",
                                                    padding: 8,
                                                    borderRadius: 10,
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 8,
                                                }}
                                                disabled={!isEditMode}
                                                onPress={() => {
                                                    if (isChecked) {
                                                        console.log("uncheck");
                                                        setEventAllowedDogs(eventAllowedDogs.filter(x => x !== item.value));
                                                    }
                                                    else {
                                                        console.log("check");
                                                        setEventAllowedDogs([...eventAllowedDogs, item.value]);
                                                    }

                                                    console.log(eventAllowedDogs);

                                                }}
                                            >
                                                <MaterialIcons
                                                    name={isChecked ? "check-circle" : "remove-circle"}
                                                    style={{ color: isChecked ? "green" : "red" }}
                                                    size={20}
                                                />
                                                <Text
                                                    style={[
                                                        styles.text,
                                                        {
                                                            //fontWeight: "bold",
                                                            fontSize: 16
                                                        }
                                                    ]}
                                                >
                                                    {item.label}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </View>
                        </View>


                        <View style={styles.horizontalLineDashed} />





                        <Text style={[styles.text, styles.headerText]}>
                            Kuvaus
                        </Text>
                        <TextInput
                            style={[
                                styles.text,
                                isEditMode
                                    ? [styles.textInput, styles.textInputEditing]
                                    : styles.textInput
                            ]}
                            value={eventDescription}
                            onChangeText={setEventDescription}
                            placeholderTextColor={"gray"}
                            placeholder="Ei kuvausta"
                            editable={isEditMode}
                            multiline={true}
                        />

                        <View style={styles.horizontalLineDashed} />

                        <View style={{ height: 300 }} />
                    </View>
                </ScrollView>








            </SafeAreaView>
        </SafeAreaProvider>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: '#fff3c0ff'
    },
    image: {
        width: "100%",
        aspectRatio: 16 / 9,
        height: "auto",
        backgroundColor: 'gray'
    },
    contentContainer: {
        padding: 8,
        gap: 8
    },
    text: {
        color: "black"
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 16
    },
    eventNameTextInput: {
        fontSize: 20,
        borderRadius: 10,
        borderColor: "black"
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        borderRadius: 10,
        borderColor: "black"
    },
    textInputEditing: {
        backgroundColor: "#FFF",
        borderWidth: 1
    },
    horizontalLineDashed: {
        borderBottomColor: "gray",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: "dashed"
    },
    mainDetailsContainer: {
        //backgroundColor: "red",
        flex: 1,
        gap: 8
    },
    mainDetail: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    mainDetailIcon: {
        fontSize: 32
    },
    mainDetailText: {
        fontSize: 16
    },
    imageOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        position: "absolute",
        width: "100%",
        height: "100%",
        padding: 8
    },
    imageButtonRow: {
        alignItems: "flex-end",
    },
    changeImageButton: {
        backgroundColor: "#ffffff7f",
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        borderWidth: 1,
        borderColor: "gray"
    },
    changeImageButtonIcon: {
        fontSize: 36
    },
    adminControlsButtonRow: {
        flex: 1,
        //backgroundColor: "#003cff63",
        padding: 4,
        flexDirection: "row",
        gap: 4,
        justifyContent: "flex-end"
    }
});
