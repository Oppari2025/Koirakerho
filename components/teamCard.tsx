import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

export default function DogCard({ name, image }: { name: string; image: any }) {

    // Test data untill database is ready
    const Data = {
        Team1: { name: 'Koira kuiskaajat', image: require('@/assets/images/Team1.jpg') },
        Team2: { name: 'Ulkoiluttajat', image: require('@/assets/images/Team2.jpg') },
    };


    return (
        <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
                {Object.values(Data).map((team, index) => (
                    <Card key={index} size="md" variant="elevated" className="m-3 bg-gray-600 p-2 rounded-lg">
                        {/* <TouchableOpacity key={index} onPress={() => router.push(`/teamProfileScreen`)}> */}
                        <TouchableOpacity key={index} onPress={() => console.log('Team pressed')}>
                            <Image source={team.image} className="h-32 w-32 rounded-lg mb-2" />
                            <Heading size="lg" className="mb-1 text-white self-center">
                                {team.name}
                            </Heading>
                        </TouchableOpacity>
                    </Card>
                ))}
            </ScrollView>
        </View>
    )
};


