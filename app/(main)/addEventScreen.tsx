import Button from '@/components/button';
import CheckBoxGroup from '@/components/checkBoxGroup';
import { addEventToGroupAction } from '@/components/database/groupActions';
import TextEditBox from '@/components/textEditBox';
import { Colors } from '@/constants/theme';
import { createEvent } from '@/src/services/eventService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const MIN_EVENT_NAME_LENGTH = 1
const MAX_EVENT_NAME_LENGTH = 100
const MIN_EVENT_DESCRIPTION_LENGTH = 1
const MAX_EVENT_DESCRIPTION_LENGTH = 1000

export default function AddEventScreen() {
    // routing
    const { groupId } = useLocalSearchParams<{ groupId?: string }>();
    const router = useRouter();

    // state
    const [isInvalidEventName, setIsInvalidEventName] = React.useState(false);
    const [isInvalidEventDescription, setIsInvalidEventDescription] = React.useState(false);
    const [isInvalidAllowedDogs, setIsInvalidAllowedDogs] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [eventName, setEventName] = React.useState("");
    const [eventType, setEventType] = React.useState("");
    const [eventDescription, setEventDescription] = React.useState("");
    const [eventStartTime, setEventStartTime] = React.useState("");
    const [eventEndTime, setEventEndTime] = React.useState("");
    const [allowedDogs, setAllowedDogs] = React.useState<string[]>([]);
    const [allowedPeople, setAllowedPeople] = React.useState<string[]>([]);

    async function handleSubmitForm() {
        const isInvalidEventName = eventName.length < MIN_EVENT_NAME_LENGTH || eventName.length > MAX_EVENT_NAME_LENGTH
        setIsInvalidEventName(isInvalidEventName);

        const isInvalidEventDescription = eventDescription.length < MIN_EVENT_DESCRIPTION_LENGTH || eventDescription.length > MAX_EVENT_DESCRIPTION_LENGTH
        setIsInvalidEventDescription(isInvalidEventDescription);

        const isInvalidForm = isInvalidEventName || isInvalidEventDescription || isInvalidAllowedDogs

        if (isInvalidForm) {
            return;
        }

        setIsLoading(true);
        try {
            // Luodaan tapahtuma
            const eventData: any = {
                title: eventName,
                eventName: eventName,
                description: eventDescription,
                date: Timestamp.now(),
                createdBy: "",
                location: {
                    lat: 0,
                    lng: 0,
                    address: "Testikatu 1"
                }
            };
            if (eventType) eventData.eventType = eventType;

            const res = await createEvent(eventData);

            // Jos tapahtuma luotiin ryhmässä, lisätään se ryhmään
            if (groupId && res.id) {
                await addEventToGroupAction(groupId, res.id);
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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView style={{ width: "100%" }} contentContainerStyle={{ padding: 16, backgroundColor: Colors.light.card }}>
                    <View style={{ gap: 20, marginTop: 8, width: "100%" }}>
                        <TextEditBox
                            label="Tapahtuman nimi"
                            placeholder="Nimetön tapahtuma"
                            numberOfLines={1}
                            isEditable={true}
                            value={eventName}
                            onChangeText={setEventName}
                            labelStyle={{ color: Colors.light.text }}
                            inputStyle={{ color: Colors.light.text }}
                        />

                        <CheckBoxGroup
                            label="Sallitut henkilöt"
                            options={[
                                { label: "Jäsenet", value: "members" },
                                { label: "Järjestäjät", value: "organizers" },
                                { label: "Muut", value: "others" }
                            ]}
                            fontSize={16}
                            isEditable={true}
                            checkedValues={allowedPeople}
                            onChange={setAllowedPeople}
                            style={{}}
                            labelStyle={{ color: Colors.light.text }}
                            optionLabelStyle={{ color: Colors.light.text }}
                        />

                        <CheckBoxGroup
                            label="Sallitut koirat"
                            options={[
                                { label: "Pienet", value: "small" },
                                { label: "Keskikokoiset", value: "medium" },
                                { label: "Isot", value: "big" }
                            ]}
                            fontSize={16}
                            isEditable={true}
                            checkedValues={allowedDogs}
                            onChange={setAllowedDogs}
                            style={{}}
                            labelStyle={{ color: Colors.light.text }}
                            optionLabelStyle={{ color: Colors.light.text }}
                        />

                        <TextEditBox
                            label="Tapahtuman kuvaus"
                            placeholder="Ei kuvausta."
                            numberOfLines={6}
                            isEditable={true}
                            value={eventDescription}
                            onChangeText={setEventDescription}
                            labelStyle={{ color: Colors.light.text }}
                            inputStyle={{ color: Colors.light.text }}
                        />
                    </View>
                </ScrollView>
                <View style={{ width: "100%", backgroundColor: Colors.light.card, paddingVertical: 16 }}>
                    <View style={{ width: "60%", flexDirection: "row", alignSelf: "center", justifyContent: "center", gap: 8 }}>
                        <Button
                            style={{ backgroundColor: Colors.light.accent, padding: 16, flexGrow: 1, borderRadius: 12 }}
                            textColor={Colors.light.text}
                            title="Luo tapahtuma"
                            key="create"
                            onPress={handleSubmitForm}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.card,
    },
    text: {
        color: Colors.light.text,
    },
});


const classes = {
    page: "w-full h-full items-center",
    pageHeader: "w-full justify-center",
    pageHeaderText: "font-bold text-3xl p-2",
    pageContent: "h-full mr-2 ml-2",

    form: "gap-4",
    formControlErrorText: "text-red-500",
    submitButton: "absolute bottom-0 w-full rounded-t-full"
}