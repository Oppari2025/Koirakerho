import { db } from '@/src/firebase/FirebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const getUserByUid = async (uid: string) => {
  if (!uid) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() };
};