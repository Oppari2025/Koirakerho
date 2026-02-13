import { getMyTickets } from "@/src/services/ticketService";
import { Ticket } from "@/src/types/ticket";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TicketsScreen(): React.JSX.Element {
    const router = useRouter();
    const [tickets, setTickets] = React.useState<Ticket[]>([]);
    const [loading, setLoading] = React.useState(false);

  // Haetaan liput Firebasesta kun komponentti mountataan
  React.useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const myTickets = await getMyTickets();
        setTickets(myTickets as Ticket[]);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
      }
    };
        fetchTickets();
  }, []);

    const renderItem = ({ item }: { item: Ticket }) => {
        return (
            <TouchableOpacity
                onPress={() => router.navigate(`/(main)/ticketScreen?id=${item.id}`)}
                style={{
                    backgroundColor: "#ffffffff",
                    padding: 16,
                    borderRadius: 10,
                    gap: 8
                }}
            >
                <View style={{ width: "100%", flexDirection: "row" }}>
                    <View style={{ borderRadius: 10, backgroundColor: "#ebebebff", padding: 8 }}>
                    </View>
                </View>

                <View style={{ height: 40 }}>
                    <Text style={{ color: "#000000ff", fontWeight: "bold", fontSize: 16 }}>
                        {item.eventName}
                    </Text>
                </View>
                <View style={{ borderBottomColor: "black", borderBottomWidth: StyleSheet.hairlineWidth }} />


                <View>
                    <Text>{item.startTime}</Text>
                </View>
            </TouchableOpacity >
        );
    };

return (
    <SafeAreaProvider>
      <SafeAreaView style={{ padding: 8, height: "100%" }}>
        <FlatList
          data={tickets}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => <View style={{ height: 8 }} />}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          ListFooterComponent={() => <View style={{ height: 200 }} />}
          refreshing={loading}
          onRefresh={async () => {
            setLoading(true);
            const myTickets = await getMyTickets();
            setTickets(myTickets as Ticket[]);
            setLoading(false);
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,
        backgroundColor: '#fdfbd4',
    }
})