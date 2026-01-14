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

// batch fetch multiple user profiles by ids (handles empty array)
export const getUserProfiles = async (
  userIds: string[]
): Promise<Array<{ id: string; data: FirestoreUser }>> => {
  if (!userIds || !userIds.length) return [];

  // Firestore `in` queries support up to 10 values; chunk if necessary
  const chunks: string[][] = [];
  for (let i = 0; i < userIds.length; i += 10) {
    chunks.push(userIds.slice(i, i + 10));
  }

  const results: Array<{ id: string; data: FirestoreUser }> = [];
  const { collection, query, where, getDocs, documentId } = await import("firebase/firestore");

  for (const chunk of chunks) {
    const q = query(collection(db, "users"), where(documentId(), "in", chunk));
    const snap = await getDocs(q);
    snap.docs.forEach((d) => results.push({ id: d.id, data: d.data() as FirestoreUser }));
  }

  return results;
}
