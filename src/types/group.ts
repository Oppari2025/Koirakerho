import { Timestamp } from "firebase/firestore";

// määritellään ryhmän tiedot tallennettavaksi Firestoreen

export interface FirestoreGroup {
  groupName: string;
  groupDescription?: string;
  groupAdminIds: string[];
  createdAt: Timestamp;
  memberIds: string[]; 
  eventIds: string[];
}

export interface Group extends FirestoreGroup {
  id: string;
}