import { Timestamp } from "firebase/firestore"

export interface FirestoreUser {
  email: string
  name: string
  createdAt: Timestamp
}

export interface User extends FirestoreUser {
  id: string
}