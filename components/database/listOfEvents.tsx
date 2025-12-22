import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Event } from '../..//src/types/event';
import { useAuth } from '../../src/context/AuthContext';
import { getUpcomingEvents, joinEvent, leaveEvent } from '../../src/services/eventService';


export default function ListOfEvents() {
    const { firebaseUser } = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [statusByEvent, setStatusByEvent] = useState<Record<string, string>>({})

    // ladataan tapahtumat komponentin latautuessa
    useEffect(() => {
        loadEvents()
    }, [])


    // Funktio tulevien tapahtumien lataamiseen
    const loadEvents = async () => {
        try {
            const list = await getUpcomingEvents()
            setEvents(list)
        } catch (e: any) {
            console.error('Failed to load events:', e)
        }
    }

    // Tapahtumaan liittyminen
    const handleJoinEvent = async (eventId: string) => {
        setStatusByEvent(prev => ({
            ...prev,
            [eventId]: 'Liitytään tapahtumaan...',
        }))

        try {
            await joinEvent(eventId)

            setStatusByEvent(prev => ({
                ...prev,
                [eventId]: 'Liityit tapahtumaan!',
            }))
             
            setTimeout(() => {
                setStatusByEvent(prev => {
                    const copy = { ...prev }
                    delete copy[eventId]
                    return copy
                })
            }, 3000)

            await loadEvents()
        } catch (e: any) {
            console.error(e)
            setStatusByEvent(prev => ({
                ...prev,
                [eventId]: `Liittyminen epäonnistui: ${e?.message ?? e}`,
            }))
        }
    }

    // Tapahtumasta poistuminen
    const handleLeaveEvent = async (eventId: string) => {
        setStatusByEvent(prev => ({
            ...prev,
            [eventId]: 'Poistutaan tapahtumasta...',
        }))

        try {
            await leaveEvent(eventId)

            setStatusByEvent(prev => ({
                ...prev,
                [eventId]: 'Poistuit tapahtumasta',
            }))

            setTimeout(() => {
                setStatusByEvent(prev => {
                    const copy = { ...prev }
                    delete copy[eventId]
                    return copy
                })
            }, 3000)

            await loadEvents()
        } catch (e: any) {
            console.error(e)
            setStatusByEvent(prev => ({
                ...prev,
                [eventId]: `Poistuminen epäonnistui: ${e?.message ?? e}`,
            }))
        }
    }

    // tarkistetaan onko käyttäjä jo liittynyt tapahtumaan
    const hasJoined = (event: any) => {
        if (!firebaseUser?.uid) return false
        if (!Array.isArray(event.participants)) return false;
        return event.participants.includes(firebaseUser.uid)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Tulevat tapahtumat</Text>

            {/* Lista tapahtumista */}
            {events.length === 0 ? <Text style={styles.empty}>Ei tulevia tapahtumia</Text> : events.map(ev => (
                <View key={ev.id} style={styles.item}>
                <Text style={styles.itemTitle}>{ev.title} {ev.date.toDate().toLocaleString()}</Text>
                <Text style={styles.itemMeta}>{ev.description}</Text>
                <Text style={styles.itemMeta}>{ev.location.address}, {ev.location.lat}°, {ev.location.lng}°</Text>
                <Text style={styles.itemMeta}>Julkaistu: {ev.createdAt.toDate().toLocaleString()}</Text>
                <Text style={styles.itemMeta}>Osallistujat: {ev.participants.length}</Text>
                <TouchableOpacity
                    style={[ styles.button, hasJoined(ev) ? styles.cancel : styles.button ]}
                    onPress={() => hasJoined(ev) ? handleLeaveEvent(ev.id) : handleJoinEvent(ev.id)}>
                    <Text style={styles.buttonText}>
                        {hasJoined(ev) ? "Peruuta osallistuminen" : "Liity tapahtumaan"}
                    </Text>
                </TouchableOpacity>
                {statusByEvent[ev.id] && (
                    <Text style={styles.status}>{statusByEvent[ev.id]}</Text>
                )}
                </View>
            ))}
        </View>

    )

}


const styles = StyleSheet.create({
    container: { 
        flex: 1,
        width: '90%',
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#fff3c0ff',
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
    status: {
        marginTop: 6,
        color: '#333'
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
    cancel: {
        marginTop: 12,
        backgroundColor: '#aa0000'
    }
})