import { Redirect } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '../../src/context/AuthContext'

export default function Index() {
    const { firebaseUser, userProfile, logout, loading } = useAuth()

    if (loading) return null

    if (!firebaseUser) {
        return <Redirect href="/login" />
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home</Text>
            <Text style={styles.welcome}>Tervetuloa takaisin {userProfile?.name ?? firebaseUser.email}</Text>

            <TouchableOpacity style={styles.button} onPress={logout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    
    container: { 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff3c0ff',
        padding: 24 
    },

    title: { 
        fontSize: 32, 
        fontWeight: '700', 
        marginBottom: 12 
    },

    welcome: { 
        fontSize: 18, 
        color: '#444', 
        marginBottom: 24 
    },

    button: { 
        backgroundColor: '#144100ff', 
        padding: 12, 
        borderRadius: 8 
    },

    buttonText: {
         color: '#fff', 
        fontWeight: '600' 
    }
})