import { getDogsWithOwnerInfo } from "@/src/services/dogService";
import { getEventsByIds } from "@/src/services/eventService";
import { addEventToGroup, addMemberWithDogs, deleteGroup, getGroupById, removeMemberWithDogs } from "@/src/services/groupService";
import { getUserProfiles } from "@/src/services/userProfileService";
import { Alert } from "react-native";

// ladataan ryhmän tiedot, jäsenet, adminit, tapahtumat ja jäsenten koirat

export async function loadGroupData(groupId: string) {
  const g = await getGroupById(groupId);
  
  if (!g) return null;

  const memberIds = Array.isArray(g.memberIds) ? g.memberIds : [];
  const adminIds = Array.isArray(g.groupAdminIds) ? g.groupAdminIds : [];
  
  const [memberProfiles, adminProfiles, evts] = await Promise.all([
    getUserProfiles(memberIds),
    getUserProfiles(adminIds),
    getEventsByIds(g.eventIds ?? []),
  ]);

  // Haetaan jäsenien koirat
  const allMemberDogIds = g.memberDogs ? Object.values(g.memberDogs).flat() : [];
  let dogsWithOwners: any[] = [];
  
  if (allMemberDogIds.length > 0) {
    try {
      dogsWithOwners = await getDogsWithOwnerInfo(allMemberDogIds);
    } catch (err) {
      console.error("Failed to load member dogs:", err);
    }
  }

  return {
    group: g,
    members: memberProfiles,
    admins: adminProfiles,
    events: evts,
    memberDogs: dogsWithOwners,
  };
}
// liittyminen ryhmään valituilla koirilla
export async function joinGroupWithDogs(
  groupId: string,
  userId: string,
  selectedDogIds: string[]
) {
  try {
    await addMemberWithDogs(groupId, userId, selectedDogIds);
    const data = await loadGroupData(groupId);
    return { success: true, data };
  } catch (err) {
    console.error("Failed to join group:", err);
    Alert.alert("Virhe", "Ryhmään liittyminen epäonnistui");
    return { success: false };
  }
}
// poistuminen ryhmästä ja jäsenten koirien poistaminen
export async function leaveGroupWithDogs(
  groupId: string,
  userId: string
) {
  try {
    await removeMemberWithDogs(groupId, userId);
    const data = await loadGroupData(groupId);
    return { success: true, data };
  } catch (err) {
    console.error("Failed to leave group:", err);
    Alert.alert("Virhe", "Ryhmästä poistuminen epäonnistui");
    return { success: false };
  }
}
// ryhmän poistaminen varmistuksella
export async function deleteGroupAction(groupId: string, onSuccess: () => void) {
  Alert.alert("Poista ryhmä", "Haluatko varmasti poistaa ryhmän?", [
    { text: "Peruuta", style: "cancel" },
    {
      text: "Poista",
      onPress: async () => {
        try {
          await deleteGroup(groupId);
          onSuccess();
        } catch (e) {
          console.error("Failed to delete group:", e);
          Alert.alert("Virhe", "Ryhmän poistaminen epäonnistui");
        }
      },
    },
  ]);
}
// päivitetään ryhmän tiedot
export async function refreshGroupData(groupId: string) {
  try {
    const data = await loadGroupData(groupId);
    return { success: true, data };
  } catch (err) {
    console.error("Failed to refresh group:", err);
    return { success: false };
  }
}

// lisätään tapahtuma ryhmään
export async function addEventToGroupAction(groupId: string, eventId: string) {
  try {
    await addEventToGroup(groupId, eventId);
    const data = await loadGroupData(groupId);
    return { success: true, data };
  } catch (err) {
    console.error("Failed to add event to group:", err);
    Alert.alert("Virhe", "Tapahtuman lisääminen ryhmään epäonnistui");
    return { success: false };
  }
}
