import {
    Button,
    ButtonText
} from '@/components/ui/button';
import {
    Checkbox,
    CheckboxGroup,
    CheckboxIcon,
    CheckboxIndicator,
    CheckboxLabel,
} from '@/components/ui/checkbox';
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
    FormControlHelper,
    FormControlHelperText,
    FormControlLabel,
    FormControlLabelText
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { AlertCircleIcon, CheckIcon, CircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import {
    Radio,
    RadioGroup,
    RadioIcon,
    RadioIndicator,
    RadioLabel,
} from '@/components/ui/radio';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const MIN_EVENT_NAME_LENGTH = 1
const MAX_EVENT_NAME_LENGTH = 100
const MIN_EVENT_DESCRIPTION_LENGTH = 1
const MAX_EVENT_DESCRIPTION_LENGTH = 1000

type AddEventScreenSearchParams = {
    location: number[]
}

export default function AddEventScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<any>();

    const [isInvalidEventName, setIsInvalidEventName] = React.useState(false);
    const [isInvalidEventDescription, setIsInvalidEventDescription] = React.useState(false);
    const [isInvalidAllowedDogs, setIsInvalidAllowedDogs] = React.useState(false);

    const [eventName, setEventName] = React.useState<string>("");
    const [eventType, setEventType] = React.useState<string>("");
    const [eventLocationName, setEventLocationName] = React.useState<string>("");
    const [eventLocationAddress, setEventLocationAddress] = React.useState<string>("");
    const [eventLocationCoordinates, setEventLocationCoordinates] = React.useState<number[]>([0, 0]);
    const [eventDescription, setEventDescription] = React.useState<string>("");
    const [eventStartTime, setEventStartTime] = React.useState<string>("");
    const [eventEndTime, setEventEndTime] = React.useState<string>("");
    const [eventAllowedDogsChecks, setEventAllowedDogsChecks] = React.useState<string[]>([]);


    React.useEffect(() => {
        if (params?.selection) {
            setEventLocationCoordinates(params?.selection);
        }
    }, [params]);

    React.useEffect(() => {
        (async () => {
            console.log(eventAllowedDogsChecks);

        })();
    }, [eventAllowedDogsChecks])

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
            <VStack className={classes.page}>
                <ScrollView className={classes.pageContent}>
                    <VStack className={classes.form}>
                        <FormControl
                            isInvalid={isInvalidEventName}
                            size="lg"
                            isDisabled={false}
                            isReadOnly={false}
                            isRequired={true}
                        >
                            <FormControlLabel>
                                <FormControlLabelText>Event Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input className="my-1" size="lg">
                                <InputField
                                    type="text"
                                    placeholder="Event Name"
                                    value={eventName}
                                    onChangeText={(text) => setEventName(text)}
                                />
                            </Input>
                            <FormControlHelper>
                                <FormControlHelperText>
                                    The name of the event.
                                </FormControlHelperText>
                            </FormControlHelper>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} className={classes.formControlErrorText} />
                                <FormControlErrorText className={classes.formControlErrorText}>
                                    At least {MIN_EVENT_NAME_LENGTH} characters are required.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        <FormControl
                            isInvalid={isInvalidEventName}
                            size="lg"
                            isDisabled={false}
                            isReadOnly={false}
                            isRequired={true}
                        >
                            <FormControlLabel>
                                <FormControlLabelText>Location Name</FormControlLabelText>
                            </FormControlLabel>
                            <Input className="my-1" size="lg">
                                <InputField
                                    type="text"
                                    placeholder="Location Name"
                                    value={eventLocationName}
                                    onChangeText={(text) => setEventLocationName(text)}
                                />
                            </Input>
                            <FormControlHelper>
                                <FormControlHelperText>
                                    The name of the location where the event is hosted.
                                </FormControlHelperText>
                            </FormControlHelper>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} className={classes.formControlErrorText} />
                                <FormControlErrorText className={classes.formControlErrorText}>
                                    At least {MIN_EVENT_NAME_LENGTH} characters are required.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        <FormControl
                            isInvalid={isInvalidEventName}
                            size="lg"
                            isDisabled={false}
                            isReadOnly={false}
                            isRequired={false}
                        >
                            <FormControlLabel>
                                <FormControlLabelText>Location Address</FormControlLabelText>
                            </FormControlLabel>
                            <Input className="my-1" size="lg">
                                <InputField
                                    type="text"
                                    placeholder="Location Address"
                                    value={eventLocationAddress}
                                    onChangeText={(text) => setEventLocationAddress(text)}
                                />
                            </Input>
                            <FormControlHelper>
                                <FormControlHelperText>
                                    The street address of the location where the event is hosted.
                                </FormControlHelperText>
                            </FormControlHelper>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} className={classes.formControlErrorText} />
                                <FormControlErrorText className={classes.formControlErrorText}>
                                    At least {MIN_EVENT_NAME_LENGTH} characters are required.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        <FormControl
                            isInvalid={isInvalidEventName}
                            size="lg"
                            isDisabled={false}
                            isReadOnly={false}
                            isRequired={false}
                        >
                            <FormControlLabel>
                                <FormControlLabelText>Location Coordinates</FormControlLabelText>
                            </FormControlLabel>
                            <Button
                                className="my-1"
                                size="lg"
                                variant="outline"
                                onPress={() => {
                                    router.navigate({
                                        pathname: "/(main)/coordinatePickerScreen"
                                    });
                                }}
                            >
                                <ButtonText>
                                    {
                                        eventLocationCoordinates
                                            ? `${eventLocationCoordinates}`
                                            : "Pick on Map"
                                    }
                                </ButtonText>
                            </Button>
                            <FormControlHelper>
                                <FormControlHelperText>
                                    The coordinates of the location where the event is hosted.
                                </FormControlHelperText>
                            </FormControlHelper>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} className={classes.formControlErrorText} />
                                <FormControlErrorText className={classes.formControlErrorText}>
                                    At least {MIN_EVENT_NAME_LENGTH} characters are required.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>


                        <FormControl>
                            <VStack space="md">
                                <Heading size="sm">Event Type</Heading>
                                <RadioGroup value={eventType} onChange={(text) => setEventType(text)}>
                                    <VStack space="sm">
                                        <Radio value="Competitive" size="lg">
                                            <RadioIndicator>
                                                <RadioIcon as={CircleIcon} />
                                            </RadioIndicator>
                                            <RadioLabel>Competitive</RadioLabel>
                                        </Radio>
                                        <Radio value="Fun" size="lg">
                                            <RadioIndicator>
                                                <RadioIcon as={CircleIcon} />
                                            </RadioIndicator>
                                            <RadioLabel>Fun</RadioLabel>
                                        </Radio>
                                    </VStack>
                                </RadioGroup>
                                <FormControlHelper>
                                    <FormControlHelperText>
                                        Choose one.
                                    </FormControlHelperText>
                                </FormControlHelper>
                                <FormControlError>
                                    <FormControlErrorIcon as={AlertCircleIcon} className={classes.formControlErrorText} />
                                    <FormControlErrorText className={classes.formControlErrorText}>

                                    </FormControlErrorText>
                                </FormControlError>
                            </VStack>
                        </FormControl>


                        <FormControl>
                            <VStack space="md">
                                <Heading size="sm">Allowed Dogs</Heading>
                                <CheckboxGroup
                                    value={eventAllowedDogsChecks}
                                    onChange={(keys) => setEventAllowedDogsChecks(keys)}
                                >
                                    <VStack space="xl">
                                        <Checkbox value="small">
                                            <CheckboxIndicator>
                                                <CheckboxIcon as={CheckIcon} />
                                            </CheckboxIndicator>
                                            <CheckboxLabel>Small</CheckboxLabel>
                                        </Checkbox>
                                        <Checkbox value="medium" defaultIsChecked={true}>
                                            <CheckboxIndicator>
                                                <CheckboxIcon as={CheckIcon} />
                                            </CheckboxIndicator>
                                            <CheckboxLabel>Medium</CheckboxLabel>
                                        </Checkbox>
                                        <Checkbox value="large">
                                            <CheckboxIndicator>
                                                <CheckboxIcon as={CheckIcon} />
                                            </CheckboxIndicator>
                                            <CheckboxLabel>Large</CheckboxLabel>
                                        </Checkbox>
                                    </VStack>
                                </CheckboxGroup>
                            </VStack>
                        </FormControl>


                        <FormControl
                            isInvalid={isInvalidEventDescription}
                            size="lg"
                            isDisabled={false}
                            isReadOnly={false}
                            isRequired={true}
                        >
                            <FormControlLabel>
                                <FormControlLabelText>Description</FormControlLabelText>
                            </FormControlLabel>
                            <Textarea
                                size="lg"
                                className="w-128 h-64"
                                isReadOnly={false}
                                isDisabled={false}
                                isRequired={true}>
                                <TextareaInput
                                    placeholder="Description"
                                    value={eventDescription}
                                    numberOfLines={100}
                                    onChangeText={(text) => setEventDescription(text)}
                                />
                            </Textarea>
                            <FormControlHelper>
                                <FormControlHelperText>
                                    Write a description of the event. This must be at least {MIN_EVENT_DESCRIPTION_LENGTH} characters long.
                                </FormControlHelperText>
                            </FormControlHelper>
                            <FormControlError>
                                <FormControlErrorIcon as={AlertCircleIcon} className={classes.formControlErrorText} />
                                <FormControlErrorText className={classes.formControlErrorText}>
                                    At least {MIN_EVENT_DESCRIPTION_LENGTH} characters are required.
                                </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                    </VStack>
                </ScrollView>
                <Button
                    className={classes.submitButton}
                    size="lg"
                    variant="solid"
                    onPress={handleSubmitForm}
                >
                    <ButtonText>Create</ButtonText>
                </Button>
            </VStack>
        </SafeAreaProvider>
    );
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