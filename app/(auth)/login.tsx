import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';


export default function Login() {
  const { login, loading } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Täytä kaikki kentät')
      return
    }

    try {
      console.log('handleLogin: attempting login for', email)
      setErrorMessage('')
      await login(email, password)
      console.log('handleLogin: login() returned')
      router.replace?.('/')
    } catch (error: any) {
      console.error('handleLogin error', error)
      setErrorMessage(error.message)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#111111ff"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#111111ff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push?.('/register')}
          >
            <Text style={styles.secondaryButtonText}>Dont have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff3c0ff',
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
    borderColor: '#111111ff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16
  },
  button: {
    backgroundColor: '#144100ff',
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
    color: '#144100ff',
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
