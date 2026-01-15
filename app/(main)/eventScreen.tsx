import Button from "@/components/button";
import CheckBoxGroup from "@/components/checkBoxGroup";
import TextEditBox from "@/components/textEditBox";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function EventScreen() {
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

return (
    <SafeAreaProvider>
        <SafeAreaView style={{ width: "100%" }}>
            <ScrollView style={{ width: "100%", padding: 8 }}>
                <View style={{ gap: 16, marginTop: 8, width: "100%" }}>
                    <TextEditBox
                        label="Event Name"
                        placeholder="Nameless Event"
                        numberOfLines={1}
                        isEditable={isEditMode}
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
                        isEditable={isEditMode}
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
                        isEditable={isEditMode}
                        checkedValues={allowedDogs}
                        onChange={setAllowedDogs}
                        style={{}}
                    />

                    <TextEditBox
                        label="Event Description"
                        placeholder="No description provided."
                        numberOfLines={50}
                        isEditable={isEditMode}
                        value={eventDescription}
                        onChangeText={setEventDescription}
                    />

                    <View style={{ height: 500 }} />
                </View>
            </ScrollView>
            <View style={{ width: "100%" }}>
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
)


}

const classes = {
    page: "mr-2 ml-2 w-full h-full items-center",
    pageHeader: "w-full justify-center bg-[#888888]", //  
    pageHeaderText: "font-bold text-3xl p-2",
    pageContent: "mr-2 ml-2 w-full"
}