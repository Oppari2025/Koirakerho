import { Timestamp } from "firebase/firestore"

// määritellään käyttäjän tiedot tallennettavaksi Firestoreen

export interface FirestoreUser {
  email: string
  firstName: string
  lastName: string
  imageUrl?: string
  createdAt: Timestamp
}

export interface User extends FirestoreUser {
  id: string
}