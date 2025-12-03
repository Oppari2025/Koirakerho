
type EventData = {
  id: string;
  eventName: string;
  eventInfo: string;
  date: string;
  imageUrl: string;
};

type EventCardProps = {
  item: EventData;
  onPress: () => void;
};

export { EventCardProps, EventData };
