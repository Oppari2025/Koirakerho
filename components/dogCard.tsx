import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { getMyDogs } from '@/src/services/dogService';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

export default function DogCard({ name, image }: { name: string; image: any }) {

    const [status, setStatus] = useState<string | null>(null)
    const [dogs, setDogs] = useState<any[]>([])

    useEffect(() => {
        loadDogs()
    }, [])

    const loadDogs = async () => {
        setStatus('Ladataan koiria...')
        try {
            const list = await getMyDogs()
            setDogs(list)
            setStatus(null)
        } catch (e: any) {
            console.error(e)
            setStatus(`Koirien lataus epäonnistui: ${e?.message ?? e}`)
        }
    }

    const handleDogInfo = async () => {
        console.log(dogs.map(dog => ({ name: dog.name, imageUrl: dog.imageUrl, id: dog.id, breed: dog.breed, age: dog.age, description: dog.description, gender: dog.gender, size: dog.size })))
    }

    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                {dogs.map(dog => (
                    <Card key={dog.id} size="md" variant="elevated" className="m-3 bg-gray-600 p-2 rounded-lg">
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: '/dogProfileScreen',
                                    params: {
                                        id: dog.id,
                                        name: dog.name,
                                        imageUrl: dog.imageUrl,
                                        breed: dog.breed,
                                        age: dog.age,
                                        description: dog.description,
                                        gender: dog.gender,
                                        size: dog.size,
                                    },
                                })
                            }
                        >
                            <Image
                                source={{ uri: dog.imageUrl }}
                                className="h-32 w-32 rounded-lg mb-2"
                            />
                            <Heading size="lg" className="mb-1 text-white self-center">
                                {dog.name}
                            </Heading>
                        </TouchableOpacity>

                    </Card>
                ))}
                <Card size="md" variant="elevated" className="m-3 bg-gray-600 p-2 rounded-lg">
                    <TouchableOpacity onPress={() => router.push(`/addDogScreen`)}>
                        <MaterialIcons name="add-circle-outline" size={128} color="white" className="self-center mb-2" />
                        <Heading size="lg" className="mb-1 text-white self-center">
                            + Add Dog
                        </Heading>
                    </TouchableOpacity>
                </Card>
            </ScrollView>
        </View>
    )
};


