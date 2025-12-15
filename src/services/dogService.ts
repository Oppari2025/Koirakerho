import { addDoc, collection, getDocs, query, Timestamp, where } from "firebase/firestore"
import { auth, db } from "../firebase/FirebaseConfig"
import { Dog, FirestoreDog } from "../types/dog"


export const addDog = async (
  dog: Omit<FirestoreDog, "ownerID" | "createdAt"> // Omit poissulkkee ownderIdcreatedAt, koska se määritellään tässä funktiossa
) => {
  return await addDoc(collection(db, "dogs"), {
    ...dog,
    ownerId: auth.currentUser!.uid,
    createdAt: Timestamp.now()
  })
}

export const getMyDogs = async (): Promise<Dog[]> => {
  const q = query(
    collection(db, "dogs"),
    where("ownerID", "==", auth.currentUser!.uid)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as FirestoreDog)
  }))
}
