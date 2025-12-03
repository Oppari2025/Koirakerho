import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Text } from '@/components/ui/text';
import { VStack } from "@/components/ui/vstack";
import { EventCardProps, EventData } from '@/types/events';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


const DATA: EventData[] = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    eventName: 'First Item',
    eventInfo: "fddfg",
    date: "01.01.2020",
    imageUrl: "https://gluestack.github.io/public-blog-video-assets/saree.png"
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    eventName: 'Second Item',
    eventInfo: "fdgdfd",
    date: "01.01.2020",
    imageUrl: "https://gluestack.github.io/public-blog-video-assets/saree.png"
  },
  {
    id: '3ac68afc-c60ghf5-48d3-a4f8-fbd91aa97f63',
    eventName: 'Second Item',
    eventInfo: "fdgdfd",
    date: "01.01.2020",
    imageUrl: "https://gluestack.github.io/public-blog-video-assets/saree.png"
  }
];

type AddEventButtonProps = {
  onPress: () => void;
}


function AddEventButton({ onPress }: AddEventButtonProps) {
  return (
    <TouchableOpacity className={classes.floatingButton} onPress={() => onPress()}>
      <Text className={classes.floatingButtonText}>+</Text>
    </TouchableOpacity>
  )
}

const EventCard = ({ item, onPress }: EventCardProps) => (
  <TouchableOpacity onPress={() => onPress()}>
    <Card className={classes.eventCard}>
      <Image
        source={{
          uri: item.imageUrl,
        }}
        className={classes.eventCardImage}
        alt="image"
      />
      <Text className={classes.eventCardDate}>
        {item.date}
      </Text>
      <VStack className={classes.eventCardBottomContainer}>
        <Heading className={classes.eventCardEventNameText}>
          {item.eventName}
        </Heading>
        <Text className={classes.eventCardInfoText}>
          {item.eventInfo}
        </Text>
      </VStack>
    </Card>
  </TouchableOpacity>


);


export default function eventsScreen() {
  const router = useRouter();

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
      <SafeAreaView className={classes.page}>
        <VStack className={classes.pageContent}>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            // extraData={selectedId}
            className={classes.eventCardList}
            ListHeaderComponent={() => <VStack style={{ height: 8 }} />}
            ItemSeparatorComponent={() => <VStack style={{ height: 8 }} />}
            ListFooterComponent={() => <VStack style={{ height: 8 }} />}
          />
        </VStack>
        <AddEventButton onPress={() => router.navigate(`/(main)/addEventScreen`)} />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const classes = {
  page: "w-full h-full items-center",
  pageHeader: "w-full justify-center",
  pageHeaderText: "font-bold text-3xl p-2",
  pageContent: "h-auto",



  eventCardList: "",

  eventCard: "rounded-lg max-w-[360px] h-[380px]",
  eventCardImage: "h-[240px] w-full rounded-md aspect-[4/3] mb-4",
  eventCardContent: "",
  eventCardDate: "text-sm font-normal text-typography-700",
  eventCardBottomContainer: "",
  eventCardEventNameText: "text-base mb-2",
  eventCardInfoText: "text-sm",

  floatingButton: "w-16 h-16 absolute z-[10] bottom-4 bg-red-700 justify-center items-center rounded-full",
  floatingButtonText: "text-2xl",
}

