import CheckoutForm from '@/components/checkout-form.native';
import { ThemedText } from '@/components/themed-text';
import { Image } from '@/components/ui/image';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BuyTicketsScreen() {

    const TICKET_PRICE = 10;
    const [quantity, setQuantity] = useState(1);
    const totalPrice = quantity * TICKET_PRICE;

   const event =
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        eventName: 'First Item',
        eventInfo: "This is test event number 1.",
        date: "01.01.2020",
        imageUrl: '',
      };
    


    return (
        <SafeAreaView className="flex-1 p-4 gap-4 ">
            <View className='flex-1'>
                <View className=' flex-1 gap-4'>
                    <View className="items-center flex-row justify-between w-full px-4 mb-4">
                        <Text className="text-xl text-white font-bold">{event?.eventName}</Text>
                        <Text className="text-base text-white">{event?.date}</Text>
                    </View>
                    <Image
                        source={event?.imageUrl ? { uri: event.imageUrl } : require('@/assets/images/dog1.jpg')}
                        alt={event?.eventName}
                        className="w-full h-64 rounded-lg"
                    />
                    <Text className="mt-4 text-base text-white">{event?.eventInfo}</Text>
                </View>
            </View>
            <View className='flex-1 justify-center'>
                <ThemedText className="text-2xl font-bold">
                    Osta lippu
                </ThemedText>
                <View className="p-4 rounded-xl bg-black/5 gap-1 flex-row justify-between">
                    <ThemedText className="text-lg font-semibold">
                        Peruslippu
                    </ThemedText>
                    <ThemedText>
                        10 € / kpl
                    </ThemedText>
                </View>
                <View className="flex-row items-center justify-center gap-5">
                    <TouchableOpacity
                        className="w-11 h-11 rounded-full bg-black/10 items-center justify-center"
                        onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        <ThemedText className="text-2xl font-bold">
                            −
                        </ThemedText>
                    </TouchableOpacity>

                    <ThemedText className="text-xl font-semibold">
                        {quantity}
                    </ThemedText>

                    <TouchableOpacity
                        className="w-11 h-11 rounded-full bg-black/10 items-center justify-center"
                        onPress={() => setQuantity(quantity + 1)}
                    >
                        <ThemedText className="text-2xl font-bold">
                            +
                        </ThemedText>
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-between">
                    <ThemedText>
                        Yhteensä
                    </ThemedText>
                    <ThemedText className="text-xl font-bold">
                        {totalPrice} €
                    </ThemedText>
                </View>
                <CheckoutForm amount={totalPrice} event={event} />
            </View>
        </SafeAreaView>
    );
}
