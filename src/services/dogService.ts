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

// haetaan koirat ID:iden perusteella
export const getDogsByIds = async (dogIds: string[]): Promise<Dog[]> => {
  if (dogIds.length === 0) {
    return []
  }

  // Haetaan koirat suoraan ID:n perusteella käyttämällä doc() referenceja
  const dogsPromises = dogIds.map(dogId => 
    getDoc(doc(db, "dogs", dogId))
  )
  
  const dogDocs = await Promise.all(dogsPromises)
  
  return dogDocs
    .filter(snapshot => snapshot.exists())
    .map(snapshot => ({
      id: snapshot.id,
      ...(snapshot.data() as FirestoreDog)
    }))
}

// haetaan koirat ID:iden perusteella omistajan tiedoin
export const getDogsWithOwnerInfo = async (dogIds: string[]): Promise<(Dog & { ownerName: string })[]> => {
  const dogs = await getDogsByIds(dogIds)
  
  // Haetaan omistajien tiedot
  const ownerIds = [...new Set(dogs.map(d => d.ownerId))]
  const ownerMap: Record<string, { firstName: string; lastName: string }> = {}
  
  for (const ownerId of ownerIds) {
    try {
      const userRef = doc(db, "users", ownerId)
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        const userData = userDoc.data()
        ownerMap[ownerId] = {
          firstName: userData.firstName || "",
          lastName: userData.lastName || ""
        }
      }
    } catch (err) {
      console.error(`Failed to fetch owner ${ownerId}:`, err)
    }
  }
  
  return dogs.map(dog => ({
    ...dog,
    ownerName: `${ownerMap[dog.ownerId]?.firstName || ""} ${ownerMap[dog.ownerId]?.lastName || ""}`.trim() || "Tuntematon"
  }))
}

// poistetaan koira ID:llä

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
