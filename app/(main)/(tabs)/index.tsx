import { Colors } from '@/constants/theme';
import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { userProfile, firebaseUser, loading, logout } = useAuth();

  React.useEffect(() => {
    if (!loading && !firebaseUser) {
      router.replace('/login');
    }
  }, [loading, firebaseUser]);

  if (loading) return null;

  const userName = userProfile?.firstName || firebaseUser?.email || 'Käyttäjä';

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.greeting}>Hei, {userName}!</Text>
        <Text style={styles.subtitle}>Tervetuloa Koirakerhosovellukseen!</Text>

        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.accent, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }]} onPress={() => router.push('/groupList')}>
          <Text style={styles.buttonText}>Ryhmät</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.accent, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }]} onPress={() => router.push('/profileScreen')}>
          <Text style={styles.buttonText}>Profiili</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.accent, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }]} onPress={() => router.push('/eventListScreen')}>
          <Text style={styles.buttonText}>Tapahtumat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors.light.accent, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }]} onPress={logout}>
          <Text style={styles.buttonText}>Kirjaudu ulos</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.card,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 16,
    width: 220,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  buttonText: {
    color: Colors.light.text,
    fontSize: 18,
    fontWeight: '600',
  },
});