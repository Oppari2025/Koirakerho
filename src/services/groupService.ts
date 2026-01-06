import { Group, FirestoreGroup } from "../types/group";
import { db } from "../firebase/FirebaseConfig"
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  WhereFilterOp,
} from "firebase/firestore";

const groupsCol = collection(db, "groups");

// luodaan uusi ryhmä Firestoreen
export async function createGroup(
  data: Omit<FirestoreGroup, "createdAt">
): Promise<Group> {
  const payload: Omit<Group, "id"> = {
    ...data,
    memberIds: data.memberIds ?? [],
    eventIds: data.eventIds ?? [],
    groupAdminIds: data.groupAdminIds ?? [],
    createdAt: serverTimestamp() as unknown as FirestoreGroup["createdAt"],
  };

  const ref = await addDoc(groupsCol, payload);

  return {
    id: ref.id,
    ...payload,
  };
}

// haetaan ryhmä ID:llä
export async function getGroupById(id: string): Promise<Group | null> {
  const ref = doc(db, "groups", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return {
    id: snap.id,
    ...(snap.data() as FirestoreGroup),
  };
}

// päivitetään ryhmän tietoja ID:llä
export async function updateGroup(
  id: string,
  updates: Partial<Omit<FirestoreGroup, "createdAt">>
): Promise<Group | null> {
  const ref = doc(db, "groups", id);
  await updateDoc(ref, updates);
  return getGroupById(id);
}

// poistetaan ryhmä ID:llä
export async function deleteGroup(id: string): Promise<boolean> {
  const ref = doc(db, "groups", id);
  await deleteDoc(ref);
  return true;
}

// listataan ryhmät, voidaan suodattaa kentän, operaattorin ja arvon perusteella
export async function listGroups(
  whereField?: keyof FirestoreGroup,
  op?: WhereFilterOp,
  value?: any
): Promise<Group[]> {
  const q =
    whereField && op && value !== undefined
      ? query(groupsCol, where(whereField, op, value))
      : groupsCol;

  const snaps = await getDocs(q);

  return snaps.docs.map((d) => ({
    id: d.id,
    ...(d.data() as FirestoreGroup),
  }));
}

// lisätään jäsen ryhmään
export async function addMember(
  groupId: string,
  memberId: string
): Promise<Group | null> {
  const ref = doc(db, "groups", groupId);

  await updateDoc(ref, {
    memberIds: arrayUnion(memberId),
  });

  return getGroupById(groupId);
}

// poistetaan jäsen ryhmästä
export async function removeMember(
  groupId: string,
  memberId: string
): Promise<Group | null> {
  const ref = doc(db, "groups", groupId);

  await updateDoc(ref, {
    memberIds: arrayRemove(memberId),
  });

  return getGroupById(groupId);
}

// lisätään tapahtuma ryhmään
export async function addEventToGroup(
  groupId: string,
  eventId: string
): Promise<Group | null> {
  const ref = doc(db, "groups", groupId);

  await updateDoc(ref, {
    eventIds: arrayUnion(eventId),
  });

  return getGroupById(groupId);
}

// poistetaan tapahtuma ryhmästä
export async function removeEventFromGroup(
  groupId: string,
  eventId: string
): Promise<Group | null> {
  const ref = doc(db, "groups", groupId);

  await updateDoc(ref, {
    eventIds: arrayRemove(eventId),
  });

  return getGroupById(groupId);
}
