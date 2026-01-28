import Button from "@/components/button";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function EventScreen() {
    const eventId = useLocalSearchParams<{ id: string, eventName: string, eventInfo: string, date: string, imageUrl: string }>();

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
    const { event: eventString } = useLocalSearchParams<{ event: string }>();
    const event = eventString ? JSON.parse(eventString) : null;

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

    async function onPressBuyTicket() {
        router.push({
            pathname: '/buyTicketsScreen',
            params: {
                event: JSON.stringify(event), // EventScreeniltä saatu event
            },
        });
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    width: "100%",
                    backgroundColor: '#fff3c0ff',
                }}
            >
                <ScrollView
                    style={{
                        width: "100%",
                    }}
                >
                    <Image
                        source={{
                            uri: imageUrl,
                        }}
                        style={{
                            width: "100%",
                            height: 140
                        }}
                        alt="image"
                    />

                    <View
                        style={{
                            padding: 8,
                            gap: 8
                        }}
                    >
                        {
                            isEditMode && (
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 16
                                    }}
                                >
                                    Event Name
                                </Text>
                            )
                        }
                        <TextInput
                            style={{
                                backgroundColor: isEditMode ? "#FFF" : undefined,
                                borderWidth: isEditMode ? 1 : 0,

                                borderColor: "black",
                                borderRadius: 10,
                                color: "black",
                                fontSize: 20,

                            }}
                            value={eventName}
                            onChangeText={setEventName}
                            placeholder="Nameless Event"
                            editable={isEditMode}
                            multiline={true}
                        />

                        <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" }} />

                        <View
                            style={{
                                gap: 8
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 16
                                }}
                            >
                                <MaterialIcons
                                    name="calendar-month"
                                    size={32}
                                />
                                <Text>
                                    01.01.2020
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 16
                                }}
                            >
                                <MaterialIcons
                                    name="place"
                                    size={32}
                                />
                                <Text>
                                    Test Road 1
                                </Text>
                            </View>
                        </View>

                        <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" }} />

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
                            editable={isEditMode}
                            multiline={true}

                        />

                        <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" }} />

                        <View style={{ height: 300 }} />
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
                    <View style={{ width: "50%", flexDirection: "row", alignSelf: "center", justifyContent: "center", position: "relative", zIndex: 99, bottom: "150%", gap: 4 }}>
                        <Button
                            style={{ backgroundColor: "#825de8ff", padding: 16, flexGrow: 1, borderRadius: 10 }}
                            textColor="#FFF"
                            title="Buy ticket"
                            key="Buy Ticket"
                            onPress={onPressBuyTicket}
                        />
                    </View>
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