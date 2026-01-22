import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
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
        <View className="w-full pb-2">
            <Heading size="lg" className="mb-4">Tulevat tapahtumat</Heading>

            {/* Lista tapahtumista */}
            {events.length === 0 ? (
                <Text className="text-typography-500 text-center py-4">Ei tulevia tapahtumia</Text>
            ) : (
                <FlatList
                    data={events}
                    keyExtractor={(ev) => ev.id}
                    scrollEnabled={false}
                    renderItem={({ item: ev }) => (
                        <Card className="mb-3 p-4 rounded-lg bg-background-50 border border-background-200" variant="elevated">
                            <View>
                                <Text className="text-lg font-semibold text-typography-900">
                                    {ev.title || 'Tapahtuma'}
                                </Text>
                                
                                {ev.date && (
                                    <Text className="text-sm text-typography-600 mt-2">
                                        {ev.date.toDate().toLocaleString('fi-FI')}
                                    </Text>
                                )}
                                
                                {ev.description && (
                                    <Text className="text-sm text-typography-700 mt-2">
                                        {ev.description}
                                    </Text>
                                )}
                                
                                {ev.location && (
                                    <Text className="text-xs text-typography-500 mt-2">
                                        {ev.location.address}, {ev.location.lat}°, {ev.location.lng}°
                                    </Text>
                                )}
                                
                                {ev.createdAt && (
                                    <Text className="text-xs text-typography-500 mt-1">
                                        Julkaistu: {ev.createdAt.toDate().toLocaleString('fi-FI')}
                                    </Text>
                                )}
                                
                                {Array.isArray(ev.participants) && (
                                    <Text className="text-xs text-typography-500 mt-1">
                                        Osallistujat: {ev.participants.length}
                                    </Text>
                                )}

                                <TouchableOpacity
                                    onPress={() => hasJoined(ev) ? handleLeaveEvent(ev.id) : handleJoinEvent(ev.id)}
                                    className={`mt-3 px-4 py-2 rounded-lg ${hasJoined(ev) ? 'bg-red-600' : 'bg-green-600'}`}
                                >
                                    <Text className="text-white font-semibold text-center">
                                        {hasJoined(ev) ? "Peruuta osallistuminen" : "Liity tapahtumaan"}
                                    </Text>
                                </TouchableOpacity>

                                {statusByEvent[ev.id] && (
                                    <Text className="text-sm text-typography-600 mt-2 text-center">
                                        {statusByEvent[ev.id]}
                                    </Text>
                                )}
                            </View>
                        </Card>
                    )}
                />
            )}
        </View>
    )
}