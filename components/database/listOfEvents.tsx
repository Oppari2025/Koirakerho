import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Event } from '../..//src/types/event';
import { useAuth } from '../../src/context/AuthContext';
import { getEventsByIds, getUpcomingEvents, joinEvent, leaveEvent } from '../../src/services/eventService';

type Props = {
    eventIds?: string[];
};

export default function ListOfEvents({ eventIds }: Props) {
    const { firebaseUser } = useAuth()
    const [events, setEvents] = useState<Event[]>([])
    const [statusByEvent, setStatusByEvent] = useState<Record<string, string>>({})
    const router = useRouter();

    // ladataan tapahtumat komponentin latautuessa
    useEffect(() => {
        loadEvents()
    }, [eventIds])


    // Funktio tulevien tapahtumien lataamiseen
    const loadEvents = async () => {
        try {
            let list: Event[];
            if (eventIds && eventIds.length > 0) {
                // Jos eventIds on annettu (ryhmän tapahtumat), hae vain ne
                list = await getEventsByIds(eventIds)
            } else {
                // Muuten hae kaikki tulevat tapahtumat
                list = await getUpcomingEvents()
            }
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
        <View style={{ width: '100%', paddingBottom: 8, backgroundColor: Colors.light.background }}>
            <Heading size="lg" style={{ marginBottom: 16, color: Colors.light.text }}>Tulevat tapahtumat</Heading>

            {/* Lista tapahtumista */}
            {events.length === 0 ? (
                <Text style={{ color: Colors.light.gray, textAlign: 'center', paddingVertical: 16 }}>Ei tulevia tapahtumia</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(ev) => ev.id}
                    scrollEnabled={false}
                    renderItem={({ item: ev }) => (
                        <TouchableOpacity activeOpacity={0.85} onPress={() => router.push({ pathname: '/(main)/eventScreen', params: { id: ev.id } })}>
                            <Card style={{ marginBottom: 12, padding: 16, borderRadius: 12, backgroundColor: Colors.light.card, borderColor: Colors.light.border, borderWidth: 1 }} variant="elevated">
                                <View>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.light.text }}>
                                        {ev.title || 'Tapahtuma'}
                                    </Text>
                                    {ev.date && (
                                        <Text style={{ fontSize: 14, color: Colors.light.gray, marginTop: 8 }}>
                                            {ev.date.toDate().toLocaleString('fi-FI')}
                                        </Text>
                                    )}
                                    {ev.description && (
                                        <Text style={{ fontSize: 14, color: Colors.light.text, marginTop: 8 }}>
                                            {ev.description}
                                        </Text>
                                    )}
                                    {ev.location && (
                                        <Text style={{ fontSize: 12, color: Colors.light.gray, marginTop: 8 }}>
                                            {ev.location.address}, {ev.location.lat}°, {ev.location.lng}°
                                        </Text>
                                    )}
                                    {ev.createdAt && (
                                        <Text style={{ fontSize: 12, color: Colors.light.gray, marginTop: 4 }}>
                                            Julkaistu: {ev.createdAt.toDate().toLocaleString('fi-FI')}
                                        </Text>
                                    )}
                                    {Array.isArray(ev.participants) && (
                                        <Text style={{ fontSize: 12, color: Colors.light.gray, marginTop: 4 }}>
                                            Osallistujat: {ev.participants.length}
                                        </Text>
                                    )}

                                    <TouchableOpacity
                                        onPress={() => hasJoined(ev) ? handleLeaveEvent(ev.id) : handleJoinEvent(ev.id)}
                                        style={{ marginTop: 12, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: hasJoined(ev) ? '#e74c3c' : Colors.light.accent, alignItems: 'center' }}
                                        onPressOut={e => e.stopPropagation && e.stopPropagation()}
                                    >
                                        <Text style={{ color: hasJoined(ev) ? Colors.light.white : Colors.light.text, fontWeight: 'bold', textAlign: 'center' }}>
                                            {hasJoined(ev) ? "Peruuta osallistuminen" : "Liity tapahtumaan"}
                                        </Text>
                                    </TouchableOpacity>

                                    {statusByEvent[ev.id] && (
                                        <Text style={{ fontSize: 14, color: Colors.light.gray, marginTop: 8, textAlign: 'center' }}>
                                            {statusByEvent[ev.id]}
                                        </Text>
                                    )}
                                </View>
                            </Card>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    )
}