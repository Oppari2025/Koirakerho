import AddGroup from "@/components/database/addGroup";
import ListOfGroups from "@/components/database/listOfGroups";
import { Colors } from "@/constants/theme";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function GroupList() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
          <ListOfGroups refreshKey={refreshKey} />
        </View>
        <View style={{ paddingBottom: 24, alignItems: 'center', justifyContent: 'center', position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <AddGroup onCreated={() => setRefreshKey(refreshKey + 1)} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
