import { StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import React from 'react';

const merchantId = Constants.expoConfig?.plugins?.find(
    (p) => p[0] === "@stripe/stripe-react-native"
)?.[1].merchantIdentifier;

if (!merchantId) {
    throw new Error("Merchant ID is not defined in app.json");
}

export default function expoStripeProvider(
    props: Omit<React.ComponentProps<typeof StripeProvider>,
    'publishableKey' | 'merchantIdentifier'>
) {
    return (
        <StripeProvider
            publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
            merchantIdentifier={merchantId}
            urlScheme={Linking.createURL('/')?.split(':')[0]}
            {...props} 
        />
    );
}