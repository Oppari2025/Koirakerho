import { ButtonProps } from "@/types/button";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";


export default function Button({ onPress, title, style, textColor }: ButtonProps): React.JSX.Element {
    return (
        <View style={style}>
            <TouchableOpacity
                onPress={onPress}
            >
                <Text
                    style={{
                        color: textColor,
                        alignSelf: "center",
                        fontWeight: "bold"
                    }}
                >
                    {title}
                </Text>
            </TouchableOpacity>
        </View>

    )
}