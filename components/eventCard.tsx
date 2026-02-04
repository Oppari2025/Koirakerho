import { EventCardProps } from "@/types/events";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EventCard({ onPress, item }: EventCardProps): React.JSX.Element {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
        >
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.image}
                alt="image"
            />
            <View style={styles.eventDateContainer}>
                <Text style={[styles.text, styles.eventDateText]}>
                    {item.date}
                </Text>
            </View>
            <View>
                <Text
                    style={[styles.text, styles.headerText]}
                    numberOfLines={1}
                >
                    {item.eventName}
                </Text>
                <Text
                    style={[styles.text, styles.normalText]}
                    numberOfLines={1}
                >
                    {item.eventInfo}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        width: "100%",
        backgroundColor: "white",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "gray"
    },
    image: {
        borderRadius: 10,
        width: "100%",
        height: "auto",
        aspectRatio: 16/9,
        borderWidth: 1,
        borderColor: "gray",
        backgroundColor: "gray"
    },
    eventDateContainer: {
        padding: 8,
        width: "40%",
        margin: 16,
        position: "absolute",
        borderRadius: 50,
        alignSelf: "flex-end",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "gray"
    },
    text: {
        color: "black"
    },
    normalText: {
        fontSize: 16
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 16,
    },
    eventDateText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16
    }
});