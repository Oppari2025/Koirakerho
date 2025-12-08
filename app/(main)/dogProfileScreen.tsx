import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import React from 'react';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function dogProfileScreen() {

    return (
        <SafeAreaView className="flex-1 px-4 pt-6">
            <View className="m-6 p-5 bg-white rounded-lg">
                    <Card size="lg" variant="elevated" className="m-3 bg-gray-600 p-2 rounded-lg">
                        <Image source={require('@/assets/images/dog1.jpg')} className="h-64 w-64 rounded-lg mb-2" />
                        <Heading size="lg" className="mb-1 text-white self-center">
                            Test Dog
                        </Heading>
                    </Card>
            </View>
        </SafeAreaView>
    );
}


