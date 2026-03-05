import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Colors } from "@/constants/theme";
import { listGroups } from "@/src/services/groupService";
import { Group } from "@/src/types/group";
import { useRouter } from 'expo-router';
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
  const router = useRouter();
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
      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 24, backgroundColor: Colors.light.background }}>
        <ActivityIndicator size="large" color={Colors.light.accent} />
      </View>
    );
  }

  if (!groups.length) {
    return (
      <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', paddingVertical: 24, backgroundColor: Colors.light.background }}>
        <Text style={{ color: Colors.light.text }}>Avoimia ryhmiä ei löytynyt</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingVertical: 8, backgroundColor: Colors.light.background }}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect?.(item) || router.push({ pathname: "/(main)/groupScreen", params: { id: item.id } })}>
          <Card style={{ margin: 12, padding: 16, borderRadius: 12, backgroundColor: Colors.light.card, borderColor: Colors.light.border, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }} variant="elevated" size="lg">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <Image
                source={
                  item.imageUrl ? { uri: item.imageUrl } : require("@/assets/images/dog1.jpg")
                }
                style={{ height: 80, width: 80, borderRadius: 12, borderColor: Colors.light.border, borderWidth: 1 }}
              />
              <View style={{ flex: 1 }}>
                <Heading size="sm" style={{ marginBottom: 4, color: Colors.light.text }}>
                  {item.groupName}
                </Heading>
                {item.groupDescription ? (
                  <Text numberOfLines={2} style={{ fontSize: 14, color: Colors.light.gray }}>
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