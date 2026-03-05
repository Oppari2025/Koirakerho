import DogSelectionModal from "@/components/database/dogSelectionModal";
import EditGroup from "@/components/database/editGroup";
import { deleteGroupAction, joinGroupWithDogs, leaveGroupWithDogs, loadGroupData, refreshGroupData } from "@/components/database/groupActions";
import ListOfEvents from "@/components/database/listOfEvents";
import { Heading } from "@/components/ui/heading";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/src/context/AuthContext";
import { Group } from "@/src/types/group";
import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [dogSelectionVisible, setDogSelectionVisible] = useState(false);

    const [members, setMembers] = useState<{ id: string; data: any }[]>([]);
    const [admins, setAdmins] = useState<{ id: string; data: any }[]>([]);
    const [events, setEvents] = useState<any[]>([]);
    const [memberDogs, setMemberDogs] = useState<(any & { ownerName: string })[]>([]);

    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        async function load() {
            if (!id) return;
            setLoading(true);
            try {
                const data = await loadGroupData(id);
                if (!mounted) return;
                
                if (data) {
                    setGroup(data.group);
                    setMembers(data.members);
                    setAdmins(data.admins);
                    setEvents(data.events);
                    setMemberDogs(data.memberDogs);
                } else {
                    setGroup(null);
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

    // Refresh group data when screen is focused (e.g., after creating an event)
    useFocusEffect(
        React.useCallback(() => {
            if (id && group) {
                refreshGroupData(id, setGroup, setEvents, setMembers, setAdmins, setMemberDogs);
            }
        }, [id, group])
    );

    const hasJoined = (g?: Group) => {
        if (!firebaseUser?.uid || !g) return false;
        return Array.isArray(g.memberIds) && g.memberIds.includes(firebaseUser.uid);
    };

    const handleJoin = async () => {
        setDogSelectionVisible(true);
    };

    const handleDogSelectionConfirm = async (selectedDogIds: string[]) => {
        if (!id || !firebaseUser?.uid) return;
        setSaving(true);
        try {
            const result = await joinGroupWithDogs(id, firebaseUser.uid, selectedDogIds);
            if (result.success && result.data) {
                setGroup(result.data.group);
                setMembers(result.data.members);
                setMemberDogs(result.data.memberDogs);
            }
        } finally {
            setSaving(false);
            setDogSelectionVisible(false);
        }
    };

    const handleLeave = async () => {
        if (!id || !firebaseUser?.uid) return;
        setSaving(true);
        try {
            const result = await leaveGroupWithDogs(id, firebaseUser.uid);
            if (result.success && result.data) {
                setGroup(result.data.group);
                setMembers(result.data.members);
                setMemberDogs(result.data.memberDogs);
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!id) return;
        deleteGroupAction(id, () => router.back());
    };

    const isAdmin = !!(firebaseUser?.uid && Array.isArray(group?.groupAdminIds) && group?.groupAdminIds.includes(firebaseUser.uid));

    const handleGroupUpdated = async () => {
        if (!id) return;
        try {
            const result = await refreshGroupData(id);
            if (result.success && result.data) {
                setGroup(result.data.group);
                setMembers(result.data.members);
                setAdmins(result.data.admins);
                setEvents(result.data.events);
                setMemberDogs(result.data.memberDogs);
            }
        } catch (err) {
            console.error("Failed to refresh group:", err);
        }
    };

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.background }}>
                    <ActivityIndicator size="large" color={Colors.light.accent} />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    if (!group) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.light.background }}>
                    <Text style={{ color: Colors.light.text }}>Ryhmää ei löytynyt</Text>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
                <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: Colors.light.background }}>
                    <Image
                        source={ group.imageUrl ? { uri: group.imageUrl } : require("@/assets/images/dog1.jpg")}
                        style={{ width: '100%', height: 256, borderRadius: 12 }}
                    />

                    <Heading size="lg" style={{ marginBottom: 8, marginTop: 16, color: Colors.light.text }}>
                        {group.groupName}
                    </Heading>

                    {group.groupDescription ? (
                        <Text style={{ fontSize: 14, color: Colors.light.gray, marginBottom: 16 }}>{group.groupDescription}</Text>
                    ) : null}

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: Colors.light.text, fontWeight: 'bold', marginBottom: 8 }}>Kouluttajat</Text>
                        {admins.length ? (
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {admins.map((a) => (
                                    <View key={a.id} style={{ alignItems: 'center' }}>
                                        <Image
                                            source={a.data.imageUrl ? { uri: a.data.imageUrl } : require("@/assets/images/dog1.jpg")}
                                            style={{ height: 48, width: 48, borderRadius: 24 }}
                                        />
                                        <Text style={{ fontSize: 14, color: Colors.light.gray }}>{a.data.firstName} {a.data.lastName}</Text>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            <Text style={{ fontSize: 14, color: Colors.light.gray }}>Ei kouluttajia</Text>
                        )}
                    </View>

                    <View style={{ marginBottom: 16 }}>
                        <Text style={{ color: Colors.light.text, fontWeight: 'bold', marginBottom: 8 }}>Jäsenet ({members.length})</Text>
                        {members.length ? (
                            <FlatList
                                data={members}
                                horizontal
                                keyExtractor={(it) => it.id}
                                renderItem={({ item }) => (
                                    <View style={{ alignItems: 'center', marginRight: 24 }}>
                                        <Image
                                            source={item.data.imageUrl ? { uri: item.data.imageUrl } : require("@/assets/images/dog1.jpg")}
                                            style={{ height: 56, width: 56, borderRadius: 28 }}
                                        />
                                        <Text style={{ color: Colors.light.gray, fontSize: 14, marginTop: 4 }}>{item.data.firstName}</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text style={{ fontSize: 14, color: Colors.light.gray }}>Ei jäseniä</Text>
                        )}
                    </View>

                    <View style={{ marginBottom: 24 }}>
                        <Text style={{ color: Colors.light.text, fontWeight: 'bold', marginBottom: 8 }}>Ryhmän koirat ({memberDogs.length})</Text>
                        {memberDogs.length ? (
                            <FlatList
                                data={memberDogs}
                                horizontal
                                keyExtractor={(dog) => dog.id}
                                renderItem={({ item }) => (
                                    <View style={{ alignItems: 'center', marginRight: 24 }}>
                                        <Image
                                            source={
                                                item.imageUrl && item.imageUrl.trim() !== ""
                                                    ? { uri: item.imageUrl }
                                                    : require("@/assets/images/dog1.jpg")
                                            }
                                            style={{ height: 56, width: 56, borderRadius: 28 }}
                                        />
                                        <Text style={{ color: Colors.light.gray, fontSize: 14, marginTop: 4 }}>{item.name}</Text>
                                        <Text style={{ color: Colors.light.gray, fontSize: 12 }}>{item.breed}</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text style={{ fontSize: 14, color: Colors.light.gray }}>Ryhmässä ei ole koiria</Text>
                        )}
                    </View>

                    <View>
                        <ListOfEvents eventIds={group.eventIds} />
                    </View>

                    {firebaseUser?.uid ? (
                        hasJoined(group) ? (
                            <TouchableOpacity
                                style={{ backgroundColor: '#e74c3c', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 }}
                                onPress={handleLeave}
                                disabled={saving}
                            >
                                <Text style={{ color: Colors.light.white }}>Poistu ryhmästä</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={{ backgroundColor: Colors.light.accent, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 }}
                                onPress={handleJoin}
                                disabled={saving}
                            >
                                <Text style={{ color: Colors.light.text }}>Liity ryhmään</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <Text style={{ fontSize: 14, color: Colors.light.gray }}>Kirjaudu sisään liittyäksesi ryhmään</Text>
                    )}

                {isAdmin ? (
                    <View style={{ marginTop: 16, gap: 8 }}>
                        <Text style={{ color: Colors.light.text, fontWeight: 'bold' }}>Ryhmän hallinta:</Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity style={{ backgroundColor: Colors.light.accent, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, alignItems: 'center', flex: 1 }} onPress={() => setEditModalVisible(true)}>
                                <Text style={{ color: Colors.light.text }}>Muokkaa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ backgroundColor: '#c0392b', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, alignItems: 'center', flex: 1 }} onPress={handleDelete}>
                                <Text style={{ color: Colors.light.white }}>Poista Ryhmä</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <TouchableOpacity style={{ backgroundColor: '#27ae60', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, alignItems: 'center', flex: 1 }} onPress={() => router.navigate(`/(main)/addEventScreen?groupId=${id}`)}>
                                <Text style={{ color: Colors.light.white, fontWeight: 'bold' }}>+ Lisää tapahtuma</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}

                <EditGroup
                    groupId={id || ""}
                    visible={editModalVisible}
                    onClose={() => setEditModalVisible(false)}
                    onUpdated={handleGroupUpdated}
                />

                <DogSelectionModal
                    visible={dogSelectionVisible}
                    onClose={() => setDogSelectionVisible(false)}
                    onConfirm={handleDogSelectionConfirm}
                    isLoading={saving}
                />
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}