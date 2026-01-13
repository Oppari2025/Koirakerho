import AppHeader from '@/components/appHeader';
import { Heading } from '@/components/ui/heading';
import { deleteDog } from '@/src/services/dogService';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function dogProfileScreen() {
    const {
        id,
        name,
        imageUrl,
        breed,
        age,
        description,
        gender,
        size,
    } = useLocalSearchParams<{
        id: string;
        name: string;
        imageUrl: string;
        breed: string;
        age: string;
        description: string;
        gender: string;
        size: string;
    }>();

    const handleDelete = () => {
        Alert.alert(
            'Delete dog',
            'Are you sure you want to delete this dog?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteDog(id);
                        router.replace('/profileScreen');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <AppHeader title={name} />

            <View className="m-4 p-4 rounded">
                <Image
                    source={{ uri: imageUrl }}
                    className="h-64 w-64 rounded-lg mb-2"
                />
            </View>

            <View className="mx-6 mb-4 p-5 rounded-lg">
                <Heading size="md" className="mb-2">Description: {description}</Heading>
                <Heading size="md" className="mb-2">Breed: {breed}</Heading>
                <Heading size="md" className="mb-2">Age: {age}</Heading>
                <Heading size="md" className="mb-2">Gender: {gender}</Heading>
                <Heading size="md" className="mb-2">Size: {size}</Heading>
            </View>
            <View className="px-2">
            <TouchableOpacity
                onPress={handleDelete}
                className=" mt-4 w-32 h-14 bg-error-500 p-4 rounded-lg"
            >
                <Text className="text-white text-center font-semibold">
                    Delete Dog
                </Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
