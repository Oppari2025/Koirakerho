import { ButtonProps } from "@/types/button";
import React from "react";
import { Text, TouchableOpacity } from "react-native";


export default function Button({ onPress, title, style, textColor, key }: ButtonProps): React.JSX.Element {
    return (
        <TouchableOpacity
            style={style}
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
    )
}