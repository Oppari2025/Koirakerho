import { addDoc, collection, Timestamp } from "firebase/firestore";
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
