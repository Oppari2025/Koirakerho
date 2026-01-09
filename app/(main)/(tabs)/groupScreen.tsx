import AddGroup from "@/components/database/addGroup";
import ListOfGroups from "@/components/database/listOfGroups";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function GroupScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          <ListOfGroups refreshKey={refreshKey} />
        </View>
        <View className="paddingBottom-6 items-center justify-center absolute left-0 right-0 bottom-0">
          <AddGroup onCreated={() => setRefreshKey(refreshKey + 1)} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
