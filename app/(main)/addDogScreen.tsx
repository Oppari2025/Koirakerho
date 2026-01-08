import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { CircleIcon } from '@/components/ui/icon';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Textarea } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import React, { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function addDogScreen() {
    const [values, setValues] = React.useState('Male');
    const [size, setSize] = React.useState('Small');
    const [descHeight, setDescHeight] = useState(0);


    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <View className="flex-row mb-4">
                <FormControl className="flex-1">
                    <FormControlLabel>
                        <FormControlLabelText>Name</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="h-12 w-4/5 bg-white  rounded-lg">
                        <TextInput />
                    </Textarea>
                </FormControl>
                <FormControl className="flex-1">
                    <FormControlLabel>
                        <FormControlLabelText>Age</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="h-12 w-20 bg-white  rounded-lg">
                        <TextInput />
                    </Textarea>
                </FormControl>
            </View>
            <FormControl>
                <FormControlLabel>
                    <FormControlLabelText>Description</FormControlLabelText>
                </FormControlLabel>
                <Textarea className="h-20  bg-white  rounded-lg">
                    <TextInput placeholder='How would you describe your dog to others?'/>
                </Textarea>
            </FormControl>
            <FormControl>
                <FormControlLabel>
                    <FormControlLabelText>Breed</FormControlLabelText>
                </FormControlLabel>
                <Textarea className="h-12 w-3/6 bg-white  rounded-lg">
                    <TextInput />
                </Textarea>
            </FormControl>
            <FormControl>
                <FormControlLabel>
                    <FormControlLabelText>Male or female</FormControlLabelText>
                </FormControlLabel>
                <RadioGroup className="my-2" value={values} onChange={setValues}>
                    <VStack space="sm">
                        <Radio size="sm" value="Mango">
                            <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Male</RadioLabel>
                        </Radio>
                        <Radio size="sm" value="Apple">
                            <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Female</RadioLabel>
                        </Radio>
                    </VStack>
                </RadioGroup>
                <FormControl>
                    <FormControlLabel>
                        <FormControlLabelText>Size</FormControlLabelText>
                    </FormControlLabel>
                    <RadioGroup className="my-2" value={size} onChange={setSize}>
                        <VStack space="sm">
                            <Radio size="sm" value="Small">
                                <RadioIndicator>
                                    <RadioIcon as={CircleIcon} />
                                </RadioIndicator>
                                <RadioLabel>Small</RadioLabel>
                            </Radio>
                            <Radio size="sm" value="Medium">
                                <RadioIndicator>
                                    <RadioIcon as={CircleIcon} />
                                </RadioIndicator>
                                <RadioLabel>Medium</RadioLabel>
                            </Radio>
                            <Radio size="sm" value="Large">
                                <RadioIndicator>
                                    <RadioIcon as={CircleIcon} />
                                </RadioIndicator>
                                <RadioLabel>Large</RadioLabel>
                            </Radio>
                        </VStack>
                    </RadioGroup>
                </FormControl>
            </FormControl>
        </SafeAreaView>
    );
}


