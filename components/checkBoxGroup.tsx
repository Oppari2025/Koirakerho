import { CheckBoxGroupProps } from "@/types/checkbox";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CheckBoxGroup({ options, checkedValues, onChange, fontSize, style }: CheckBoxGroupProps): React.JSX.Element {
    let updatedCheckedValues = [...checkedValues];
    fontSize = fontSize || 15;

    return (
        <View style={[styles.container, style]}>
            <Text className="font-bold text-xl text-white">
                Allowed Dogs
            </Text>

            {
                options.map((option) => {
                    let active = updatedCheckedValues.includes(option.value);

                    return (
                        <TouchableOpacity
                            key={option.value}
                            style={active ? [styles.checkBox, styles.activeCheckBox] : styles.checkBox}
                            onPress={() => {
                                console.log(option.value, active);

                                if (active) {
                                    // Uncheck
                                    updatedCheckedValues = updatedCheckedValues.filter(
                                        (checkedValue) => checkedValue !== option.value
                                    );
                                }
                                else {
                                    // Check
                                    updatedCheckedValues.push(option.value);
                                }

                                onChange(updatedCheckedValues);
                            }}
                        >
                            <MaterialIcons
                                name={active ? "check-box" : "check-box-outline-blank"}
                                size={fontSize + 8}
                                color={active ? "#06b6d4" : "#64748b"}
                            />
                            <Text
                                style={active ? [styles.text, styles.activeText, { fontSize: fontSize }] : [styles.text, { fontSize: fontSize }]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    checkBox: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 15
    },
    activeCheckBox: {
        backgroundColor: "#06b6d411"
    },
    text: {
        marginLeft: 15,
        color: "#374151",
    },
    activeText: {
        color: "#6b7280"
    }
})