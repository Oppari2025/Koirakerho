import { EventTicket } from "@/types/event-ticket";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TicketsScreen(): React.JSX.Element {
    const router = useRouter();

    const [tickets, setTickets] = React.useState<EventTicket[]>([]);

    React.useEffect(() => {
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

    const renderItem = ({ item }: { item: EventTicket }) => {
        return (
            <TouchableOpacity
                onPress={() => router.navigate(`/(main)/ticketScreen?id=${item.id}`)}
                style={{
                    backgroundColor: "#ffffffff",
                    padding: 16,
                    borderRadius: 10,
                    gap: 8
                }}
            >
                <View
                    style={{
                        width: "100%",
                        flexDirection: "row"
                    }}
                >
                    <View
                        style={{
                            borderRadius: 10,
                            backgroundColor: "#ebebebff",
                            padding: 8
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {
                                (() => {
                                    switch (item.type) {
                                        case "standard":
                                            return "Standard";
                                        case "basic":
                                            return "Basic";
                                        case "premium":
                                            return "Premium";
                                        default:
                                            return "???";
                                    }
                                })()
                            }
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        height: 40
                    }}
                >
                    <Text
                        style={{
                            color: "#000000ff",
                            fontWeight: "bold",
                            fontSize: 16
                        }}
                    >
                        {item.eventName}
                    </Text>
                </View>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }} />
                <View>
                    <Text>
                        {item.startTime}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    padding: 4,
                    height: "100%"
                }}
            >
                <FlatList
                    data={tickets}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={() => <View style={{ height: 8 }} />}
                    ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    ListFooterComponent={() => <View style={{ height: 200 }} />}
                />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}