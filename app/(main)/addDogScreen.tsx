import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { CircleIcon } from '@/components/ui/icon';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Textarea } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/src/context/AuthContext';
import { uploadDogImage } from '@/src/firebase/storage';
import { addDog } from '@/src/services/dogService';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function addDogScreen() {
    const { firebaseUser } = useAuth()
    const [status, setStatus] = useState<string | null>(null)
    const [name, setName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [breed, setBreed] = useState<string>('');
    const [description, setDescription] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>('Male');
    const [size, setSize] = useState<'Small' | 'Medium' | 'Large'>('Small');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Testinappi koiran lisäykseen
    const handleAddDog = async () => {
        setStatus('Lisätään koiraa...')
        // tarkistetaan omistajan uid, jolla estetään koirien lisäys ilman autentikointia
        if (!firebaseUser?.uid) {
            setStatus('Ei kirjautunutta käyttäjää, koiraa ei lisätä')
            return
        }

        try {
            let imageUrl: string = '';

            if (selectedImage) {
                imageUrl = await uploadDogImage(selectedImage);
            }
            const dogData = {
                ownerId: firebaseUser.uid,
                name,
                breed,
                age: Number(age),
                description,
                gender,
                size,
                imageUrl: selectedImage,
                healthAssessmentDone: true,
            };
            const res = await addDog(dogData)

            setStatus(`Koira '${dogData.name}' lisätty (id: ${res.id})`)
            console.log('Koira lisätty', res.id)
            router.back();
            //router.back on sitä varten että ei jää stackiin
            router.push('/profileScreen');
        } catch (e: any) {
            console.error(e)
            setStatus(`Koiran lisäys epäonnistui: ${e?.message ?? e}`)
        }
    }

    async function pickImage() {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.canceled && result.assets[0]?.uri) {
                setSelectedImage(result.assets[0].uri);
            } else {
                setError("Vaaditaan kuvien käyttöoikeus");
            }
        } catch (e: any) {
            console.error("Image pick failed", e);
            setError("Kuvan valinta epäonnistui: " + (e?.message ?? e));
        }
    }

    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <View className="flex-row mb-4">
                <FormControl className="flex-1">
                    <FormControlLabel>
                        <FormControlLabelText>Name</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="h-12 w-4/5 bg-white  rounded-lg">
                        <TextInput value={name} onChangeText={setName} />
                    </Textarea>
                </FormControl>
                <FormControl className="flex-1">
                    <FormControlLabel>
                        <FormControlLabelText>Age</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="h-12 w-20 bg-white  rounded-lg">
                        <TextInput value={age} onChangeText={setAge} />
                    </Textarea>
                </FormControl>
            </View>
            <FormControl>
                <FormControlLabel>
                    <FormControlLabelText>Description</FormControlLabelText>
                </FormControlLabel>
                <Textarea className="h-20  bg-white  rounded-lg">
                    <TextInput value={description} onChangeText={setDescription} multiline placeholder='How would you describe your dog to others?' />
                </Textarea>
            </FormControl>
            <FormControl>
                <FormControlLabel>
                    <FormControlLabelText>Breed</FormControlLabelText>
                </FormControlLabel>
                <Textarea className="h-12 w-3/6 bg-white  rounded-lg">
                    <TextInput value={breed} onChangeText={setBreed} />
                </Textarea>
            </FormControl>
            <FormControl>
                <FormControlLabel>
                    <FormControlLabelText>Male or female</FormControlLabelText>
                </FormControlLabel>
                <RadioGroup className="my-2" value={gender} onChange={setGender}>
                    <VStack space="sm">
                        <Radio size="sm" value="Male">
                            <RadioIndicator>
                                <RadioIcon as={CircleIcon} />
                            </RadioIndicator>
                            <RadioLabel>Male</RadioLabel>
                        </Radio>
                        <Radio size="sm" value="Female">
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
                    <TouchableOpacity onPress={pickImage}>
                        <Text className='bg-white w-3/6 p-2 mx-4 my-2 rounded-lg'>Select Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAddDog}>
                        <Text className='bg-white w-1/6 p-2 mx-4 my-2 rounded-lg'>Add dog</Text>
                    </TouchableOpacity>
                </FormControl>
            </FormControl>
        </SafeAreaView>
    );
}

