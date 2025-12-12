import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Image } from '@/components/ui/image';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from "@/components/ui/vstack";
import { ThemeContext } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from "expo-router";
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function EventScreen() {
    const router = useRouter();
    const darkTheme = React.useContext(ThemeContext);
    const eventId = useLocalSearchParams<{ id: string }>();

    // Toggles
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
    const [isEditable, setIsEditable] = React.useState<boolean>(true); // is admin

    // Form fields
    const [eventImageUrl, setEventImageUrl] = React.useState<string>("https://gluestack.github.io/public-blog-video-assets/saree.png");
    const [eventName, setEventName] = React.useState<string>("");
    const [eventType, setEventType] = React.useState<string>("");
    const [eventDescription, setEventDescription] = React.useState<string>("");
    const [eventStartTime, setEventStartTime] = React.useState<string>("");
    const [eventEndTime, setEventEndTime] = React.useState<string>("");
    const [eventAllowedDogsChecks, setEventAllowedDogsChecks] = React.useState<string[]>([]);
    const [eventLocationAddress, setEventLocationAddress] = React.useState<string>();
    const [eventLocationLatitude, setEventLocationLatitude] = React.useState<number>(0);
    const [eventLocationLongitude, setEventLocationLongitude] = React.useState<number>(0);


    function onPressEditEventButton() {
        setIsEditMode(true);
    }

    function onPressDiscardChangesButton() {
        setIsEditMode(false);
    }

    function onPressSaveChangesButton() {
        setIsEditMode(false);
    }

    function onPressLocationField() {
        router.navigate(`/(main)/mapScreen?latitude=${eventLocationLatitude}&longitude=${eventLocationLongitude}`)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className={classes.page}>
                <VStack className={classes.pageContent}>
                    <VStack className="mt-2 mr-2 ml-2">
                        <VStack className='h-120 mb-2'>
                            <Image
                                source={{
                                    uri: eventImageUrl,
                                }}
                                className="w-full h-40"
                                alt="image"
                            />
                        </VStack>
                        {
                            isEditable
                                ?
                                <VStack className="mb-2">
                                    {
                                        isEditMode
                                            ?
                                            <HStack className="gap-2">
                                                <Button
                                                    variant="solid"
                                                    size="md"
                                                    action="primary"
                                                    onPress={() => onPressSaveChangesButton()}
                                                >
                                                    <ButtonText>Save</ButtonText>
                                                </Button>
                                                <Button
                                                    variant="solid"
                                                    size="md"
                                                    action="primary"
                                                    onPress={() => onPressDiscardChangesButton()}
                                                >
                                                    <ButtonText>Discard</ButtonText>
                                                </Button>
                                            </HStack>
                                            :
                                            <HStack className="gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="md"
                                                    action="primary"
                                                    onPress={() => onPressEditEventButton()}
                                                >
                                                    <ButtonText>Edit</ButtonText>
                                                </Button>
                                            </HStack>
                                    }
                                </VStack>
                                :
                                null
                        }
                        <VStack className='mb-2 h-20'>
                            <Textarea
                                size="lg"
                                style={isEditMode ? null : { borderWidth: 0 }}
                                className="w-full h-full"
                                isReadOnly={!isEditMode}
                                isDisabled={false}
                                isRequired={true}>
                                <TextareaInput
                                    placeholder="Nameless Event"
                                    value={eventName}
                                    numberOfLines={3}
                                    onChangeText={(text) => setEventName(text)}
                                />
                            </Textarea>
                        </VStack>
                        <VStack className="mb-2">
                            <Pressable onPress={() => onPressLocationField()}>
                                <Text className='text-xl font-bold'>Location</Text>
                                <Text size="lg">Main Street 1</Text>
                            </Pressable>
                        </VStack>
                        <VStack>
                            <Text className='text-xl font-bold'>Description</Text>
                            <Textarea
                                size="lg"
                                className="w-full h-64"
                                style={isEditMode ? null : { borderWidth: 0 }}
                                isReadOnly={!isEditMode}
                                isDisabled={false}
                                isRequired={true}>
                                <TextareaInput
                                    placeholder="No information provided."
                                    value={eventDescription}
                                    numberOfLines={100}
                                    onChangeText={(text) => setEventDescription(text)}
                                />
                            </Textarea>
                        </VStack>
                    </VStack>
                </VStack>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
});

const classes = {
    page: "w-full h-full items-center",
    pageHeader: "w-full justify-center bg-[#888888]", //  
    pageHeaderText: "font-bold text-3xl p-2",
    pageContent: "w-full h-full",

    floatingButton: "w-16 h-16 absolute z-[10] bottom-4 bg-red-700 justify-center items-center rounded-full",
    floatingButtonText: "text-2xl",
}