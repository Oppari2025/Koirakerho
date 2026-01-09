import Button from "@/components/button";
import CheckBoxGroup from "@/components/checkBoxGroup";
import TextEditBox from "@/components/textEditBox";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function EventScreen() {
    const eventId = useLocalSearchParams<{ id: string }>();

    const [allowedDogs, setAllowedDogs] = React.useState<string[]>([]);
    const [isAdminControlsEnabled, setIsAdminControlsEnabled] = React.useState<boolean>(true);
    const [isEditMode, setIsEditMode] = React.useState<boolean>(true);

    async function onPressEdit() {
        setIsEditMode(true);
    }

    async function onPressSaveChanges() {
        setIsEditMode(false);
    }

    async function onPressDiscardChanges() {
        setIsEditMode(false);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className={classes.page}>
                {
                    isAdminControlsEnabled && (
                        <View style={{ width: "100%", position: "absolute", zIndex: 99, bottom: 0 }}>
                            {
                                isEditMode
                                    ? (
                                        <View style={{ width: "100%", alignSelf: "center" }}>
                                            <View style={{ flexDirection: "row", width: "100%", gap: 4 }}>
                                                <Button
                                                    style={{ backgroundColor: "#006b00ff", padding: 16, width: "20%" }}
                                                    textColor="#FFF"
                                                    title="Save"
                                                    onPress={onPressSaveChanges}
                                                />
                                                <Button
                                                    style={{ backgroundColor: "#c05b7dff", padding: 16, width: "20%" }}
                                                    textColor="#FFF"
                                                    title="Discard"
                                                    onPress={onPressDiscardChanges}
                                                />
                                            </View>
                                        </View>
                                    )
                                    : (
                                        <View>
                                            <Button
                                                style={{ backgroundColor: "#b8003dff", padding: 8, width: "20%" }}
                                                textColor="#FFF"
                                                title="Edit"
                                                onPress={onPressEdit}
                                            />
                                        </View>
                                    )
                            }
                        </View>
                    )
                }
                {
                    isEditMode && (
                        <View style={{
                            backgroundColor: "#ff0000ff",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                            height: 24,
                        }}>
                            <Text style={{ fontWeight: "bold" }}>Edit Mode</Text>
                        </View>
                    )
                }

                <ScrollView className={classes.pageContent}>

                    <View className="w-full gap-4" style={{ marginTop: 8, paddingLeft: 8, paddingRight: 8 }}>
                        <TextEditBox
                            label="Event Name"
                            numberOfLines={1}
                            isEditable={false}
                            onChangeText={() => { }}
                        />

                        <CheckBoxGroup
                            label="Allowed Dogs"
                            options={[
                                { label: "dsffsd", value: "dsfd" },
                                { label: "gdgsd", value: "dfgdsg" }
                            ]}
                            fontSize={16}
                            checkedValues={allowedDogs}
                            onChange={setAllowedDogs}
                            style={{ marginBottom: 15 }}
                        />

                        <CheckBoxGroup
                            label="Allowed Dogs"
                            options={[
                                { label: "dsffsd", value: "dsfd" },
                                { label: "gdgsd", value: "dfgdsg" }
                            ]}
                            fontSize={16}
                            checkedValues={allowedDogs}
                            onChange={setAllowedDogs}
                            style={{ marginBottom: 15 }}
                        />



                        <TextEditBox
                            label="Event Description"
                            numberOfLines={50}
                            isEditable={false}
                            onChangeText={() => { }}
                        />

                        <View style={{ height: 500 }} />


                    </View>


                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const classes = {
    page: "w-full h-full items-center",
    pageHeader: "w-full justify-center bg-[#888888]", //  
    pageHeaderText: "font-bold text-3xl p-2",
    pageContent: "mr-2 ml-2 w-full"
}