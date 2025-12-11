import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../FirebaseConfig';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/explore');
      setErrorMessage('Successfully logged in!');
    } catch (errorMessage) {
      setErrorMessage('Login failed. Check your credentials.');
    }
  };

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setErrorMessage('Successfully registered!');
    } catch (errorMessage) {
      setErrorMessage('Register failed. Check your info.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.container}>

          <Text style={styles.title}>Login</Text>

          {/* Email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Error message */}
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Sign Up */}
          <TouchableOpacity style={styles.secondaryButton} onPress={signUp}>
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Reset Password */}
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Reset Password</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600'
  },
  secondaryButton: {
    padding: 12,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500'
  },
  helperText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#444'
  },
  error: {
    marginBottom: 12,
    color: 'red',
    textAlign: 'center',
    fontWeight: '600',
  }
});
