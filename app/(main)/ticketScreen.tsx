import { EventTicket } from "@/types/event-ticket";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import QRCodeStyled from 'react-native-qrcode-styled';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ticketScreen(): React.JSX.Element {
    const [ticket, setTicket] = React.useState<EventTicket>({
        id: "???",
        type: "???",
        eventId: "???",
        eventName: "???",
        data: "???",
        startTime: "???"
    });

    React.useEffect(() => {
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
            <SafeAreaView
                style={{
                    backgroundColor: '#fff3c0ff',
                    padding: 8,
                    height: "100%",
                }}
            >
                <ScrollView
                    contentContainerStyle={{
                        rowGap: 8
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "rgb(255, 255, 255)",
                            borderColor: "gray",
                            borderWidth: 1,
                            padding: 16,
                            borderRadius: 10
                        }}
                    >
                        <View
                            style={{
                                gap: 8
                            }}
                        >
                            <View
                                style={{
                                    alignItems: "center"
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: 20
                                    }}
                                >
                                    Event Ticket
                                </Text>
                            </View>


                            <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth }} />


                            <View
                                style={{
                                    padding: 8,
                                    gap: 8,
                                    width: "100%",
                                    //borderWidth: StyleSheet.hairlineWidth,
                                    borderColor: "black",
                                }}
                            >
                                <View
                                    style={{
                                        height: 40
                                    }}
                                >
                                    <Text
                                        style={{
                                            //fontWeight: "bold",
                                            fontSize: 20,
                                            textAlign: "center"
                                        }}
                                        numberOfLines={1}

                                    >
                                        Test Event 1
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        //borderRadius: 10,
                                        //borderWidth: StyleSheet.hairlineWidth,
                                        //borderColor: "black",
                                        padding: 8,
                                        width: "100%"
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 16,
                                            textAlign: "center",
                                        }}
                                    >
                                        {
                                            (() => {
                                                switch (ticket.type) {
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


                                <View
                                    style={{
                                        //backgroundColor: "#af7979ff",
                                        alignItems: "center",
                                        width: "100%"
                                    }}
                                >
                                    <View
                                        style={{
                                            //backgroundColor: "#af7979ff",
                                            alignItems: "center",
                                            borderWidth: StyleSheet.hairlineWidth,
                                            borderColor: "black",
                                            padding: 16,
                                            gap: 8
                                        }}
                                    >
                                        <QRCodeStyled
                                            style={{
                                            }}
                                            data={ticket.data}
                                            pieceScale={1}
                                            size={180}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth }} />

                            <View>
                                <Text style={{ textAlign: "center", color: "gray" }}>
                                    {ticket.id}
                                </Text>
                            </View>

                        </View>


                    </View>
                    <View
                        style={{
                            backgroundColor: "rgb(255, 255, 255)",
                            borderColor: "gray",
                            borderWidth: 1,
                            padding: 16,
                            borderRadius: 10,
                            gap: 8
                        }}
                    >
                        <View>
                            <Text style={{ fontWeight: "bold" }}>
                                Date
                            </Text>
                            <Text style={{}}>
                                {ticket.startTime}
                            </Text>
                        </View>
                        <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" }} />
                        <View>
                            <Text style={{ fontWeight: "bold" }}>
                                Time
                            </Text>
                            <Text style={{}}>
                                {ticket.startTime}
                            </Text>
                        </View>
                        <View style={{ borderBottomColor: "gray", borderBottomWidth: StyleSheet.hairlineWidth, borderStyle: "dashed" }} />
                        <View>
                            <Text style={{ fontWeight: "bold" }}>
                                Location
                            </Text>
                            <Text style={{}}>
                                Test Road 1
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider >
    )
}