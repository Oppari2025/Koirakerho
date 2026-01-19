import ListOfDogs from '@/components/database/listOfDogs';
import ListOfEvents from '@/components/database/listOfEvents';
import { Redirect } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/context/AuthContext';
import { addDog } from '../../../src/services/dogService';
import { createEvent } from '../../../src/services/eventService';

export default function Index() {
    const { firebaseUser, userProfile, logout, loading } = useAuth()
    const [status, setStatus] = useState<string | null>(null)


    // Testinappi koiran lisäykseen
    const handleAddDog = async () => {
        setStatus('Lisätään koiraa...')
        // tarkistetaan omistajan uid, jolla estetään koirien lisäys ilman autentikointia
        if (!firebaseUser?.uid) {
            setStatus('Ei kirjautunutta käyttäjää, koiraa ei lisätä')
            return
        }

        try {
            const dogData = {
                ownerId: firebaseUser.uid,
                name: `TestikoiraRex`,
                breed: 'Sakemanni',
                age: 100,
                description: 'Testikoira, joka lisättiin sovelluksesta. Hän on erittäin kiltti ja leikkisä. Rakastaa pitkiä kävelyitä ja herkkuja.',
                imageUrl: 'image/sakemanni.jpg',
                healthAssessmentDone: true
            }
            const res = await addDog(dogData)

            setStatus(`Koira '${dogData.name}' lisätty (id: ${res.id})`)
            console.log('Koira lisätty', res.id)
        } catch (e: any) {
            console.error(e)
            setStatus(`Koiran lisäys epäonnistui: ${e?.message ?? e}`)
        }
    }

    // Testinappi tapahtuman lisäykseen
    const handleAddEvent = async () => {
        setStatus('Lisätään tapahtumaa...')
        try {
            const tomorrow = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
            const eventData = {
                title: `Testi Tapahtuma`,
                description: 'Testitapahtuma, joka lisättiin sovelluksesta',
                location: { address: 'Torikatu 18a Oulu', lat: 65.01236, lng: 25.46816 },
                date: tomorrow
            }
            const res = await createEvent(eventData)

            setStatus(`Tapahtuma '${eventData.title}' lisätty (id: ${res.id})`)
            console.log('Added event', res.id)
        } catch (e: any) {
            console.error(e)
            setStatus(`Tapahtuman lisäys epäonnistui: ${e?.message ?? e}`)
        }
    }

    // Näytetään latausnäyttö, kun autentikointitila on latautumassa
    if (loading) return null

    // Jos käyttäjää ei ole kirjautunut sisään, ohjataan login-sivulle
    if (!firebaseUser) {
        return <Redirect href="/login" />
    }

    return (
        <SafeAreaProvider style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
                    <Text style={styles.title}>Home</Text>
                    <Text style={styles.welcome}>Tervetuloa takaisin {userProfile?.firstName ?? firebaseUser?.email ?? ''}</Text>

                    {/* Testinapit */}
                    <TouchableOpacity style={[styles.button]} onPress={handleAddDog}>
                        <Text style={styles.buttonText}>Lisää TestikoiraRex</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button]} onPress={handleAddEvent}>
                        <Text style={styles.buttonText}>Lisää testitapahtuma</Text>
                    </TouchableOpacity>

                    {/* Uloskirjautuminen */}
                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>

                    {status ? <Text style={styles.status}>{status}</Text> : null}

                    <ListOfDogs/>

                    <ListOfEvents/>

                </View>

            </ScrollView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: { 
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff3c0ff',
    },
    safe: {
        flex: 1,
        backgroundColor: '#fff3c0ff'
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingTop: 50,
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
        marginTop: 6,
        backgroundColor: '#206b00ff', 
        padding: 12, 
        borderRadius: 8,
        marginBottom: 6
    },
    buttonText: {
        color: '#fff', 
        fontWeight: '600' 
    },
    status: {
        marginTop: 12,
        color: '#333'
    },
    sectionTitle: {
        marginTop: 18,
        fontSize: 18,
        fontWeight: '700'
    },
    empty: {
        color: '#666',
        marginTop: 6
    },
    item: {
        marginTop: 8,
        padding: 8,
        backgroundColor: '#fff9e6',
        width: '100%',
        borderRadius: 8
    },
    itemTitle: {
        fontWeight: '700'
    },
    itemMeta: {
        color: '#666'
    },
    cancel: {
        marginTop: 12,
        backgroundColor: '#aa0000'
    }
})