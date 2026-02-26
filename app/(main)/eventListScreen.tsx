import EventCard from '@/components/eventCard';
import { useAuth } from '@/src/context/AuthContext';
import { getUpcomingEvents } from '@/src/services/eventService';
import { Event } from '@/src/types/event';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function EventListScreen(): React.JSX.Element {
  // router
  const router = useRouter();

  // database
  const { firebaseUser } = useAuth()

  // state
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(true);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // effects

  async function handleGetEvents() {
    console.log("handlegetevents");
    setIsLoading(true);
    setStatus(null);

    getUpcomingEvents().then(events => {
      setEvents(events);
    }).catch(error => {
      setStatus(`Tapahtumatietojen lataaminen epäonnistui.`);
    }).finally(() => {
      setIsLoading(false);
    });
  }

  async function onRefresh() {
    handleGetEvents();
  }

  useEffect(() => {
    handleGetEvents();

    return () => { };
  }, []);

  function onPressAddEvent() {
    router.navigate(`/(main)/eventScreen`);
  }

  function onPressEventCard(item: Event) {
    router.navigate(`/(main)/eventScreen?id=${item.id}`);
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
          {
            (
              () => {
                if (status) {
                  return (
                    <Text className="text-black text-lg">
                      {status}
                    </Text>
                  )
                }
                else if (!events || events.length === 0) {
                  return (
                    <Text className="text-black text-lg">
                      Ei tulevia tapahtumia.
                    </Text>
                  )
                }
              }
            )()
          }

          <FlatList
            ListHeaderComponent={() => <View style={{ height: 8 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListFooterComponent={() => <View style={{ height: 200 }} />}
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <EventCard
                  item={item}
                  onPress={() => onPressEventCard(item)}
                />
              );
            }}
            refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
          />
        </View>
        <View style={styles.overlay}>
          {
            isAdminUser && (
              <TouchableOpacity
                style={styles.floatingButton}
                onPress={onPressAddEvent}
              >
                <MaterialIcons
                  name="add"
                  style={styles.floatingButtonIcon}
                />
              </TouchableOpacity>
            )
          }
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    padding: 8,
    backgroundColor: '#fdfbd4',
  },
  listContainer: {
    height: "auto",
    width: "100%"
  },
  overlay: {
    position: "absolute",
    flex: 1,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: 8,
    alignItems: "center",
    justifyContent: "flex-end",
    pointerEvents: "box-none",
  },
  text: {
    color: "black"
  },
  floatingButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#bdb76b',
    borderWidth: 1,
    borderColor: "gray"
  },
  floatingButtonIcon: {
    fontSize: 32,
    color: "#fdfbd4"
  }
});
