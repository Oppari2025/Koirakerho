import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { CircleIcon } from '@/components/ui/icon';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Textarea } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { uploadDogImage } from '@/src/firebase/storage';
import { getDogById, updateDog } from '@/src/services/dogService';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function editDogProfileScreen() {
    const { dogId } = useLocalSearchParams<{ dogId: string }>();

    const [dog, setDog] = useState<any>(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [breed, setBreed] = useState('');
    const [description, setDescription] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>('Male');
    const [size, setSize] = useState<'Small' | 'Medium' | 'Large'>('Small');
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        if (!dogId) return;

        const loadDog = async () => {
            const data = await getDogById(dogId);
            if (!data) return;

            setDog(data);
            setName(data.name || '');
            setAge(String(data.age || ''));
            setBreed(data.breed || '');
            setDescription(data.description || '');
            setGender((data.gender as 'Male' | 'Female') || 'Male');
            setSize(
                data.size === 'Small' || data.size === 'Medium' || data.size === 'Large'
                    ? data.size
                    : 'Small'
            );
            setImage(data.imageUrl || null);
        };

        loadDog();
    }, [dogId]);

    const handleSave = async () => {
        if (!dog) return;

        const updateData: any = {};
        if (name !== dog.name) updateData.name = name;
        if (+age !== dog.age) updateData.age = Number(age);
        if (breed !== dog.breed) updateData.breed = breed;
        if (description !== dog.description) updateData.description = description;
        if (gender !== dog.gender) updateData.gender = gender;
        if (size !== dog.size) updateData.size = size;

        if (image && image !== dog.imageUrl) {
            updateData.imageUrl = await uploadDogImage(image, dogId);
        }

        if (Object.keys(updateData).length === 0) return;

        await updateDog(dogId, updateData);
        router.back();
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets[0]?.uri) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <View className="flex-row mb-4">
                <FormControl className="flex-1">
                    <FormControlLabel>
                        <FormControlLabelText>Name</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="h-12 w-4/5 bg-white rounded-lg">
                        <TextInput
                            value={name}
                            onChangeText={setName}
                            placeholder="Dog name"
                        />
                    </Textarea>
                </FormControl>
                <FormControl className="flex-1">
                    <FormControlLabel>
                        <FormControlLabelText>Age</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="h-12 w-20 bg-white rounded-lg">
                        <TextInput
                            value={age}
                            onChangeText={setAge}
                            placeholder="Age"
                            keyboardType="numeric"
                        />
                    </Textarea>
                </FormControl>
            </View>
            <FormControl className="mb-4">
                <FormControlLabel>
                    <FormControlLabelText>Breed</FormControlLabelText>
                </FormControlLabel>
                <Textarea className="h-12 bg-white rounded-lg">
                    <TextInput
                        value={breed}
                        onChangeText={setBreed}
                        placeholder="Breed"
                    />
                </Textarea>
            </FormControl>
            <FormControl className="mb-4">
                <FormControlLabel>
                    <FormControlLabelText>Description</FormControlLabelText>
                </FormControlLabel>
                <Textarea className="h-24 bg-white rounded-lg">
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        placeholder="Description about the dog"
                    />
                </Textarea>
            </FormControl>
            <FormControl className="mb-4">
                <FormControlLabel>
                    <FormControlLabelText>Gender</FormControlLabelText>
                </FormControlLabel>
                <RadioGroup value={gender} onChange={setGender}>
                    <VStack space="sm">
                        <Radio value="Male">
                            <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Male</RadioLabel>
                        </Radio>
                        <Radio value="Female">
                            <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Female</RadioLabel>
                        </Radio>
                    </VStack>
                </RadioGroup>
            </FormControl>
            <FormControl className="mb-4">
                <FormControlLabel>
                    <FormControlLabelText>Size</FormControlLabelText>
                </FormControlLabel>

                <RadioGroup value={size} onChange={setSize}>
                    <VStack space="sm">
                        <Radio value="Small">
                            <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Small</RadioLabel>
                        </Radio>
                        <Radio value="Medium">
                            <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Medium</RadioLabel>
                        </Radio>
                        <Radio value="Large">
                            <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Large</RadioLabel>
                        </Radio>
                    </VStack>
                </RadioGroup>
            </FormControl>

            <FormControl className="mb-6">
                <FormControlLabel>
                    <FormControlLabelText>Image</FormControlLabelText>
                </FormControlLabel>
                <TouchableOpacity onPress={pickImage}>
                    <Text className="bg-white p-2 rounded-lg w-1/2 text-center">
                        Select Image
                    </Text>
                </TouchableOpacity>
            </FormControl>
            <TouchableOpacity onPress={handleSave}>
                <Text className="bg-green-600 text-white p-3 rounded-lg text-center font-bold">
                    Save Dog Profile
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}