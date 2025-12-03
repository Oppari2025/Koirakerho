import { VStack } from "@/components/ui/vstack";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function EventScreen() {
    const eventId = useLocalSearchParams<{id: string}>();

    return (
        <SafeAreaProvider>
            <SafeAreaView className={classes.page}>
                <ScrollView className={classes.pageContent}>
                    <VStack>

                    </VStack>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const classes = {
    page: "w-full h-full items-center",
    pageHeader: "w-full justify-center bg-[#888888]", //  
    pageHeaderText: "font-bold text-3xl p-2",
    pageContent: "mr-2 ml-2"
}