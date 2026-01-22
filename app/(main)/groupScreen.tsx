import DogSelectionModal from "@/components/database/dogSelectionModal";
import EditGroup from "@/components/database/editGroup";
import { deleteGroupAction, joinGroupWithDogs, leaveGroupWithDogs, loadGroupData, refreshGroupData } from "@/components/database/groupActions";
import ListOfEvents from "@/components/database/listOfEvents";
import { Heading } from "@/components/ui/heading";
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
                        <Text className="text-white font-semibold mb-2">Kouluttajat</Text>
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
                            <Text className="text-sm text-gray-600">Ei kouluttajia</Text>
                        )}
                    </View>

                    <View className="mb-4">
                        <Text className="text-white font-semibold mb-2">Jäsenet ({members.length})</Text>
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
                        <Text className="text-white font-semibold mb-2">Ryhmän koirat ({memberDogs.length})</Text>
                        {memberDogs.length ? (
                            <FlatList
                                data={memberDogs}
                                horizontal
                                keyExtractor={(dog) => dog.id}
                                renderItem={({ item }) => (
                                    <View className="items-center mr-10">
                                        <Image
                                            source={
                                                item.imageUrl && item.imageUrl.trim() !== ""
                                                    ? { uri: item.imageUrl }
                                                    : require("@/assets/images/dog1.jpg")
                                            }
                                            className="h-14 w-14 rounded-full"
                                        />
                                        <Text className="text-gray-700 text-sm mt-1">{item.name}</Text>
                                        <Text className="text-gray-600 text-xs">{item.breed}</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text className="text-sm text-gray-600">Ryhmässä ei ole koiria</Text>
                        )}
                    </View>

                    <View>
                        <ListOfEvents eventIds={group.eventIds} />
                    </View>

                    {firebaseUser?.uid ? (
                        hasJoined(group) ? (
                            <TouchableOpacity
                                className="bg-red-600 px-4 py-3 rounded-lg items-center"
                                onPress={handleLeave}
                                disabled={saving}
                            >
                                <Text className="text-white">Poistu ryhmästä</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                className="bg-blue-600 px-4 py-3 rounded-lg items-center"
                                onPress={handleJoin}
                                disabled={saving}
                            >
                                <Text className="text-white">Liity ryhmään</Text>
                            </TouchableOpacity>
                        )
                    ) : (
                        <Text className="text-sm text-gray-600">Kirjaudu sisään liittyäksesi ryhmään</Text>
                    )}

                {isAdmin ? (
                    <View className="mt-4 gap-1 space-y-3">
                        <Text className="text-white font-semibold">Ryhmän hallinta:</Text>
                        <View className="flex-row gap-1 space-x-2">
                            <TouchableOpacity className="bg-yellow-600 px-4 py-3 rounded-lg items-center flex-1" onPress={() => setEditModalVisible(true)}>
                                <Text className="text-white">Muokkaa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="bg-red-700 px-4 py-3 rounded-lg items-center flex-1" onPress={handleDelete}>
                                <Text className="text-white">Poista Ryhmä</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row gap-1">
                            <TouchableOpacity className="bg-green-600 px-4 py-3 rounded-lg items-center flex-1" onPress={() => router.navigate(`/(main)/addEventScreen?groupId=${id}`)}>
                                <Text className="text-white font-semibold">+ Lisää tapahtuma</Text>
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