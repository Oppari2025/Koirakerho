import DogCard from '@/components/dogCard';
import TeamCard from '@/components/teamCard';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/src/context/AuthContext';
import { getMyDogs } from '@/src/services/dogService';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <View className="m-6 p-5 bg-white rounded-lg">
                <VStack space="2xl">
                    <HStack space="md" style={{ alignItems: 'center' }}>
                        <Avatar className="bg-blue-600 ">
                            <AvatarFallbackText className="text-white">
                                {userProfile?.name ?? ''}
                            </AvatarFallbackText>
                        </Avatar>
                        <VStack>
                            <Heading size="sm" className='text-black'>{userProfile?.name ?? ''}</Heading>
                        </VStack>
                    </HStack>
                </VStack>
            </View>
            <View className="mt-4">
                <Text className="text-2xl font-bold text-white">My Dogs</Text>
                <DogCard dog={dog} name={''} image={undefined} />
            </View>
            <View className="mt-4">
                <Text className="text-2xl font-bold text-white">My Teams</Text>
                <TeamCard name={''} image={undefined} />
            </View>
        </SafeAreaView>
    );
}


