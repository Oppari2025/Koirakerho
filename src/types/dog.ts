import { Timestamp } from "firebase/firestore"

// määritellään koiran tiedot tallennettavaksi Firestoreen

export interface FirestoreDog {
  ownerId: string
  name: string
  breed: string
  age: number
  description?: string
  imageUrl?: string
  createdAt: Timestamp
  healthAssessmentDone: boolean
}

export interface Dog extends FirestoreDog {
  id: string
}
