import CheckoutForm from '@/components/checkout-form.native';
import { ThemedText } from '@/components/themed-text';
import { Image } from '@/components/ui/image';
import { addTicket } from '@/src/services/ticketService';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BuyTicketsScreen() {
    const { event: eventString } = useLocalSearchParams<{ event: string }>();
    const event = eventString ? JSON.parse(eventString) : null;

    const TICKET_PRICE = 10;
    const [quantity, setQuantity] = useState(1);
    const totalPrice = quantity * TICKET_PRICE;

    const generateId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const createTicketFromEvent = (event: any) => {
    return {
        eventId: event.id,
        eventName: event.eventName,
        data: generateId(),
        startTime: event.date,
        };
    };

    const ticketInfo = () => {
        const ticket = createTicketFromEvent(event);
        console.log('Created ticket:', ticket);
    }

    const saveTicket = async () => {
  if (!event) return;

  try {
    await addTicket({
      eventId: event.id,
      eventName: event.eventName,
      startTime: event.date,
      data: generateId(),
    });

    console.log("Ticket saved");
  } catch (err) {
    console.error("Failed to save ticket", err);
  }
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
                    source={{ uri: event?.imageUrl }}
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
            <CheckoutForm amount={totalPrice} />
            </View>
            <Button onPress={ticketInfo} title="Näytä lippuinfo" />
            <Button title="Tallenna lippu" onPress={saveTicket} />
        </SafeAreaView>
    );
}
