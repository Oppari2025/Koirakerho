// src/types/dog.ts
import { Timestamp } from "firebase/firestore"

export interface FirestoreDog {
  ownerId: string
  name: string
  breed: string
  age: number
  description?: string
  imageUrl?: string
  createdAt: Timestamp
}

export interface Dog extends FirestoreDog {
  id: string
}
