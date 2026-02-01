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

export default function CheckoutForm({ amount }: { amount: number }) {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = React.useState(false);

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
        }
    };

    const openPaymentSheet = async () => {
        const { error } = await presentPaymentSheet();
        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            Alert.alert('Success', 'Your order is confirmed!');
            router.replace('/ticketsScreen');
        }

    };

    return (
        <>
            <TouchableOpacity className='mt-2 py-4 rounded-xl bg-blue-600 items-center' onPress={initializePaymentSheet}>
                <Text className='text-white font-bold'>Initialize Payment Sheet</Text>
            </TouchableOpacity>
            <TouchableOpacity className='mt-2 py-4 rounded-xl bg-blue-600 items-center' onPress={openPaymentSheet}>
                <Text className='text-white font-bold'>Open Payment Sheet</Text>
            </TouchableOpacity>
        </>
    );
}   