import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { listGroups } from "@/src/services/groupService";
import { Group } from "@/src/types/group";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  onSelect?: (group: Group) => void;
  limit?: number;
  refreshKey?: number;
};

export default function ListOfGroups({ onSelect, limit, refreshKey }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await listGroups();
        if (!mounted) return;
        setGroups(Array.isArray(data) ? data.slice(0, limit ?? Infinity) : []);
      } catch (err) {
        console.error("Failed to load groups:", err);
        if (mounted) setGroups([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [limit, refreshKey]);

  if (loading) {
    return (
      <View className="w-full items-center justify-center py-6">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!groups.length) {
    return (
      <View className="w-full items-center justify-center py-6">
        <Text>Avoimia ryhmiä ei löytynyt</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 8 }}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect?.(item)}>
          <Card className="m-3 p-4 rounded-lg" variant="elevated" size="lg">
            <View className="flex-row items-center space-x-4">
              <Image
                source={
                  item.imageUrl ? { uri: item.imageUrl } : require("@/assets/images/dog1.jpg")
                }
                className="h-20 w-20 rounded-lg"
              />
              <View className="flex-1">
                <Heading size="sm" className="mb-1">
                  {item.groupName}
                </Heading>
                {item.groupDescription ? (
                  <Text numberOfLines={2} className="text-sm text-gray-600">
                    {item.groupDescription}
                  </Text>
                ) : null}
              </View>
            </View>
          </Card>
        </TouchableOpacity>
      )}
    />
  );
}