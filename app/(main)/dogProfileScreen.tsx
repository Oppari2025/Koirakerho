import AppHeader from '@/components/appHeader';
import { Heading } from '@/components/ui/heading';
import { deleteDog, getDogById } from '@/src/services/dogService';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function dogProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    return <DogProfileContent key={id} dogId={id} />;
}

function DogProfileContent({ dogId }: { dogId: string }) {
    const [dog, setDog] = useState<any>(null);

    useEffect(() => {
        if (!dogId) return;

        const loadDog = async () => {
            const data = await getDogById(dogId);
            if (!data) return;
            setDog(data);
        };

        loadDog();
    }, [dogId]);

    const handleDelete = () => {
        if (!dog) return;

        Alert.alert('Delete dog', 'Are you sure you want to delete this dog?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    await deleteDog(dog.id);
                    router.replace('/profileScreen');
                },
            },
        ]);
    };

    if (!dog) {
        return (
            <SafeAreaView className="flex-1 px-4 pt-6 items-center justify-center">
                <Text>Ladataan...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <View>
                <AppHeader title={dog.name} />
                <View className="absolute top-6 right-6">
                    <TouchableOpacity
                        onPress={() =>
                            router.push({
                                pathname: '/editDogProfileScreen',
                                params: { dogId: dog.id },
                            })
                        }
                    >
                        <MaterialIcons name="settings" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            </View>

            <View className="p-4 rounded self-center h-64 w-64 overflow-hidden bg-gray-200 mb-2">
                <Image
                    source={
                        dog.imageUrl
                            ? { uri: dog.imageUrl }
                            : require('../../assets/images/dog1.jpg')
                    }
                    className="h-full w-full rounded-lg "
                    resizeMode="cover"
                />
            </View>

            <View className="mx-6 mb-4 p-5 rounded-lg">
                <Heading size="md" className="mb-2">
                    Kuvaus: {dog.description}
                </Heading>
                <Heading size="md" className="mb-2">
                    Rotu: {dog.breed}
                </Heading>
                <Heading size="md" className="mb-2">
                    Ikä: {dog.age}
                </Heading>
                <Heading size="md" className="mb-2">
                    Sukupuoli: {dog.gender}
                </Heading>
                <Heading size="md" className="mb-2">
                    Koko: {dog.size}
                </Heading>
            </View>

            <View className="px-2">
                <TouchableOpacity
                    onPress={handleDelete}
                    className="mt-4 w-32 h-14 bg-error-500 p-4 rounded-lg"
                >
                    <Text className="text-white text-center font-semibold">Delete Dog</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
