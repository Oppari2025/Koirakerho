import AppHeader from '@/components/appHeader';
import { Heading } from '@/components/ui/heading';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function dogProfileScreen() {
    const { name, imageUrl, breed, age, description, gender, size } = useLocalSearchParams<{
        name: string;
        imageUrl: string;
        breed: string;
        age: string;
        description: string;
        gender: string;
        size: string;
    }>();

    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <AppHeader title={name} />
            <View className="m-4 p-4 rounded">
                    <Image
                        source={{ uri: imageUrl }}
                        className="h-64 w-64 rounded-lg mb-2"
                    />
            </View>
            <View className=" mx-6 mb-4 p-5 rounded-lg">
                <Heading size="md" className="mb-2">Description: {description}</Heading>
                <Heading size="md" className="mb-2">Breed: {breed}</Heading>
                <Heading size="md" className="mb-2">Age: {age}</Heading>
                <Heading size="md" className="mb-2">Gender: {gender}</Heading>
                <Heading size="md" className="mb-2">Size: {size}</Heading>
            </View>
        </SafeAreaView>
    );
}
