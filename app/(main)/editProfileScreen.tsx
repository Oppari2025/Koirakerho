import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { CircleIcon } from '@/components/ui/icon';
import { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel } from '@/components/ui/radio';
import { Textarea } from '@/components/ui/textarea';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/src/context/AuthContext';
import { uploadProfileImage } from '@/src/firebase/storage';
import { updateUserProfile } from '@/src/services/userProfileService';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function editProfileScreen() {
    const { firebaseUser } = useAuth()
    const { userProfile } = useAuth()
    const [status, setStatus] = useState<string | null>(null)
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [description, setDescription] = useState('');
    const [gender, setGender] = useState<'Male' | 'Female'>(userProfile?.gender || 'Male');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleEditProfile = async () => {
        setStatus('Muokataan profiilia...');

        if (!firebaseUser?.uid) {
            setStatus('Ei kirjautunutta käyttäjää');
            return;
        }

        try {
            // Käytetään vanhoja arvoja jos uusia ei ole annettu
            const editData: Partial<any> = {};
            let imageUrl: string = '';
            if (selectedImage) {
                imageUrl = await uploadProfileImage(selectedImage, 'users', firebaseUser.uid);
            }
            if (firstName.trim() !== '') editData.firstName = firstName;
            if (lastName.trim() !== '') editData.lastName = lastName;
            if (age.trim() !== '') editData.age = Number(age);
            if (description.trim() !== '') editData.description = description;
            if (gender) editData.gender = gender;
            if (imageUrl) editData.imageUrl = imageUrl;

            if (Object.keys(editData).length === 0) {
                setStatus('Ei muutettavaa');
                return;
            }

            await updateUserProfile(editData, firebaseUser.uid);
            router.replace('/profileScreen');
        } catch (e: any) {
            console.error(e);
            setStatus(`Profiilin päivitys epäonnistui: ${e?.message ?? e}`);
        }
    };

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
                        <FormControlLabelText>First name</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="h-12 w-4/5 bg-white  rounded-lg">
                        <TextInput value={firstName} onChangeText={setFirstName} placeholder={userProfile?.firstName || "Enter first name"} />
                    </Textarea>
                </FormControl>

                <FormControl className="flex-1">
                    <FormControlLabel>
                        <FormControlLabelText>Age</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea className="h-12 w-20 bg-white  rounded-lg">
                        <TextInput value={age} onChangeText={setAge} placeholder={userProfile?.age?.toString() || "Enter age"} />
                    </Textarea>
                </FormControl>
            </View>
            <FormControl>
                <FormControlLabel>
                    <FormControlLabelText>Last name</FormControlLabelText>
                </FormControlLabel>
                <Textarea className="h-12 w-4/5 bg-white  rounded-lg">
                    <TextInput value={lastName} onChangeText={setLastName} placeholder={userProfile?.lastName || "Enter last name"} />
                </Textarea>
            </FormControl>
            <FormControl>
                <FormControlLabel>
                    <FormControlLabelText>Description</FormControlLabelText>
                </FormControlLabel>
                <Textarea className="h-20  bg-white  rounded-lg">
                    <TextInput value={description} onChangeText={setDescription} multiline placeholder={userProfile?.description || "Short description about yourself"} />
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
                    <TouchableOpacity onPress={pickImage}>
                        <Text className='bg-white w-3/6 p-2 mx-4 my-2 rounded-lg'>Select Image</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEditProfile}>
                        <Text className='bg-white w-1/6 p-2 mx-4 my-2 rounded-lg'>Edit Profile</Text>
                    </TouchableOpacity>
                </FormControl>
            </FormControl>
        </SafeAreaView>
    );
}

