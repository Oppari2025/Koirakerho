import { Heading } from "@/components/ui/heading";
import { useAuth } from "@/src/context/AuthContext";
import { getEventsByIds } from "@/src/services/eventService";
import { addMember, deleteGroup, getGroupById, removeMember } from "@/src/services/groupService";
import { getUserProfiles } from "@/src/services/userProfileService";
import { Group } from "@/src/types/group";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function GroupProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { firebaseUser } = useAuth();

    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [members, setMembers] = useState<{ id: string; data: any }[]>([]);
    const [admins, setAdmins] = useState<{ id: string; data: any }[]>([]);
    const [events, setEvents] = useState<any[]>([]);

    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        async function load() {
            if (!id) return;
            setLoading(true);
            try {
                const g = await getGroupById(id);
                if (!mounted) return;
                setGroup(g);
                // haetaan jäsenet, adminit ja tapahtumat
                if (g) {
                    const memberIds = Array.isArray(g.memberIds) ? g.memberIds : [];
                    const adminIds = Array.isArray(g.groupAdminIds) ? g.groupAdminIds : [];
                    const [memberProfiles, adminProfiles, evts] = await Promise.all([
                        getUserProfiles(memberIds),
                        getUserProfiles(adminIds),
                        getEventsByIds(g.eventIds ?? []),
                    ]);

                    if (!mounted) return;
                    setMembers(memberProfiles);
                    setAdmins(adminProfiles);
                    setEvents(evts);
                }
            } catch (err) {
                console.error("Failed to load group:", err);
                if (mounted) setGroup(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [id]);

    const hasJoined = (g?: Group) => {
        if (!firebaseUser?.uid || !g) return false;
        return Array.isArray(g.memberIds) && g.memberIds.includes(firebaseUser.uid);
    };

    const handleJoin = async () => {
        if (!id || !firebaseUser?.uid) return;
        setSaving(true);
        try {
            await addMember(id, firebaseUser.uid);
            const refreshed = await getGroupById(id);
            setGroup(refreshed);
            // päivitetään jäsenlista
            if (refreshed) {
                const memberProfiles = await getUserProfiles(refreshed.memberIds ?? []);
                setMembers(memberProfiles);
            }
        } catch (err) {
            console.error("Failed to join group:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleLeave = async () => {
        if (!id || !firebaseUser?.uid) return;
        setSaving(true);
        try {
            await removeMember(id, firebaseUser.uid);
            const refreshed = await getGroupById(id);
            setGroup(refreshed);
            if (refreshed) {
                const memberProfiles = await getUserProfiles(refreshed.memberIds ?? []);
                setMembers(memberProfiles);
            }
        } catch (err) {
            console.error("Failed to leave group:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        Alert.alert("Poista ryhmä", "Haluatko varmasti poistaa ryhmän?", [
            { text: "Peruuta", style: "cancel" },
            {
                text: "Poista",
                onPress: async () => {
                    try {
                        await deleteGroup(id);
                        router.back();
                    } catch (e) {
                        console.error("Failed to delete group:", e);
                    }
                },
            },
        ]);
    };

    const isAdmin = !!(firebaseUser?.uid && Array.isArray(group?.groupAdminIds) && group?.groupAdminIds.includes(firebaseUser.uid));

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (!group) {
        return (
            <SafeAreaProvider>
                <SafeAreaView className="flex-1 items-center justify-center">
                    <Text>Ryhmää ei löytynyt</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 ">
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    <Image
                        source={ group.imageUrl ? { uri: group.imageUrl } : require("@/assets/images/dog1.jpg")}
                        className="w-full h-64 rounded-md "
                    />

                    <Heading size="lg" className="mb-2 mt-4">
                        {group.groupName}
                    </Heading>

                    {group.groupDescription ? (
                        <Text className="text-sm text-gray-700 mb-4">{group.groupDescription}</Text>
                    ) : null}

                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2">Kouluttajat</Text>
                        {admins.length ? (
                            <View className="flex-row space-x-3">
                                {admins.map((a) => (
                                    <View key={a.id} className="items-center">
                                        <Image
                                            source={a.data.imageUrl ? { uri: a.data.imageUrl } : require("@/assets/images/dog1.jpg")}
                                            className="h-12 w-12 rounded-full"
                                        />
                                        <Text className="text-sm text-gray-700">{a.data.firstName} {a.data.lastName}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text className="text-sm text-gray-600">No admins listed</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-gray-700 font-semibold mb-2">Jäsenet ({members.length})</Text>
                        {members.length ? (
                            <FlatList
                                data={members}
                                horizontal
                                keyExtractor={(it) => it.id}
                                renderItem={({ item }) => (
                                    <View className="items-center mr-10">
                                        <Image
                                            source={item.data.imageUrl ? { uri: item.data.imageUrl } : require("@/assets/images/dog1.jpg")}
                                            className="h-14 w-14 rounded-full"
                                        />
                                        <Text className="text-gray-700 text-sm mt-1">{item.data.firstName}</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text className="text-sm text-gray-600">Ei jäseniä</Text>
                        )}
                    </View>

                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">Tulevat tapahtumat ({events.length})</Text>
                        {events.length ? (
                            <FlatList
                                data={events}
                                keyExtractor={(ev) => ev.id}
                                renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => router.navigate(`/(main)/eventScreen?id=${item.id}`)}>
                                    <View className="py-2">
                                        <Text className="text-base">{item.title || item.eventName || 'Event'}</Text>
                                        <Text className="text-sm text-gray-600">{item.description || ''}</Text>
                                    </View>
                                </TouchableOpacity>
                                )}
                            />
                        ) : (
                            <Text className="text-sm text-gray-600">No events</Text>
                        )}
                    </View>

                    {firebaseUser?.uid ? (
                        hasJoined(group) ? (
                            <TouchableOpacity
                                className="bg-red-600 px-4 py-3 rounded-lg items-center"
                                onPress={handleLeave}
                                disabled={saving}
                            >
                                <Text className="text-white">Leave Group</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                className="bg-blue-600 px-4 py-3 rounded-lg items-center"
                                onPress={handleJoin}
                                disabled={saving}
                            >
                                <Text className="text-white">Join Group</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <Text className="text-sm text-gray-600">Kirjaudu sisään liittyäksesi ryhmään</Text>
                    )}

                {isAdmin ? (
                    <View className="mt-4 flex-row space-x-3">
                        <TouchableOpacity className="bg-yellow-600 px-4 py-3 rounded-lg items-center flex-1" onPress={() => router.push(`/(main)/editGroupScreen?id=${id}`)}>
                            <Text className="text-white">Edit</Text>
                        </TouchableOpacity>
                        <Text>   </Text>
                        <TouchableOpacity className="bg-red-700 px-4 py-3 rounded-lg items-center flex-1" onPress={handleDelete}>
                            <Text className="text-white">Delete Group</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}