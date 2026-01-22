import { getEventsByIds } from "@/src/services/eventService";
import { removeEventFromGroup } from "@/src/services/groupService";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

type Props = {
  groupId: string;
  eventIds: string[];
  onEventRemoved?: (removedEventId: string) => void;
};

export default function EventManagement({ groupId, eventIds, onEventRemoved }: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, [eventIds]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const evts = await getEventsByIds(eventIds);
      setEvents(evts);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEvent = (eventId: string, eventName: string) => {
    Alert.alert(
      "Poista tapahtuma",
      `Haluatko varmasti poistaa tapahtuman "${eventName}" ryhmästä?`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: async () => {
            try {
              setRemovingId(eventId);
              await removeEventFromGroup(groupId, eventId);
              setEvents(events.filter(e => e.id !== eventId));
              onEventRemoved?.(eventId);
              Alert.alert("Onnistui", `Tapahtuma "${eventName}" poistettu ryhmästä`);
            } catch (err) {
              console.error("Failed to remove event:", err);
              Alert.alert("Virhe", "Tapahtuman poistaminen epäonnistui");
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
        <Text className="text-typography-500">Ladataan tapahtumia...</Text>
      </View>
    );
  }

  return (
    <View className="space-y-2">
      <Text className="text-typography-700 font-semibold mb-3">Ryhmän tapahtumat ({events.length})</Text>
      {events.length ? (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between p-3 mb-2 rounded-lg bg-background-50 border border-background-200">
              <View className="flex-1">
                <Text className="font-semibold text-typography-900">
                  {item.title || item.eventName || "Tapahtuma"}
                </Text>
                <Text className="text-xs text-typography-500 mt-1">
                  {item.description || "Ei kuvausta"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  handleRemoveEvent(
                    item.id,
                    item.title || item.eventName || "Tapahtuma"
                  )
                }
                disabled={removingId === item.id}
                className="bg-red-500 px-3 py-2 rounded ml-2"
              >
                <Text className="text-white text-sm font-semibold">
                  {removingId === item.id ? "..." : "Poista"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text className="text-sm text-typography-500 pb-4">Ei tapahtumia</Text>
      )}
    </View>
  );
}
