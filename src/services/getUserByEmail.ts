import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebase/FirebaseConfig";

export async function getUserByEmail(email) {
  const q = query(
    collection(db, 'users'),
    where('email', '==', email)
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return {
    uid: doc.id,
    ...doc.data(),
  };
}
