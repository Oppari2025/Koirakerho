import { Timestamp } from "firebase/firestore";

// määritellään ryhmän tiedot tallennettavaksi Firestoreen

export interface FirestoreGroup {
  groupName: string;
  groupDescription?: string;
  groupAdminIds: string[];
  createdAt: Timestamp;
  imageUrl?: string;
  memberIds: string[]; 
  eventIds: string[];
  memberDogs?: Record<string, string[]>; // avain: käyttäjäID, arvo: koiraID-taulukko
}

export interface Group extends FirestoreGroup {
  id: string;
}