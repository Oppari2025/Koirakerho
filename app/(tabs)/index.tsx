import { Redirect } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { addDog, getMyDogs } from '../../src/services/dogService';
import { createEvent, getUpcomingEvents } from '../../src/services/eventService';

export default function Index() {
    const { firebaseUser, userProfile, logout, loading } = useAuth()
    const [status, setStatus] = useState<string | null>(null)
    const [dogs, setDogs] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])

    // ladataan koirat ja tapahtumat komponentin latautuessa
    useEffect(() => {
        loadDogs()
        loadEvents()
    }, [])

    // Funktio koirien lataamiseen käyttäjälle 
    // Tullaan käyttämään vain käyttäjän omassa profiilissa
    const loadDogs = async () => {
        setStatus('Loading dogs...')
        try {
            const list = await getMyDogs()
            setDogs(list)
            setStatus(null)
        } catch (e: any) {
            console.error(e)
            setStatus(`Koirien lataus epäonnistui: ${e?.message ?? e}`)
        }
    }

    // Funktio tulevien tapahtumien lataamiseen
    const loadEvents = async () => {
        setStatus('Loading events...')
        try {
            const list = await getUpcomingEvents()
            setEvents(list)
            setStatus(null)
        } catch (e: any) {
            console.error(e)
            setStatus(`Tapahtumien lataus epäonnistui: ${e?.message ?? e}`)
        }
    }

    // Testinappi koiran lisäykseen
    const handleAddDog = async () => {
        setStatus('Lisätään koiraa...')
        // tarkistetaan omistajan uid, jolla estetään koirien lisäys ilman autentikointia
        if (!firebaseUser?.uid) {
            setStatus('Not authenticated')
            return
        }

        try {
            const res = await addDog({
                ownerId: firebaseUser.uid,
                name: `TestikoiraRex`,
                breed: 'Sakemanni',
                age: 100,
                description: 'Testikoira, joka lisättiin sovelluksesta',
                imageUrl: '',
                healthAssessmentDone: false
            })

            setStatus(`Koira lisätty (id: ${res.id})`)
            console.log('Added dog', res.id)
        } catch (e: any) {
            console.error(e)
            setStatus(`Failed to add dog: ${e?.message ?? e}`)
        }
    }

    // Testinappi tapahtuman lisäykseen
    const handleAddEvent = async () => {
        setStatus('Lisätään tapahtumaa...')
        try {
            const tomorrow = Timestamp.fromDate(new Date(Date.now() + 24 * 60 * 60 * 1000))
            const res = await createEvent({
                title: `Testi Tapahtuma`,
                description: 'Testitapahtuma, joka lisättiin sovelluksesta',
                location: { address: 'Vaikka Oulussa', lat: 65.01236, lng: 25.46816 },
                date: tomorrow
            })

            setStatus(`Tapahtuma lisätty (id: ${res.id})`)
            console.log('Added event', res.id)
        } catch (e: any) {
            console.error(e)
            setStatus(`Failed to add event: ${e?.message ?? e}`)
        }
    }

    if (loading) return null

    if (!firebaseUser) {
        return <Redirect href="/login" />
    }

    return (
        <SafeAreaProvider style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.container}>
                    <Text style={styles.title}>Home</Text>
                    <Text style={styles.welcome}>Tervetuloa takaisin {userProfile?.name ?? firebaseUser?.email ?? ''}</Text>

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

                    {/* Lista käyttäjän koirista. Tätä tullaan käyttämään käyttäjän profiilissa*/}
                    <Text style={styles.sectionTitle}>Koirani</Text>

                    {dogs.length === 0 ? <Text style={styles.empty}>Ei koiria</Text> : dogs.map(d => (
                        <View key={d.id} style={styles.item}>
                            <Text style={styles.itemTitle}>{d.name} — {d.breed}</Text>
                            <Text style={styles.itemMeta}>Ikä: {d.age} vuotta</Text>
                            <Text style={styles.itemMeta}>Terveyskartoitus: {d.healthAssessmentDone ? 'Valmis' : 'Ei tehty'}</Text>
                            <Text style={styles.itemMeta}>{d.description}</Text>
                        </View>
                    ))}

                    {/* Lista tulevista tapahtumista */}
                    <Text style={styles.sectionTitle}>Tulevat tapahtumat</Text>

                    {events.length === 0 ? <Text style={styles.empty}>Ei tulevia tapahtumia</Text> : events.map(ev => (
                        <View key={ev.id} style={styles.item}>
                            <Text style={styles.itemTitle}>{ev.title} {ev.date.toDate().toLocaleString()}</Text>
                            <Text style={styles.itemMeta}>{ev.description}</Text>
                            <Text style={styles.itemMeta}>{ev.location.address}, {ev.location.lat}, {ev.location.lng}</Text>
                            <Text style={styles.itemMeta}>Julkaistu: {ev.createdAt.toDate().toLocaleString()}</Text>
                            <Text style={styles.itemMeta}>Osallistujat: {ev.participants.length}</Text>
                        </View>
                    ))}

                    {/* Päivitysnappi listoille */}
                    <TouchableOpacity style={[styles.button]} onPress={() => { loadDogs(); loadEvents(); }}>
                        <Text style={styles.buttonText}>Päivitä lista</Text>
                    </TouchableOpacity>
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
        backgroundColor: '#144100ff', 
        padding: 12, 
        borderRadius: 8,
        marginBottom: 6
    },
    buttonText: {
        color: '#fff', 
        fontWeight: '600' 
    },
    secondary: {
        marginTop: 12,
        backgroundColor: '#1e6b00'
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
})