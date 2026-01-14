import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  WhereFilterOp
} from "firebase/firestore";
import { auth, db } from "../firebase/FirebaseConfig";
import { FirestoreGroup, Group } from "../types/group";

const groupsCol = collection(db, "groups");

// luodaan uusi ryhmä Firestoreen
export async function createGroup(
  data: Omit<FirestoreGroup, "createdAt">
): Promise<Group> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  // ensure the group name is unique
  const name = (data.groupName ?? "").toString().trim();
  if (!name) throw new Error("Group name is required");
  const existingQ = query(groupsCol, where("groupName", "==", name));
  const existingSnaps = await getDocs(existingQ);
  if (!existingSnaps.empty) {
    throw new Error("A group with this name already exists");
  }

  const groupAdminIds = Array.from(new Set([...(data.groupAdminIds ?? []), uid]));
  const memberIds = Array.from(new Set([...(data.memberIds ?? []), uid]));

  const payload: Omit<Group, "id"> = {
    ...data,
    groupName: name,
    memberIds,
    eventIds: data.eventIds ?? [],
    groupAdminIds,
    createdAt: serverTimestamp() as unknown as FirestoreGroup["createdAt"],
  };

  // Firestore ei tallenna undefined-arvoja, poistetaan ne ennen tallennusta
  Object.keys(payload).forEach((key) => {
    // @ts-expect-error dynamic access
    if (payload[key] === undefined) {
      delete (payload as any)[key];
    }
  });

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
