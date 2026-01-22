import { removeMemberWithDogs } from "@/src/services/groupService";
import { getUserProfiles } from "@/src/services/userProfileService";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  groupId: string;
  memberIds: string[];
  onMemberRemoved?: (removedMemberId: string) => void;
};

export default function MemberManagement({ groupId, memberIds, onMemberRemoved }: Props) {
  const [members, setMembers] = useState<{ id: string; data: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadMembers();
  }, [memberIds]);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const profiles = await getUserProfiles(memberIds);
      setMembers(profiles);
    } catch (err) {
      console.error("Failed to load members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (memberId: string, memberName: string) => {
    Alert.alert(
      "Poista jäsen",
      `Haluatko varmasti poistaa ${memberName} ryhmästä?`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            try {
              setRemovingId(memberId);
              await removeMemberWithDogs(groupId, memberId);
              setMembers(members.filter(m => m.id !== memberId));
              onMemberRemoved?.(memberId);
              Alert.alert("Onnistui", `${memberName} poistettu ryhmästä`);
            } catch (err) {
              console.error("Failed to remove member:", err);
              Alert.alert("Virhe", "Jäsenen poistaminen epäonnistui");
            } finally {
              setRemovingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="py-4">
        <Text className="text-typography-500">Ladataan jäseniä...</Text>
      </View>
    );
  }

  return (
    <View className="space-y-2">
      <Text className="text-typography-700 font-semibold mb-3">Ryhmän jäsenet ({members.length})</Text>
      {members.length ? (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-background-50 border border-background-200">
              <View className="flex-row items-center flex-1">
                <Image
                  source={item.data.imageUrl ? { uri: item.data.imageUrl } : require("@/assets/images/dog1.jpg")}
                  className="h-12 w-12 rounded-full mr-3"
                />
                <View>
                  <Text className="font-semibold text-typography-900">
                    {item.data.firstName} {item.data.lastName}
                  </Text>
                  <Text className="text-xs text-typography-500">{item.data.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  handleRemoveMember(
                    item.id,
                    `${item.data.firstName} ${item.data.lastName}`
                  )
                }
                disabled={removingId === item.id}
                className="bg-red-500 px-3 py-2 rounded"
              >
                <Text className="text-white text-sm font-semibold">
                  {removingId === item.id ? "..." : "Poista"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text className="text-sm text-typography-500 pb-2">Ei jäseniä</Text>
      )}
    </View>
  );
}
