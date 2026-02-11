import { addTicket } from "@/src/services/ticketService";
import { useStripe } from '@stripe/stripe-react-native';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';

async function fetchPaymentSheetParams(amount: number): Promise<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
}> {
    return fetch('/api/payment-sheet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
    }).then((res: { json: () => any; }) => res.json());
}

type CheckoutFormProps = {
    amount: number;
    event: {
        id: string;
        eventName: string;
        date: string;
        imageUrl?: string;
        eventInfo?: string;
    };
};

export default function CheckoutForm({ amount, event }: CheckoutFormProps) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = React.useState(false);
    const [paymentInitialized, setPaymentInitialized] = React.useState(false);

    const initializePaymentSheet = async () => {
        const { paymentIntent, ephemeralKey, customer } =
            await fetchPaymentSheetParams(amount);

        const { error } = await initPaymentSheet({
            merchantDisplayName: 'Example, Inc.',
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: true,
            defaultBillingDetails: {
                name: 'Jane Doe',
                email: 'jane.doe@example.com',
                phone: '+1234567890',
            },
            returnURL: Linking.createURL("stripe-redirect"),
        });
        if (!error) {
            setLoading(true);
            setPaymentInitialized(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');

            try {
                await addTicket({
                    eventId: event.id,
                    eventName: event.eventName,
                    startTime: event.date,
                    data: Date.now().toString(),
                });
                console.log("Ticket saved");
                router.replace("/ticketsScreen");
            } catch (err) {
                console.error("Failed to save ticket", err);
            }
        }
    };

    return (
        <>
            <TouchableOpacity
                className='mt-2 py-4 rounded-xl bg-blue-600 items-center'
                onPress={initializePaymentSheet}
            >
                <Text className='text-white font-bold'>Initialize Payment Sheet</Text>
            </TouchableOpacity>

            {paymentInitialized && (
                <TouchableOpacity
                    className='mt-2 py-4 rounded-xl bg-blue-600 items-center'
                    onPress={openPaymentSheet}
                >
                    <Text className='text-white font-bold'>Open Payment Sheet</Text>
                </TouchableOpacity>
            )}
        </>
    );
}   