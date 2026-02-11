import { Timestamp } from "firebase/firestore";

export type FirestoreTicket = {
  eventId: string;
  eventName: string;
  startTime: string;
  data: string;
  userId: string;
  createdAt: Timestamp;
};

export interface Ticket extends FirestoreTicket {
  id: string;
}