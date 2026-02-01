import { getTicketById } from "@/src/services/ticketService";
import { EventTicket } from "@/types/event-ticket";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TicketScreen(): React.JSX.Element {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [ticket, setTicket] = React.useState<EventTicket | null>(null);

    React.useEffect(() => {
        const fetchTicket = async () => {
            if (!id) return;
            try {
                const ticketData = await getTicketById(id);
                if (ticketData) setTicket(ticketData);
            } catch (err) {
                console.error("Failed to fetch ticket:", err);
            }
        };
        fetchTicket();
    }, [id]);

    if (!ticket) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Loading ticket...</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ padding: 8, height: "100%" }}>
                <ScrollView contentContainerStyle={{ rowGap: 8 }}>
                    <View style={{ backgroundColor: "white", padding: 16, borderRadius: 10 }}>
                        <View style={{ gap: 8, alignItems: "center" }}>
                            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Event Ticket</Text>
                            <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth }} />
                            <Text style={{ fontSize: 20, textAlign: "center" }} numberOfLines={1}>
                                {ticket.eventName}
                            </Text>
                            <Text style={{ fontWeight: "bold", fontSize: 16, textAlign: "center" }}>
                                {ticket.type || "Standard"}
                            </Text>
                            <View style={{ alignItems: "center", borderWidth: StyleSheet.hairlineWidth, borderColor: "black", padding: 16, gap: 8 }}>
                                <QRCodeStyled data={ticket.data} pieceScale={1} size={180} />
                            </View>
                            <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth }} />
                            <Text style={{ textAlign: "center", color: "gray" }}>{ticket.id}</Text>
                        </View>
                    </View>
                    <View style={{ backgroundColor: "white", padding: 16, borderRadius: 10, gap: 8 }}>
                        <View>
                            <Text style={{ fontWeight: "bold" }}>Date</Text>
                            <Text>{ticket.startTime}</Text>
                        </View>
                        <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" }} />
                        <View>
                            <Text style={{ fontWeight: "bold" }}>Time</Text>
                            <Text>{ticket.startTime}</Text>
                        </View>
                        <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" }} />
                        <View>
                            <Text style={{ fontWeight: "bold" }}>Location</Text>
                            <Text>Test Road 1</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
