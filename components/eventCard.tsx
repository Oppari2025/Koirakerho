import { EventCardProps } from "@/types/events";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function EventCard({ onPress, item }: EventCardProps): React.JSX.Element {
    return (
        <TouchableOpacity
            onPress={onPress}
        >
            <View
                style={{
                    backgroundColor: "#86614aff",
                    padding: 8,
                    width: "100%",
                    borderRadius: 10
                }}
            >
                <Image
                    source={{
                        uri: item.imageUrl,
                    }}
                    style={{
                        borderRadius: 10,
                        width: "100%",
                        height: 140
                    }}
                    alt="image"
                />
                <View
                    style={{
                        margin: 16,
                        position: "absolute",
                        backgroundColor: "#86614aff",
                        padding: 8,
                        borderRadius: 50,
                        width: "40%",
                        alignSelf: "flex-end"
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 16,
                            textAlign: "center",
                        }}
                    >
                        {item.date}
                    </Text>
                </View>
                <View
                    className={classes.eventCardBottomContainer}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontWeight: "bold",
                        }}
                        numberOfLines={1}
                    >
                        {item.eventName}
                    </Text>
                    <Text
                        style={{
                            fontSize: 16
                        }}
                        numberOfLines={1}
                    >
                        {item.eventInfo}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const classes = {
    eventCard: "rounded-lg w-full h-[380px]",
    eventCardImage: "h-[150px] w-full rounded-md aspect-[4/3] mb-4",
    eventCardContent: "",
    eventCardDate: "text-sm font-normal text-typography-700",
    eventCardBottomContainer: "",
    eventCardEventNameText: "text-base mb-2",
    eventCardInfoText: "text-sm",
}