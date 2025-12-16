import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { db } from "../firebase/FirebaseConfig"
import { FirestoreUser } from "../types/user"

// luodaan käyttäjäprofiili Firestoreen
// asetetaan createdAt kenttään nykyhetki

export const createUserProfile = async (
  userId: string,
  data: Omit<FirestoreUser, "createdAt"> // Omit poissulkkee createdAt
): Promise<void> => { 
  await setDoc(doc(db, "users", userId), {
    ...data,
    createdAt: Timestamp.now()
  })
}

// haetaan käyttäjäprofiili Firestoresta

export const getUserProfile = async (
  userId: string
): Promise<FirestoreUser | null> => {
  const snapshot = await getDoc(doc(db, "users", userId))
  return snapshot.exists() ? (snapshot.data() as FirestoreUser) : null
}
