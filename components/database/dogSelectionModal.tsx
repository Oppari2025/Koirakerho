import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getMyDogs } from "@/src/services/dogService";
import { Dog } from "@/src/types/dog";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface DogSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (selectedDogIds: string[]) => void;
  isLoading?: boolean;
}

export default function DogSelectionModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: DogSelectionModalProps) {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [selectedDogs, setSelectedDogs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadDogs();
    }
  }, [visible]);

  const loadDogs = async () => {
    try {
      setLoading(true);
      const myDogs = await getMyDogs();
      setDogs(myDogs);
      setSelectedDogs(new Set());
    } catch (error) {
      console.error("Failed to load dogs:", error);
      Alert.alert("Virhe", "Koirien lataaminen epäonnistui");
    } finally {
      setLoading(false);
    }
  };

  const toggleDogSelection = (dogId: string) => {
    const newSelected = new Set(selectedDogs);
    if (newSelected.has(dogId)) {
      newSelected.delete(dogId);
    } else {
      newSelected.add(dogId);
    }
    setSelectedDogs(newSelected);
  };

  const handleConfirm = () => {
    if (selectedDogs.size === 0) {
      Alert.alert("Valitse koira", "Sinun täytyy valita vähintään yksi koira");
      return;
    }
    onConfirm(Array.from(selectedDogs));
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="absolute inset-0 bg-black/40" onPress={onClose} />
      <View className="flex-1 justify-start pt-6">
        <Card className="m-3 p-4 rounded-lg" variant="elevated" size="lg">
          <Heading size="sm" className="mb-3">Valitse koirat ryhmään</Heading>

          <View className="space-y-3">
            {loading || isLoading ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" />
              </View>
            ) : dogs.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-typography-600">Sinulla ei ole koiria</Text>
                <Text className="text-sm text-typography-500 mt-2">
                  Lisää koira ennen ryhmään liittymistä
                </Text>
              </View>
            ) : (
              <FlatList
                data={dogs}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`flex-row items-center p-3 mb-2 rounded-lg border-2 ${
                      selectedDogs.has(item.id)
                        ? "border-green-600 bg-black/40"
                        : "border-background-200 bg-background-50"
                    }`}
                    onPress={() => toggleDogSelection(item.id)}
                  >
                    <Image
                      source={
                        item.imageUrl
                          ? { uri: item.imageUrl }
                          : require("@/assets/images/dog1.jpg")
                      }
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <View className="flex-1">
                      <Text className="font-semibold text-base text-typography-900">{item.name}</Text>
                      <Text className="text-sm text-typography-500">
                        {item.breed} - {item.age} vuotta
                      </Text>
                    </View>
                    <View
                      className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                        selectedDogs.has(item.id)
                          ? "bg-green-600 border-green-600"
                          : "border-background-300"
                      }`}
                    >
                      {selectedDogs.has(item.id) && (
                        <Text className="text-white font-bold">✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}

            <View className="flex-row gap-2 pt-2">
              <Button onPress={onClose} disabled={isLoading} size="md" action="secondary" className="flex-1">
                <ButtonText>Peruuta</ButtonText>
              </Button>
              <Button onPress={handleConfirm} disabled={isLoading || selectedDogs.size === 0} size="md" action="primary" className="flex-1">
                <ButtonText>Liity ({selectedDogs.size})</ButtonText>
              </Button>
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );
}
