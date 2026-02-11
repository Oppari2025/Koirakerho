import EventCard from '@/components/eventCard';
import { EventData } from '@/types/events';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function EventListScreen(): React.JSX.Element {
  // router
  const router = useRouter();

  // state
  const [events, setEvents] = useState<EventData[]>([]);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(true);

  // effects

  useEffect(() => {
    const test_events: EventData[] = [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        eventName: 'First Item',
        eventInfo: "This is test event number 1.",
        date: "01.01.2020",
        imageUrl: "https://dgfadag"
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        eventName: 'Second Item',
        eventInfo: "This is test event number 2.",
        date: "01.01.2020",
        imageUrl: "https://dgafdaggd"
      },
      {
        id: '3ac68afc-c60ghf5-48d3-a4f8-fbd91aa97f63',
        eventName: 'Second Item',
        eventInfo: "This is test event number 3.",
        date: "01.01.2020",
        imageUrl: "https://gdadagds"
      }
    ]

    setEvents(test_events);
    return () => {

    };
  }, []);


  function onPressAddEvent() {
    router.navigate(`/(main)/addEventScreen`);
  }

  function onPressEventCard(item: EventData) {
    router.push({
      pathname: '/(main)/eventScreen',
      params: { id: item.id },
    });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.listContainer}>
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
    backgroundColor: '#fff3c0ff',
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

    // backgroundColor: "#b430303d",
    // borderWidth: 2,
    // borderColor: "blue",
  },
  text: {
    color: "black"
  },
  floatingButton: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#144100ff',
  },
  floatingButtonIcon: {
    fontSize: 28,
    color: "white"
  }
});
