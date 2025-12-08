import DogCard from '@/components/dogCard';
import TeamCard from '@/components/teamCard';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function profileScreen() {

    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <View className="m-6 p-5 bg-white rounded-lg">
                <VStack space="2xl">
                    <HStack space="md" style={{ alignItems: 'center' }}>
                        <Avatar className="bg-blue-600 ">
                            <AvatarFallbackText className="text-white">
                                Ronald Richards
                            </AvatarFallbackText>
                        </Avatar>
                        <VStack>
                            <Heading size="sm" className='text-black'>Ronald Richards</Heading>
                        </VStack>
                    </HStack>
                </VStack>
            </View>
            <View className="mt-4">
                <Text className="text-2xl font-bold text-white">My Dogs</Text>
                <DogCard name={''} image={undefined} />
            </View>
            <View className="mt-4">
                <Text className="text-2xl font-bold text-white">My Teams</Text>
                <TeamCard name={''} image={undefined} />
            </View>
        </SafeAreaView>
    );
}


