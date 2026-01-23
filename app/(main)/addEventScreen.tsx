import Button from '@/components/button';
import CheckBoxGroup from '@/components/checkBoxGroup';
import TextEditBox from '@/components/textEditBox';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const MIN_EVENT_NAME_LENGTH = 1
const MAX_EVENT_NAME_LENGTH = 100
const MIN_EVENT_DESCRIPTION_LENGTH = 1
const MAX_EVENT_DESCRIPTION_LENGTH = 1000

export default function AddEventScreen() {
    const [isInvalidEventName, setIsInvalidEventName] = React.useState(false);
    const [isInvalidEventDescription, setIsInvalidEventDescription] = React.useState(false);
    const [isInvalidAllowedDogs, setIsInvalidAllowedDogs] = React.useState(false);

    const [eventName, setEventName] = React.useState("");
    const [eventType, setEventType] = React.useState("");
    const [eventDescription, setEventDescription] = React.useState("");
    const [eventStartTime, setEventStartTime] = React.useState("");
    const [eventEndTime, setEventEndTime] = React.useState("");
    const [allowedDogs, setAllowedDogs] = React.useState<string[]>([]);
    const [allowedPeople, setAllowedPeople] = React.useState<string[]>([]);

    function handleSubmitForm() {
        const isInvalidEventName = eventName.length < MIN_EVENT_NAME_LENGTH || eventName.length > MAX_EVENT_NAME_LENGTH
        setIsInvalidEventName(isInvalidEventName);

        const isInvalidEventDescription = eventDescription.length < MIN_EVENT_DESCRIPTION_LENGTH || eventDescription.length > MAX_EVENT_DESCRIPTION_LENGTH
        setIsInvalidEventDescription(isInvalidEventDescription);

        const isInvalidForm = isInvalidEventName || isInvalidEventDescription || isInvalidAllowedDogs

        if (isInvalidForm) {
            return;
        }

        setIsInvalidEventName(false);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ width: "100%", backgroundColor: '#fff3c0ff' }}>
                <ScrollView style={{ width: "100%", padding: 8 }}>
                    <View style={{ gap: 16, marginTop: 8, width: "100%" }}>
                        <TextEditBox
                            label="Event Name"
                            placeholder="Nameless Event"
                            numberOfLines={1}
                            isEditable={true}
                            value={eventName}
                            onChangeText={setEventName}
                        />

                        <CheckBoxGroup
                            label="Allowed People"
                            options={[
                                { label: "Club Members", value: "members" },
                                { label: "Event Organizers", value: "organizers" },
                                { label: "Others", value: "others" }
                            ]}
                            fontSize={16}
                            isEditable={true}
                            checkedValues={allowedPeople}
                            onChange={setAllowedPeople}
                            style={{}}
                        />

                        <CheckBoxGroup
                            label="Allowed Dogs"
                            options={[
                                { label: "Small", value: "small" },
                                { label: "Medium", value: "medium" },
                                { label: "Big", value: "big" }
                            ]}
                            fontSize={16}
                            isEditable={true}
                            checkedValues={allowedDogs}
                            onChange={setAllowedDogs}
                            style={{}}
                        />

                        <TextEditBox
                            label="Event Description"
                            placeholder="No description provided."
                            numberOfLines={50}
                            isEditable={true}
                            value={eventDescription}
                            onChangeText={setEventDescription}
                        />

                        <View style={{ height: 500 }} />
                    </View>
                </ScrollView>
                <View style={{ width: "100%" }}>
                    <View style={{ width: "50%", flexDirection: "row", alignSelf: "center", justifyContent: "center", position: "relative", zIndex: 99, bottom: "150%", gap: 4 }}>
                        <Button
                            style={{ backgroundColor: "#006b00ff", padding: 16, flexGrow: 1, borderRadius: 10 }}
                            textColor="#FFF"
                            title="Create"
                            key="create"
                            onPress={handleSubmitForm}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}


const classes = {
    page: "w-full h-full items-center",
    pageHeader: "w-full justify-center",
    pageHeaderText: "font-bold text-3xl p-2",
    pageContent: "h-full mr-2 ml-2",

    form: "gap-4",
    formControlErrorText: "text-red-500",
    submitButton: "absolute bottom-0 w-full rounded-t-full"
}