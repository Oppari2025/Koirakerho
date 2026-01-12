import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { AddIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { uploadGroupImage } from "@/src/firebase/storage";
import { createGroup } from "@/src/services/groupService";
import { Group } from "@/src/types/group";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, Text, View } from "react-native";

type Props = {
  onCreated?: (group: Group) => void;
};

export default function AddGroup({ onCreated }: Props) {
  const [visible, setVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    if (!groupName.trim()) {
      setError("Ryhmän nimi on pakollinen");
      return;
    }

    setLoading(true);
    try {
      let uploadedImageUrl: string | undefined = undefined;
      if (selectedImage) {
        uploadedImageUrl = await uploadGroupImage(selectedImage);
      }

      const payload = {
        groupName: groupName.trim(),
        groupDescription: groupDescription.trim() || undefined,
        imageUrl: uploadedImageUrl,
        groupAdminIds: [],
        memberIds: [],
        eventIds: [],
      } as const;

      const newGroup = await createGroup(payload as any);
      setCreated(newGroup);
      onCreated?.(newGroup);
      setVisible(false);
      setGroupName("");
      setGroupDescription("");
      setSelectedImage(null);
    } catch (err: any) {
      console.error("Failed to create group", err);
      setError(err?.message ?? "Ryhmän luonti epäonnistui");
    } finally {
      setLoading(false);
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

  return (
    <View>
      <Modal visible={visible} transparent animationType="slide">
        <Pressable className="absolute inset-0 bg-black/40" onPress={() => setVisible(false)} />
        <View className="flex-1 justify-start pt-6">
          <Card className="m-3 mt-4 p-4 rounded-lg" variant="elevated" size="lg">
            <Heading size="sm" className="mb-3">Luo uusi ryhmä</Heading>

            <View className="space-y-3">
              <Input>
                <InputField placeholder="Ryhmän nimi" value={groupName} onChangeText={setGroupName} />
              </Input>

              <Input>
                <InputField placeholder="Kuvaus (valinnainen)" value={groupDescription} onChangeText={setGroupDescription} />
              </Input>

              <View className="p-2 flex-row items-center space-x-3">
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} className="h-20 w-20 rounded-lg" />
                ) : (
                  <View className="h-20 w-20 rounded-lg bg-background-50 items-center justify-center">
                    <Text className="text-sm text-typography-500">Ei kuvaa</Text>
                  </View>
                )}

                <Button onPress={pickImage} className="" size="md" action="secondary"><ButtonText>Valitse kuva</ButtonText></Button>
                {selectedImage ? (
                  <Button onPress={() => setSelectedImage(null)} size="md" action="negative"><ButtonText>Poista</ButtonText></Button>
                ) : null}
              </View>
                {error ? <Text className="pb-1 text-sm text-error-200">{error}</Text> : null}

              <Button onPress={handleCreate} disabled={loading} size="md" action="primary">
                {loading ? <ActivityIndicator /> : <ButtonText>Luo ryhmä</ButtonText>}
              </Button>
            </View>
          </Card>
        </View>
      </Modal>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 24, alignItems: 'center' }} pointerEvents="box-none">
        <Button onPress={() => setVisible(true)} size="lg" action="primary" className="h-16 w-16 rounded-full items-center justify-center">
          <AddIcon height={28} width={28} className="text-typography-0" />
        </Button>
      </View>

    </View>
  );
}
