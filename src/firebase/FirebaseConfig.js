import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js"
import { ReactNativeAsyncStorage } from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app"
import { initializeAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Firebasen konfiguraatio ja arvot ympäristömuuttujista
// hakeen arvot .env.local tiedostosta

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_DATABASE_URL,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})

export const db = getFirestore(app)