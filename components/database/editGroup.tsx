import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { getGroupById, updateGroup } from "@/src/services/groupService";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

type Props = {
  groupId: string;
  onUpdated?: () => void;
  visible: boolean;
  onClose: () => void;
};

export default function EditGroup({ groupId, onUpdated, visible, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!groupId || !visible) return;
      setLoading(true);
      try {
        const g = await getGroupById(groupId);
        if (!mounted) return;
        if (g) {
          setImageUrl(g.imageUrl ?? "");
          setName(g.groupName ?? "");
          setDescription(g.groupDescription ?? "");
          setSelectedImage(null);
          setError(null);
        }
      } catch (e) {
        console.error("Failed to load group", e);
        setError("Ryhmän lataaminen epäonnistui");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [groupId, visible]);

  async function handleSave() {
    if (!groupId) return;
    setError(null);
    setSaving(true);
    try {
      await updateGroup(groupId, { 
        imageUrl: selectedImage ?? imageUrl, 
        groupName: name, 
        groupDescription: description 
      });
      onUpdated?.();
      onClose();
      setName("");
      setDescription("");
      setImageUrl("");
      setSelectedImage(null);
    } catch (err: any) {
      console.error("Failed to save group", err);
      setError(err?.message ?? "Ryhmän päivittäminen epäonnistui");
    } finally {
      setSaving(false);
    }
  }

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
      <Modal visible={visible} transparent animationType="slide">
        <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />
      <View className="flex-1 justify-start pt-6">
        <Card className="m-3 p-4 rounded-lg" variant="elevated" size="lg">
          <Heading size="sm" className="mb-3">Muokkaa ryhmää</Heading>

          <View className="space-y-3">
            <View className="p-2 flex-row gap-2 items-center">
              {selectedImage ? (
                <Image source={{ uri: selectedImage }} className="h-20 w-20 rounded-lg" />
              ) : imageUrl ? (
                <Image source={{ uri: imageUrl }} className="h-20 w-20 rounded-lg" />
              ) : (
                <View className="h-20 w-20 rounded-lg bg-background-50 items-center justify-center">
                  <Text className="text-sm text-typography-500">Ei kuvaa</Text>
                </View>
              )}

              <TouchableOpacity onPress={pickImage} className="bg-yellow-600 px-4 py-2 rounded-lg">
                <Text> Valitse kuva </Text>
              </TouchableOpacity>
              {selectedImage ? (
                <TouchableOpacity onPress={() => setSelectedImage(null)} className="bg-red-500 px-4 py-2 rounded-lg">
                  <Text> Poista </Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <Input>
              <InputField placeholder="Ryhmän nimi" value={name} onChangeText={setName} />
            </Input>

            <Input>
              <InputField placeholder="Kuvaus (valinnainen)" value={description} onChangeText={setDescription} />
            </Input>

            {error ? <Text className="pb-1 text-sm text-error-200">{error}</Text> : null}

            <Button onPress={handleSave} disabled={saving} action="primary">
              {saving ? <ActivityIndicator /> : <ButtonText>Tallenna</ButtonText>}
            </Button>
          </View>
        </Card>
      </View>
    </Modal>
  );
}
