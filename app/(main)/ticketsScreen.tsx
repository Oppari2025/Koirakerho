import EventTicketCard from "@/components/eventTicketCard";
import { EventTicket } from "@/types/event-ticket";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TicketsScreen(): React.JSX.Element {
    const router = useRouter();

    const [tickets, setTickets] = useState<EventTicket[]>([]);

    useEffect(() => {
        const test_tickets: EventTicket[] = [
            {
                id: "gjhddghj",
                type: "standard",
                eventId: "asda",
                eventName: "Test Event 1",
                data: "nbmvcxnmmncbvcxnbvm",
                startTime: "2020-01-01 00:00:00"
            },
            {
                id: "asdasd",
                type: "premium",
                eventId: "sdff",
                eventName: "Test Event 2 dgsjhlgdfsjhfjhhjgdfhhjkudhkjldkguhjkhjukhjugkdhjugfkh",
                data: "asdgkhfasdfkghasfdgkhfasgkhaskghsfasdgfdgsh",
                startTime: "2020-01-01 00:00:00"
            },
            {
                id: "gsdfgdgd",
                type: "basic",
                eventId: "fsdf",
                eventName: "Test Event 3",
                data: "tyuerwwyurioetyruiotwryuioetyuri",
                startTime: "2020-01-01 00:00:00"
            }
        ]

        setTickets(test_tickets);
        return () => {

        };
    }, []);

    function onPressEventTicketCard(item: EventTicket) {
        router.navigate(`/(main)/ticketScreen?id=${item.id}`)
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <FlatList
                    ListHeaderComponent={() => <View style={{ height: 8 }} />}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    ListFooterComponent={() => <View style={{ height: 200 }} />}
                    data={tickets}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <EventTicketCard
                                onPress={() => onPressEventTicketCard(item)}
                                eventName={item.eventName}
                                startTime={item.startTime}
                                ticketType={item.type}
                            />
                        )
                    }}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fff3c0ff',
    }
})