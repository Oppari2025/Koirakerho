import { addDoc, arrayRemove, arrayUnion, collection, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { auth, db } from "../firebase/FirebaseConfig"
import { Event, FirestoreEvent } from "../types/event"

// luodaan tapahtuma Firestoreen ja varmistetaan että käyttäjä on kirjautunut
// asetetaan createdBy, participants ja createdAt kentät täällä

export const createEvent = async (
  event: Omit<FirestoreEvent, "createdBy" | "createdAt" | "participants"> // Omit poissulkkee sarakkeet
) => {
  if (!auth.currentUser) {
    console.error('createEvent: no authenticated user', auth.currentUser)
    throw new Error('Not authenticated')
  }

  console.log('createEvent: current uid', auth.currentUser.uid)

  return await addDoc(collection(db, "events"), {
    ...event,
    createdBy: auth.currentUser.uid,
    participants: [],
    createdAt: Timestamp.now()
  })
}

// haetaan tulevat tapahtumat ja päivämäärän pitää olla suurempi kuin nyt

export const getUpcomingEvents = async (): Promise<Event[]> => {
  const q = query(
    collection(db, "events"),
    where("date", ">", Timestamp.now())
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as FirestoreEvent)
  }))
}

// lisätään nykyinen käyttäjä osallistujaksi olemassa olevaan tapahtumaan
// varmistetaan ensin että käyttäjä on kirjautunut

export const joinEvent = async (eventId: string) => {
  if (!auth.currentUser) {
    console.error('joinEvent: no authenticated user')
    throw new Error('Not authenticated')
  }

  await updateDoc(doc(db, "events", eventId), {
    participants: arrayUnion(auth.currentUser.uid)
  })
}

// poistetaan nykyinen käyttäjä osallistujista olemassa olevassa tapahtumassa
// varmistetaan ensin että käyttäjä on kirjautunut
export const leaveEvent = async (eventId: string) => {
  if (!auth.currentUser) {
    console.error("leaveEvent: no authenticated user");
    throw new Error("Not authenticated");
  }

  await updateDoc(doc(db, "events", eventId), {
    participants: arrayRemove(auth.currentUser.uid),
  })
}