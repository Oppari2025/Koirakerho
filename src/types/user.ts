import { Timestamp } from "firebase/firestore"

// määritellään käyttäjän tiedot tallennettavaksi Firestoreen

export interface FirestoreUser {
  email: string
  firstName: string
  lastName: string
  imageUrl?: string
  createdAt: Timestamp
  age?: number
  description?: string
  gender?: 'Male' | 'Female'
}

export interface User extends FirestoreUser {
  id: string
}