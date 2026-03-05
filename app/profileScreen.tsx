import DogCard from '@/components/dogCard';
import TeamCard from '@/components/teamCard';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { getMyDogs } from '@/src/services/dogService';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function profileScreen() {
    const { userProfile } = useAuth()
    const [dog, setDogs] = useState<any[]>([])
    const [status, setStatus] = useState<string | null>(null)

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

    useFocusEffect(
        useCallback(() => {
            loadDogs();
        }, [])
    );

    const checkInfo = () => {
        if (!userProfile) return;
        console.log('User Profile Info:', userProfile);
        console.log('image url:', userProfile.imageUrl);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 px-4 pt-6" style={{ backgroundColor: Colors.light.background }}>
                <View className="m-6 p-5 bg-white rounded-lg w-4/6" style={{ alignSelf: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
                    <VStack space="2xl">
                        <HStack space="md" style={{ alignItems: 'center' }}>
                            <Avatar className="bg-blue-600">
                                {userProfile?.imageUrl ? (
                                    <AvatarImage source={{ uri: userProfile.imageUrl }} />
                                ) : (
                                    <AvatarFallbackText>
                                        <AvatarFallbackText className="text-black">
                                            {userProfile?.firstName?.[0].toUpperCase() ?? ''}
                                        </AvatarFallbackText>
                                    </AvatarFallbackText>
                                )}
                            </Avatar>
                            <VStack>
                                <Heading size="sm" className="text-black">
                                    {(userProfile?.firstName ?? '') + ' ' + (userProfile?.lastName ?? '') + ', ' + (userProfile?.age ?? '')}
                                </Heading>
                            </VStack>
                        </HStack>
                    </VStack>
                </View>
                <View>
                    <Text className="text-lg  text-black">{userProfile?.description}</Text>
                </View>
                <View className="mt-4 absolute top-12 right-6">
                    <TouchableOpacity onPress={() => router.push('/editProfileScreen')}>
                        <MaterialIcons name="settings" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View className="mt-4">
                    <Text className="text-2xl font-bold text-black">My Dogs</Text>
                    <DogCard dog={dog} name={''} image={undefined} />
                </View>
                <View className="mt-4">
                    <Text className="text-2xl font-bold text-black">My Teams</Text>
                    <TeamCard name={''} image={undefined} />
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}


