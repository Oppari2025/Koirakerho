import { addDoc, collection, doc, getDoc, getDocs, query, Timestamp, where } from "firebase/firestore";
import { auth, db } from "../firebase/FirebaseConfig";
import { FirestoreTicket } from "../types/ticket";

export const addTicket = async (
  ticket: Omit<FirestoreTicket, "userId" | "createdAt">
) => {
  if (!auth.currentUser) {
    throw new Error("Not authenticated");
  }

  return await addDoc(collection(db, "tickets"), {
    ...ticket,
    userId: auth.currentUser.uid,
    createdAt: Timestamp.now(),
  });
};

export const getMyTickets = async (): Promise<FirestoreTicket[]> => {
  if (!auth.currentUser) {
    return []
  }

  const q = query(
    collection(db, "tickets"),
    where("userId", "==", auth.currentUser.uid)
  )

  const snapshot = await getDocs(q)

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as FirestoreTicket)
  }))
};

export const getTicketById = async (ticketId: string): Promise<FirestoreTicket | null> => {
  if (!ticketId) return null;

  try {
    const ref = doc(db, "tickets", ticketId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...(snap.data() as FirestoreTicket),
    };
  } catch (err) {
    console.error("Failed to fetch ticket by ID:", err);
    return null;
  }
};
