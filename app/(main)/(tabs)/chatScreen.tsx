import { TouchableOpacity } from 'react-native';

import {
  Avatar,
  AvatarFallbackText
} from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function chatScreen() {

  const nameData = [
    {
      name: 'Ronald Richards',
      message: 'Hello, how are you?',
    },
    {
      name: 'Arlene McCoy',
      message: 'Are we still on for tomorrow?',
    },
    {
      name: 'John Smith',
      message: "Don't forget to bring the documents.",
    },
    {
      name: 'Walter White',
      message: 'Happy Birthday! Hope you have a great day!',
    },
    {
      name: 'Alice Johnson',
      message: "Let me know when you're available for a call.",
    },
  ];


  return (
    <SafeAreaView className="flex-1 p-4 py-6">
      <Heading size="lg" className="mb-6">
        Koirakerho
      </Heading>
      <ScrollView className='flex-1 pt-2' contentContainerStyle={{ gap: 24 }}>
        {nameData.map((item, index) => (
          <TouchableOpacity onPress={() => router.push(`/friendChatScreen`)} key={index}>
            <VStack space="2xl" className="p-4 border border-gray-200 rounded-lg" key={index}>
              <HStack space="md">
                <Avatar className="bg-indigo-600">
                  <AvatarFallbackText className="text-white">
                    {item.name}
                  </AvatarFallbackText>
                </Avatar>
                <VStack>
                  <Heading size="sm">{item.name}</Heading>
                  <Text size="sm">{item.message}</Text>
                </VStack>
              </HStack>
            </VStack>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
