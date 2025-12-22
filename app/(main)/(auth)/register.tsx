import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React, { useState } from "react"
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useAuth } from "../../../src/context/AuthContext"

export default function Register() {
  const { register, loading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Rekisteröintifunktio
  const handleRegister = async () => {
    if (!email || !password || !name) {
      setErrorMessage("Täytä kaikki kentät")
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("Salasanat eivät täsmää")
      return
    }

    try {
      setErrorMessage("")
      await register(email, password, name)
    } catch (error: any) {
      setErrorMessage(error.message)
    }
  }

  return (
    <SafeAreaProvider style={styles.safe}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>

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
            placeholder="Name"
            placeholderTextColor="#111111ff"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#111111ff"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#111111ff"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Registering..." : "Register"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push?.('/login')}
            >
              <Text style={styles.secondaryButtonText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaProvider>
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
