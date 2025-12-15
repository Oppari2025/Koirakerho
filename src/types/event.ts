// src/types/event.ts
import { Timestamp } from "firebase/firestore"

export interface EventLocation {
  address: string
  lat: number
  lng: number
}

export interface FirestoreEvent {
  title: string
  description: string
  location: EventLocation
  date: Timestamp
  createdBy: string
  participants: string[]
  createdAt: Timestamp
}

export interface Event extends FirestoreEvent {
  id: string
}
