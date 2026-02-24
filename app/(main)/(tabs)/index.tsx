import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <View style={styles.container}>
      <Text style={styles.greeting}>Hei, {userName}!</Text>
      <Text style={styles.subtitle}>Tervetuloa Koirakerhosovellukseen!</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/groupList')}>
        <Text style={styles.buttonText}>Ryhmät</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/profileScreen')}>
        <Text style={styles.buttonText}>Profiili</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/eventListScreen')}>
        <Text style={styles.buttonText}>Tapahtumat</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={logout}>
        <Text style={styles.buttonText}>Kirjaudu ulos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff3c0ff',
    padding: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#144100ff',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 32,
    color: '#111111ff',
  },
  button: {
    backgroundColor: '#144100ff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginBottom: 16,
    width: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});