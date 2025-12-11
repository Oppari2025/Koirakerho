// Import the functions you need from the SDKs you need
import { AsyncStorage } from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0G2iRyEjWmjPiJxrlL-BxZPHBxpDz6gg",
  authDomain: "koirakerho-sovellus.firebaseapp.com",
  databaseURL: "https://koirakerho-sovellus-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "koirakerho-sovellus",
  storageBucket: "koirakerho-sovellus.firebasestorage.app",
  messagingSenderId: "630259350098",
  appId: "1:630259350098:web:9f8aa056acfa5f0149bd8b"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth;
try {
  auth = getAuth(app);
} catch {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
}

export { app, auth };
