import { TextEditBoxProps } from "@/types/text-edit-box";
import React from "react";
import { Text, TextInput, View } from "react-native";

export default function TextEditBox({ label, isEditable, onChangeText, numberOfLines, placeholder, value }: TextEditBoxProps): React.JSX.Element {
    numberOfLines = numberOfLines || 1;
    const inputHeight = numberOfLines > 10
        ? 10 * 36
        : numberOfLines * 36;

    return (
        <View className="w-full gap-2">
            {
                label && (
                    <Text className="text-xl text-white font-bold">{label}</Text>
                )
            }

            <TextInput
                style={{
                    borderWidth: isEditable ? 1 : 0,
                    borderColor: "#FFF",
                    borderRadius: 5,
                    height: inputHeight,
                }}
                editable={isEditable}
                value={value}
                placeholder={placeholder}
                clearButtonMode="always"
                placeholderTextColor="#818181ff"
                className="text-white text-md"
                multiline={numberOfLines > 1}
                numberOfLines={numberOfLines}
                textAlignVertical="top"
                onSubmitEditing={() => { }}
                onChangeText={onChangeText}
            />

        </View>
    )
}