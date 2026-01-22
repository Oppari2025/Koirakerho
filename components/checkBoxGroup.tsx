import { CheckBoxGroupProps } from "@/types/checkbox";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CheckBoxGroup({ options, checkedValues, onChange, fontSize, style, label, isEditable }: CheckBoxGroupProps): React.JSX.Element {
    let updatedCheckedValues = [...checkedValues];
    fontSize = fontSize || 15;

    return (
        <View style={[styles.container, style]}>
            <Text className="font-bold text-xl text-white">
                {label}
            </Text>

            {
                isEditable ? (
                    <View>
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
                    : updatedCheckedValues.length >= 0 ? (
                        <View>
                            {
                                options.map((option) => {
                                    let active = updatedCheckedValues.includes(option.value);

                                    return (
                                        <View
                                            key={option.value}
                                            style={active ? [styles.checkBox, styles.activeCheckBox] : styles.checkBox}
                                        >
                                            <MaterialIcons
                                                name={active ? "check-box" : "check-box-outline-blank"}
                                                size={fontSize + 8}
                                                color={
                                                    isEditable
                                                        ? active
                                                            ? "#06b6d4"
                                                            : "#64748b"
                                                        : "#d1d1d1ff"
                                                }
                                            />
                                            <Text
                                                style={active ? [styles.text, styles.activeText, { fontSize: fontSize }] : [styles.text, { fontSize: fontSize }]}
                                            >
                                                {option.label}
                                            </Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    )
                        : updatedCheckedValues.length <= 0 && (
                            <View>
                                <Text style={[styles.text, { fontSize: fontSize }]}>None</Text>
                            </View>
                        )

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
        marginLeft: 4,
        color: "#374151",
    },
    activeText: {
        color: "#6b7280"
    },
    editable: {
        borderWidth: 1,
        borderColor: "#FFF"
    }
})