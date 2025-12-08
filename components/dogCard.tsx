import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

export default function DogCard({ name, image }: { name: string; image: any }) {

    // Test data untill database is ready
    // Clicking on a dog card will in future open dog's profile page
    const Data = {
        Dog1: { name: 'Musti', image: require('@/assets/images/dog1.jpg') },
        Dog2: { name: 'Sulo', image: require('@/assets/images/dog2.jpg') },
        Dog3: { name: 'Onni', image: require('@/assets/images/dog3.jpg') },
    };


    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                {Object.values(Data).map((dog, index) => (
                    <Card key={index} size="md" variant="elevated" className="m-3 bg-gray-600 p-2 rounded-lg">
                        <TouchableOpacity key={index} onPress={() => router.push(`/dogProfileScreen`)}>
                            <Image source={dog.image} className="h-32 w-32 rounded-lg mb-2" />
                            <Heading size="lg" className="mb-1 text-white self-center">
                                {dog.name}
                            </Heading>
                        </TouchableOpacity>
                    </Card>
                ))}
            </ScrollView>
        </View>
    )
};


