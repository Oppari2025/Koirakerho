import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getGroupById, updateGroup } from "@/src/services/groupService";
import { useAuth } from "@/src/context/AuthContext";
import * as ImagePicker from "expo-image-picker";

export default function EditGroupScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { firebaseUser } = useAuth();
    const [imageUrl, setImageUrl] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function load() {
        if (!id) return;
        setLoading(true);
        try {
            const g = await getGroupById(id);
            if (!mounted) return;
            if (g) {
            setImageUrl(g.imageUrl ?? "");
            setName(g.groupName ?? "");
            setDescription(g.groupDescription ?? "");
            }
        } catch (e) {
            console.error(e);
        } finally {
            if (mounted) setLoading(false);
        }
        }
        load();
        return () => {
        mounted = false;
        };
    }, [id]);

    const handleSave = async () => {
        if (!id) return;
        setSaving(true);
        try {
            await updateGroup(id, { imageUrl: imageUrl, groupName: name, groupDescription: description });
            router.replace(`/(main)/groupScreen?id=${id}`);
            setSelectedImage(imageUrl);
        } catch (e) {
            console.error("Failed to save group", e);
        } finally {
            setSaving(false);
        }
    };

    async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      } else {
        setError("Vaaditaan kuvien käyttöoikeus");
      }
    } catch (e: any) {
      console.error("Image pick failed", e);
      setError("Kuvan valinta epäonnistui: " + (e?.message ?? e));
    }
  }

if (loading) {
    return (
    <SafeAreaProvider>
        <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
        </SafeAreaView>
    </SafeAreaProvider>
    );
}

return (
    <SafeAreaProvider>
    <SafeAreaView className="flex-1 bg-white">
        <View style={{ padding: 16 }}>
            <Text className="font-semibold ">Kuva</Text>
            <View className="p-1 gap-1 flex-row items-center space-x-3">
                {selectedImage ? (
                    <Image source={{ uri: selectedImage }} className="h-20 w-20 rounded-lg" />
                ) : (
                    <View className="h-20 w-20 rounded-lg bg-background-50 items-center justify-center">
                    <Text className="text-sm text-typography-500">Ei kuvaa</Text>
                    </View>
                )}

                <TouchableOpacity onPress={pickImage} className="bg-yellow-600 px-4 py-2 rounded-lg"><Text>Valitse kuva</Text></TouchableOpacity>
                {selectedImage ? (
                    <TouchableOpacity onPress={() => setSelectedImage(null)} className="bg-red-500 px-4 py-2 rounded-lg"><Text> Poista </Text></TouchableOpacity>
                ) : null}
            </View>

            <Text className="font-semibold mb-2">Ryhmän nimi</Text>
            <TextInput value={name} onChangeText={setName} className="border p-2 mb-4" />

            <Text className="font-semibold mb-2">Kuvaus</Text>
            <TextInput value={description} onChangeText={setDescription} multiline className="border p-2 mb-4 h-28" />

            <TouchableOpacity
                className="bg-blue-600 px-4 py-3 rounded-lg items-center"
                onPress={handleSave}
                disabled={saving}
            >
                <Text className="text-white">Tallenna</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    </SafeAreaProvider>
);
}
