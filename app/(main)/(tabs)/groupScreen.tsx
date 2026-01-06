import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getGroupById } from "../../../src/services/groupService";
import { Group } from "../../../src/types/group";

export default function GroupScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;

    async function loadGroup() {
      const data = await getGroupById(groupId);
      setGroup(data);
      setLoading(false);
    }

    loadGroup();
  }, [groupId]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Group not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 px-4 pt-6">
      <View className="m-6 p-5 bg-white rounded-lg">
        <Card
          size="lg"
          variant="elevated"
          className="m-3 bg-gray-600 p-4 rounded-lg"
        >
          <Image
            source={require("@/assets/images/dog1.jpg")}
            className="h-64 w-64 rounded-lg mb-3 self-center"
          />

          <Heading size="lg" className="mb-1 text-white self-center">
            {group.groupName}
          </Heading>
        </Card>
      </View>
    </SafeAreaView>
  );
}
