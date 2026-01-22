import EventCard from '@/components/eventCard';
import { EventData } from '@/types/events';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type AddEventButtonProps = {
  onPress: () => void;
}


function AddEventButton({ onPress }: AddEventButtonProps) {
  return (
    <TouchableOpacity
      style={{
        width: 64,
        height: 64,
        padding: 8,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        position: "absolute",
        zIndex: 99,
        bottom: 0,
        marginBottom: 8,
        backgroundColor: '#144100ff',
        shadowColor: "black",
        shadowRadius: 1,
        shadowOpacity: 1,
        shadowOffset: { width: 1, height: 1 },
        elevation: 1
      }}
      onPress={onPress}
    >
      <Text
        style={{
          color: "white",
          fontSize: 20
        }}
      >
        +
      </Text>
    </TouchableOpacity>
  )
}


export default function EventListScreen() {
  const router = useRouter();

  const [events, setEvents] = React.useState<EventData[]>([]);

  React.useEffect(() => {
    const test_events: EventData[] = [
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        eventName: 'First Item',
        eventInfo: "This is test event number 1.",
        date: "01.01.2020",
        imageUrl: "https://gluestack.github.io/public-blog-video-assets/saree.png"
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        eventName: 'Second Item',
        eventInfo: "This is test event number 2.",
        date: "01.01.2020",
        imageUrl: "https://gluestack.github.io/public-blog-video-assets/saree.png"
      },
      {
        id: '3ac68afc-c60ghf5-48d3-a4f8-fbd91aa97f63',
        eventName: 'Second Item',
        eventInfo: "This is test event number 3.",
        date: "01.01.2020",
        imageUrl: "https://gluestack.github.io/public-blog-video-assets/saree.png"
      }
    ]

    setEvents(test_events);
    return () => {

    };
  }, []);


  function onPressAddEvent() {
    router.navigate(`/(main)/addEventScreen`);
  }

  const renderItem = ({ item }: { item: EventData }) => {
    return (
      <EventCard
        item={item}
        onPress={() => router.navigate(`/(main)/eventScreen?id=${item.id}`)}
      />
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          padding: 8,
          //backgroundColor: '#fff3c0ff',
        }}
      >
        <View
          style={{
            height: "auto",
            width: "100%"
          }}
        >
          <FlatList
            data={events}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            // extraData={selectedId}
            className={classes.eventCardList}
            ListHeaderComponent={() => <View style={{ height: 8 }} />}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            ListFooterComponent={() => <View style={{ height: 200 }} />}
          />
        </View>
        <View
          style={{
            alignItems: "flex-end",
            margin: 8
          }}
        >
          <AddEventButton
            onPress={onPressAddEvent}
          />
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const classes = {
  page: "w-full h-full items-center",
  pageHeader: "w-full justify-center",
  pageHeaderText: "font-bold text-3xl p-2",
  pageContent: "h-auto",



  eventCardList: ""
}

