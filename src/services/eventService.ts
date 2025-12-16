import { addDoc, arrayUnion, collection, doc, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"
import { auth, db } from "../firebase/FirebaseConfig"
import { Event, FirestoreEvent } from "../types/event"

// luodaan tapahtuma Firestoreen

export const createEvent = async (
  event: Omit<FirestoreEvent, "createdBy" | "createdAt" | "participants"> // Omit poissulkkee sarakkeet, koska ne määritellään täällä
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

export const joinEvent = async (eventId: string) => {
  if (!auth.currentUser) {
    console.error('joinEvent: no authenticated user')
    throw new Error('Not authenticated')
  }

  await updateDoc(doc(db, "events", eventId), {
    participants: arrayUnion(auth.currentUser.uid)
  })
}
