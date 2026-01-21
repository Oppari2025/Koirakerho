import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { auth, db } from "../firebase/FirebaseConfig"
import { Dog, FirestoreDog } from "../types/dog"

// luodaan koira Firestoreen ja tarkistetaan kirjautunut käyttäjä

export const addDog = async (
  dog: Omit<FirestoreDog, "ownerID" | "createdAt"> // Omit poissulkkee ownderIdcreatedAt, koska ne määritellään tässä funktiossa
) => {
  if (!auth.currentUser) {
    console.error('addDog: no authenticated user', auth.currentUser)
    throw new Error('Not authenticated')
  }

  return await addDoc(collection(db, "dogs"), {
    ...dog,
    ownerId: auth.currentUser.uid,
    createdAt: Timestamp.now()
  })
}

// haetaan kirjautuneen käyttäjän koirat
// jos käyttäjää ei ole kirjautunut, palautetaan tyhjä taulukko

export const getMyDogs = async (): Promise<Dog[]> => {
  if (!auth.currentUser) {
    return []
  }

  const q = query(
    collection(db, "dogs"),
    where("ownerId", "==", auth.currentUser.uid)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as FirestoreDog)
  }))
}
export async function deleteDog(dogId: string) {
  await deleteDoc(doc(db, 'dogs', dogId));
}

export const getDogById = async (dogId: string): Promise<Dog | null> => {
  const ref = doc(db, "dogs", dogId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as FirestoreDog),
  };
};

export const updateDog = async (
  dogId: string,
  data: Partial<FirestoreDog>
) => {
  const ref = doc(db, "dogs", dogId);
  return await updateDoc(ref, data);
};
