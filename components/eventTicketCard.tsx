import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


type EventTicketCardProps = {
    eventName: string;
    ticketType: string;
    startTime: string;
    onPress: () => void;
}


export default function EventTicketCard({ eventName, ticketType, startTime, onPress }: EventTicketCardProps): React.JSX.Element {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
        >


            <View
                style={{
                    width: "100%",
                    flexDirection: "row"
                }}
            >
                <View
                    style={styles.ticketTypeBubble}
                >
                    <Text
                        style={[styles.text, styles.headerText2]}
                    >
                        {
                            (() => {
                                switch (ticketType) {
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


            <View style={styles.eventNameTextContainer}>
                <Text
                    style={[styles.text, styles.headerText]}
                    numberOfLines={2}
                >
                    {eventName}
                </Text>
            </View>



            <View style={{ borderBottomColor: 'black', borderBottomWidth: StyleSheet.hairlineWidth }} />


            <View>
                <Text>
                    {startTime}
                </Text>
            </View>


        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffffff",
        padding: 16,
        borderRadius: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: "gray"
    },
    text: {
        color: "black"
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 16
    },
    headerText2: {
        fontWeight: "bold",
        fontSize: 14
    },
    eventNameTextContainer: {
        height: 40
    },
    ticketTypeBubble: {
        borderRadius: 10,
        backgroundColor: "#ebebebff",
        padding: 8,
        borderWidth: 1,
        borderColor: "gray"
    }
})