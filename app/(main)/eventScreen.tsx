import { addEventToGroupAction } from "@/components/database/groupActions";
import PlaceSearchModal from "@/components/placeSearchModal";
import { useAuth } from "@/src/context/AuthContext";
import { createEvent, getEventsByIds } from "@/src/services/eventService";
import { CheckBoxOption } from "@/types/checkbox";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Calendar from 'expo-calendar';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
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

const MIN_EVENT_NAME_LENGTH = 1
const MAX_EVENT_NAME_LENGTH = 100
const MIN_EVENT_DESCRIPTION_LENGTH = 1
const MAX_EVENT_DESCRIPTION_LENGTH = 1000

export default function EventScreen() {
    const defaultDate = new Date(Date.now());
    const insets = useSafeAreaInsets();
    const { firebaseUser } = useAuth();

    // routing
    const router = useRouter();
    const routerParams = useLocalSearchParams<{ id?: string, groupId?: string }>();
    const navigation = useNavigation();

    // state
    const [isEditMode, setIsEditMode] = useState<boolean>(!routerParams.id);
    const [isAdminControlsEnabled, setIsAdminControlsEnabled] = useState<boolean>(true);
    const [eventName, setEventName] = useState<string>("");
    const [eventStartDate, setEventStartDate] = React.useState<Date>(defaultDate);
    const [eventPlaceName, setEventPlaceName] = useState<string>("");
    const [eventLocationAddress, setEventLocationAddress] = useState<string>("");
    const [eventLocationCoordinates, setEventLocationCoordinates] = useState<number[]>();
    const [eventDescription, setEventDescription] = useState<string>("");
    const [eventAllowedDogs, setEventAllowedDogs] = useState<string[]>(["big", "medium", "small"]);
    const [eventAllowedPeople, setEventAllowedPeople] = useState<string[]>(["club_members", "dog_owners", "other"]);
    const [isPlaceSearchModalVisible, setIsPlaceSearchModalVisible] = useState<boolean>(false);
    const [eventImageUrl, setEventImageUrl] = useState<string>("");
    const [searchText, setSearchText] = useState<string>("");
    const [isInvalidEventName, setIsInvalidEventName] = React.useState(false);
    const [isInvalidEventDescription, setIsInvalidEventDescription] = React.useState(false);
    const [isInvalidAllowedDogs, setIsInvalidAllowedDogs] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [eventType, setEventType] = React.useState<"fun" | "competitive">("fun");

    // refs
    const previousEventName = useRef<string>("");
    const previousEventDescription = useRef<string>("");
    const previousAllowedDogs = useRef<string[]>([]);
    const previousAllowedPeople = useRef<string[]>([]);
    const previousEventPlaceName = useRef<string>("");
    const previousEventDate = useRef<Date>(defaultDate);
    const previousImageUrl = useRef<string>("");

    // effects

    useEffect(() => {
        if (!routerParams.id) {
            navigation.setOptions({ title: "Uusi tapahtuma" });
        }
        else {
            navigation.setOptions({ title: "Tapahtuma" });

            getEventsByIds([routerParams.id]).then(events => {
                if (events.length === 0) {
                    Alert.alert("Palvelinvirhe", "");
                    router.dismiss();
                }

                const event = events[0];

                setEventName(event.title);
                setEventDescription(event.description);
                setEventStartDate(event.date.toDate());
                setEventAllowedPeople(event.participants);
                //setEventAllowedDogs(event.dogs);
                //setEventImageUrl(event.imageUrl);
                setEventLocationAddress(event.location?.address || "");

                if (event.location) {
                    const { lat, lng, address } = event.location;

                    if (lat && lng) {
                        setEventLocationCoordinates([lng, lat]);
                    }

                    if (address) {
                        setEventLocationAddress(address);
                    }

                    //setEventPlaceName(event.location.placeName);
                }
            }).catch(error => {
                console.log(error);

                Alert.alert("Yhteysvirhe", "");
                router.back();
            })
        }
    }, [navigation, routerParams.id]);

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
        Alert.alert(
            "Peruuta muutokset",
            `Oletko varma, että haluat peruuttaa kaikki muutokset?`,
            [
                {
                    text: "Peruuta",
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: "OK",
                    onPress: () => {
                        // Restore old values.
                        setEventName(previousEventName.current);
                        setEventDescription(previousEventDescription.current);
                        setEventAllowedDogs(previousAllowedDogs.current);
                        setEventAllowedPeople(previousAllowedPeople.current);
                        setEventPlaceName(previousEventPlaceName.current);
                        setEventStartDate(previousEventDate.current);
                        setEventImageUrl(previousImageUrl.current);

                        setIsEditMode(false);
                    },
                    style: "default"
                },
            ]
        );
    }

    async function handleSubmitForm() {
        setIsLoading(true);

        const isInvalidEventName = eventName.length < MIN_EVENT_NAME_LENGTH || eventName.length > MAX_EVENT_NAME_LENGTH
        setIsInvalidEventName(isInvalidEventName);

        const isInvalidEventDescription = eventDescription.length < MIN_EVENT_DESCRIPTION_LENGTH || eventDescription.length > MAX_EVENT_DESCRIPTION_LENGTH
        setIsInvalidEventDescription(isInvalidEventDescription);

        const isInvalidForm = isInvalidEventName || isInvalidEventDescription || isInvalidAllowedDogs

        if (isInvalidForm) {
            console.log("invalid form");
            return;
        }

        try {
            // Luodaan tapahtuma
            const eventData = {
                title: eventName,
                eventName: eventName,
                description: eventDescription,
                eventType: eventType || undefined,
                date: Timestamp.now(),
                createdBy: firebaseUser?.uid,
                location: {
                    lat: !!eventLocationCoordinates ? eventLocationCoordinates[1] : 0,
                    lng: !!eventLocationCoordinates ? eventLocationCoordinates[0] : 0,
                    address: eventLocationAddress
                }
            };

            const res = await createEvent(eventData);

            // Jos tapahtuma luotiin ryhmässä, lisätään se ryhmään
            if (routerParams.groupId && res.id) {
                await addEventToGroupAction(routerParams.groupId, res.id);
                Alert.alert("Onnistui", "Tapahtuma lisätty ryhmään");
                router.back();
            } else if (res.id) {
                Alert.alert("Onnistui", "Tapahtuma luotu");
                router.back();
            }
        } catch (error: any) {
            console.error("Failed to create event:", error);
            Alert.alert("Virhe", error?.message ?? "Tapahtuman luonti epäonnistui");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        setIsLoading(true);

        try {
            const eventId = routerParams.id;

            // TODO: delete
            //const res = await deleteEvent(eventId);

            router.back();
        } catch (error: any) {
            Alert.alert("Palvelinvirhe", "");
        } finally {
            setIsLoading(false);
        }
    }

    async function onPressSaveChanges() {
        if (!routerParams.id) {
            handleSubmitForm();
        }
        else {
            Alert.alert(
                "Tallenna muutokset",
                `Oletko varma, että haluat tallentaa nämä muutokset?`,
                [
                    {
                        text: "Peruuta",
                        onPress: () => console.log('Cancel Pressed'),
                        style: "cancel",
                    },
                    {
                        text: "OK",
                        onPress: () => {
                            // TODO: Save to the db
                            setIsEditMode(false);
                        },
                        style: "default"
                    },
                ]
            );
        }
    }

    async function onPressDelete() {
        Alert.alert(
            "Poista tapahtuma",
            `Oletko varma, että haluat poistaa tämän tapahtuman? Tätä ei voi perua.`,
            [
                {
                    text: "Peruuta",
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: "OK",
                    onPress: () => {
                        handleDelete();
                    },
                    style: "destructive"
                },
            ]
        );
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

    async function onPressCoordinates() {
        console.log("press coordinates");

        if (isEditMode) {
            setIsPlaceSearchModalVisible(true);
        }
        else {

        }
    }

    async function onCloseCoordinatePicker() {
        setIsPlaceSearchModalVisible(false);
    }

    async function onPickCoordinates(coordinates: number[], placeName: string, pickType?: string) {
        setSearchText(placeName);
        console.log("COORDS", coordinates);

        setEventLocationCoordinates(coordinates);
        setIsPlaceSearchModalVisible(false);
    }

    async function onPressLocationName() {
        console.log("press location name");

        router.navigate(`/(main)/navigatorScreen?latitude=${eventLocationCoordinates![1]}&longitude=${eventLocationCoordinates![0]}&destinationName=${eventLocationAddress}`);
    }

    async function onPressAddress() {
        console.log("press address");

        router.navigate(`/(main)/navigatorScreen?latitude=${eventLocationCoordinates![1]}&longitude=${eventLocationCoordinates![0]}&destinationName=${eventLocationAddress}`);
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
                <PlaceSearchModal
                    visible={isPlaceSearchModalVisible}
                    onClose={onCloseCoordinatePicker}
                    onPick={onPickCoordinates}
                    initialCoordinates={eventLocationCoordinates}
                />

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
                                                {
                                                    routerParams.id && (
                                                        <TouchableOpacity
                                                            style={[styles.adminControlButton, { backgroundColor: "red" }]}
                                                            onPress={onPressDelete}
                                                        >
                                                            <MaterialIcons
                                                                style={styles.adminControlButtonIcon}
                                                                name="delete"
                                                            />
                                                        </TouchableOpacity>
                                                    )
                                                }

                                                <View style={{ flex: 1 }} />
                                                {
                                                    routerParams.id && (
                                                        <TouchableOpacity
                                                            style={[styles.adminControlButton, { backgroundColor: "orange" }]}
                                                            onPress={onPressDiscardChanges}
                                                        >
                                                            <MaterialIcons
                                                                style={styles.adminControlButtonIcon}
                                                                name="settings-backup-restore"
                                                            />
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                <TouchableOpacity
                                                    style={[styles.adminControlButton, { backgroundColor: "green" }]}
                                                    onPress={onPressSaveChanges}
                                                >
                                                    <MaterialIcons
                                                        style={styles.adminControlButtonIcon}
                                                        name="save"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <View style={styles.adminControlsButtonRow}>
                                                <TouchableOpacity
                                                    style={[styles.adminControlButton, { backgroundColor: "gold" }]}
                                                    onPress={onPressEdit}
                                                >
                                                    <MaterialIcons
                                                        style={styles.adminControlButtonIcon}
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
                                    className="text-lg font-bold text-black"
                                    numberOfLines={1}
                                >
                                    Tapahtuman nimi
                                </Text>
                            )
                        }
                        <TextInput
                            className="text-lg text-black"
                            style={[
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
                                className="text-lg font-bold text-black"
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
                                    className="text-base text-black"
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
                                    className="text-base text-black"
                                    numberOfLines={1}
                                >
                                    {eventStartDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.mainDetail}
                                disabled={isEditMode || !eventLocationCoordinates || eventLocationCoordinates.length < 2}
                                onPress={onPressLocationName}
                            >
                                <MaterialIcons
                                    name={"apartment"}
                                    style={styles.mainDetailIcon}
                                />
                                {
                                    isEditMode ? (
                                        <TextInput
                                            className="text-base text-black"
                                            style={
                                                isEditMode
                                                    ? [styles.textInput, styles.textInputEditing]
                                                    : styles.textInput
                                            }
                                            value={eventPlaceName}
                                            onChangeText={setEventPlaceName}
                                            placeholder="Nimetön paikka"
                                            placeholderTextColor="gray"
                                            editable={isEditMode}
                                            multiline={true}
                                        />
                                    ) : (

                                        <Text className="text-base text-black flex-1">
                                            {eventPlaceName.length > 0 ? eventPlaceName : "-"}
                                        </Text>
                                    )
                                }

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.mainDetail}
                                disabled={isEditMode || !eventLocationCoordinates || eventLocationCoordinates.length < 2}
                                onPress={onPressAddress}
                            >
                                <MaterialIcons
                                    name={"signpost"}
                                    style={styles.mainDetailIcon}
                                />
                                {
                                    isEditMode ? (
                                        <TextInput
                                            className="text-base text-black"
                                            style={isEditMode
                                                ? [styles.textInput, styles.textInputEditing]
                                                : styles.textInput
                                            }
                                            value={eventLocationAddress}
                                            onChangeText={setEventLocationAddress}
                                            placeholder="Ei osoitetta"
                                            placeholderTextColor="gray"
                                            editable={isEditMode}
                                            multiline={true}
                                        />
                                    ) : (

                                        <Text
                                            className="text-base text-black flex-1"
                                        >
                                            {eventLocationAddress.length > 0 ? eventLocationAddress : "-"}
                                        </Text>
                                    )
                                }

                            </TouchableOpacity>
                            {
                                isEditMode && (
                                    <TouchableOpacity
                                        style={styles.mainDetail}
                                        onPress={onPressCoordinates}
                                    >
                                        <MaterialIcons
                                            name={"gps-fixed"}
                                            style={styles.mainDetailIcon}
                                        />
                                        <View>
                                            <Text
                                                className="text-base text-black"
                                                numberOfLines={1}
                                            >
                                                {
                                                    (eventLocationCoordinates && eventLocationCoordinates.length >= 2)
                                                        ? `${eventLocationCoordinates[1]}, ${eventLocationCoordinates[0]}`
                                                        : "Ei koordinaatteja valittu."
                                                }
                                            </Text>
                                            <Text
                                                style={[styles.text, styles.mainDetailText]}
                                                numberOfLines={1}
                                            >
                                                {
                                                    (searchText && searchText.length > 0)
                                                        ? searchText
                                                        : "-"
                                                }
                                            </Text>
                                        </View>

                                    </TouchableOpacity>
                                )
                            }
                        </View>

                        <View style={styles.horizontalLineDashed} />

                        <View style={styles.mainDetailsContainer}>
                            <Text
                                className="text-lg font-bold text-black"
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
                                                <Text className="text-base text-black">
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
                                className="text-lg font-bold text-black"
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
                                                    className="text-base text-black"
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





                        <Text className="text-lg font-bold text-black">
                            Kuvaus
                        </Text>
                        <TextInput
                            className="text-base text-black"
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
        backgroundColor: '#fdfbd4',
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
    eventNameTextInput: {
        borderRadius: 10,
        borderColor: "black"
    },
    textInput: {
        flex: 1,
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
        fontSize: 32
    },
    adminControlsButtonRow: {
        flex: 1,
        //backgroundColor: "#003cff63",
        padding: 8,
        flexDirection: "row",
        gap: 4,
        justifyContent: "flex-end"
    },
    adminControlButton: {
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "gray"
    },
    adminControlButtonIcon: {
        fontSize: 32,
        color: "black"
    }
});
