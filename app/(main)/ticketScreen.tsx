import { EventTicket } from "@/types/event-ticket";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import QRCodeStyled from 'react-native-qrcode-styled';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ticketScreen(): React.JSX.Element {

    // state

    const [ticket, setTicket] = useState<EventTicket>({
        id: "???",
        type: "???",
        eventId: "???",
        eventName: "???",
        data: "???",
        startTime: "???"
    });

    // effects

    useEffect(() => {
        const test_ticket = {
            id: "73849656879543687943874693",
            type: "standard",
            eventId: "asda",
            eventName: "Test Event 1",
            data: "https://example.com/jfdgsjgfddgfiujopgfuijop",
            startTime: "2020-01-01 00:00:00"
        }

        setTicket(test_ticket);
        return () => {

        };
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView contentContainerStyle={{ rowGap: 8, flex: 1 }}>
                    <View style={styles.ticketMainContainer}>
                        <View style={styles.ticketContainerHeader}>
                            <Text style={[styles.text, styles.ticketContainerHeaderText]}>
                                Event Ticket
                            </Text>
                        </View>


                        <View style={styles.horizontalLine} />


                        <View style={styles.ticketContainerContent}>
                            <View style={styles.eventNameTextContainer}>
                                <Text
                                    style={[styles.text, styles.eventNameText]}
                                    numberOfLines={1}
                                >
                                    Test Event 1
                                </Text>
                            </View>

                            <View style={styles.ticketTypeTextContainer}>
                                <Text style={[styles.text, styles.ticketTypeText]}>
                                    {
                                        (() => {
                                            switch (ticket.type) {
                                                case "standard":
                                                    return "Perus";
                                                case "basic":
                                                    return "Budjetti";
                                                case "premium":
                                                    return "VIP";
                                                default:
                                                    return "???";
                                            }
                                        })()
                                    }
                                </Text>
                            </View>


                            <View style={styles.ticketBottomContainer}>
                                <View style={styles.qrCodeContainer}>
                                    <QRCodeStyled
                                        style={{}}
                                        data={ticket.data}
                                        pieceScale={1}
                                        size={180}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.horizontalLine} />

                        <View>
                            <Text style={[styles.ticketIdText]}>
                                {ticket.id}
                            </Text>
                        </View>
                    </View>



                    <View
                        style={styles.ticketMainContainer}
                    >
                        <View>
                            <Text style={[styles.text, styles.infoFieldHeadingText]}>
                                Date
                            </Text>
                            <Text style={[styles.text, styles.infoFieldText]}>
                                {ticket.startTime}
                            </Text>
                        </View>
                        <View style={styles.horizontalLineDashed} />
                        <View>
                            <Text style={[styles.text, styles.infoFieldHeadingText]}>
                                Time
                            </Text>
                            <Text style={[styles.text, styles.infoFieldText]}>
                                {ticket.startTime}
                            </Text>
                        </View>
                        <View style={styles.horizontalLineDashed} />
                        <View>
                            <Text style={[styles.text, styles.infoFieldHeadingText]}>
                                Location
                            </Text>
                            <Text style={[styles.text, styles.infoFieldText]}>
                                Test Road 1
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        //height: "100%",
        backgroundColor: '#fff3c0ff'
    },
    ticketMainContainer: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: "gray"
    },
    ticketContainerHeader: {
        alignItems: "center"
    },
    text: {
        color: "black"
    },
    ticketTypeTextContainer: {
        padding: 8,
        width: "100%"
    },
    ticketTypeText: {
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center",
    },
    infoFieldHeadingText: {
        fontWeight: "bold"
    },
    infoFieldText: {

    },
    ticketIdText: {
        textAlign: "center",
        color: "gray"
    },
    ticketContainerHeaderText: {
        fontWeight: "bold",
        fontSize: 20
    },
    horizontalLine: {
        borderBottomColor: "gray",
        borderBottomWidth: StyleSheet.hairlineWidth
    },
    horizontalLineDashed: {
        borderBottomColor: "gray",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderStyle: "dashed"
    },
    ticketContainerContent: {
        padding: 8,
        gap: 8,
        width: "100%"
    },
    eventNameTextContainer: {
        height: 40
    },
    eventNameText: {
        fontSize: 20,
        textAlign: "center"
    },
    qrCodeContainer: {
        alignItems: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "black",
        padding: 16,
        gap: 8
    },
    ticketBottomContainer: {
        alignItems: "center",
        width: "100%"
    }
})