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
                //source={{ uri: item.imageUrl }}
                style={styles.image}
                alt="image"
            />
            <View style={styles.eventDateContainer}>
                <Text
                    className="text-black text-md font-bold"
                >
                    {item.date.toDate().toLocaleDateString()}
                </Text>
            </View>
            <View>
                <Text
                    className="text-black text-lg font-semibold"
                    numberOfLines={1}
                >
                    {item.title}
                </Text>
                <Text
                    className="text-black text-base"
                    numberOfLines={1}
                >
                    {item.description}
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
        aspectRatio: 16 / 9,
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
        borderColor: "gray",
        alignItems: "center"
    }
});