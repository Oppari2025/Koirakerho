import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
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
            <View className="mt-4 ">
                <Text className="text-2xl font-bold text-white">My Dogs</Text>
                <Card size="md" variant="elevated" className="m-3 bg-gray-600 p-4 rounded-lg">
                    <Image source={require('@/assets/images/dog1.jpg')} className="h-32 w-32 rounded-lg mb-2" />
                    <Heading size="md" className="mb-1 text-white">
                        Onni
                    </Heading>
                </Card>
                <Card size="md" variant="elevated" className="m-3 bg-gray-600 p-4 rounded-lg">
                    <Image source={require('@/assets/images/dog2.jpg')} className="h-32 w-32 rounded-lg mb-2" />
                    <Heading size="md" className="mb-1 text-white">
                        Sulo 
                    </Heading>
                </Card>
                <Card size="md" variant="elevated" className="m-3 bg-gray-600 p-4 rounded-lg">
                    <Image source={require('@/assets/images/dog3.jpg')} className="h-32 w-32 rounded-lg mb-2" />
                    <Heading size="md" className="mb-1 text-white">
                        Retu 
                    </Heading>
                </Card>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
});
