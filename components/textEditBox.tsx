import { TextEditBoxProps } from "@/types/text-edit-box";
import React from "react";
import { Text, TextInput, View } from "react-native";

export default function TextEditBox({ label, isEditable, onChangeText, numberOfLines, placeholder, value, labelStyle, inputStyle }: TextEditBoxProps): React.JSX.Element {
    numberOfLines = numberOfLines || 1;
    const inputHeight = numberOfLines > 10
        ? 10 * 36
        : numberOfLines * 36;

    return (
        <View className="w-full gap-2">
            {
                label && (
                    <Text style={[{ fontSize: 20, fontWeight: 'bold', color: '#fff' }, labelStyle]}>{label}</Text>
                )
            }

            <TextInput
                style={[
                    {
                        borderWidth: isEditable ? 1 : 0,
                        borderColor: "#FFF",
                        borderRadius: 5,
                        height: inputHeight,
                        color: '#fff',
                        fontSize: 16,
                    },
                    inputStyle
                ]}
                editable={isEditable}
                value={value}
                placeholder={placeholder}
                clearButtonMode="always"
                placeholderTextColor="#818181ff"
                multiline={numberOfLines > 1}
                numberOfLines={numberOfLines}
                textAlignVertical="top"
                onSubmitEditing={() => { }}
                onChangeText={onChangeText}
            />

        </View>
    )
}