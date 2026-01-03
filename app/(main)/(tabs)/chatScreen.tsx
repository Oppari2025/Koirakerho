import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Modal, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../src/firebase/FirebaseConfig';
import { getUserByEmail } from '../../../src/services/getUserByEmail';

import {
  Avatar,
  AvatarFallbackText,
} from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function chatScreen() {
  const [contacts, setContacts] = useState<Array<{ uid: string; name: string; email: string }>>([]);
  const currentUser = getAuth().currentUser;
  const [modalVisible, setModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const loadContacts = async () => {
    if (!currentUser) return;

    const snap = await getDoc(doc(db, 'users', currentUser.uid));
    if (!snap.exists()) return;

    const data = snap.data();
    const emails = data.contacts || [];

    if (emails.length === 0) {
      setContacts([]);
      return;
    }

    const users = await Promise.all(
      emails.map((email: string) => getUserByEmail(email))
    );

    setContacts(users.filter(Boolean));
  };

  useEffect(() => {
    loadContacts().catch(() => {});
  }, []);

  const addContactByEmail = async () => {
    if (!currentUser) return;

    const email = newEmail.trim().toLowerCase();
    if (!email || email === currentUser.email) return;

    const foundUser = await getUserByEmail(email);
    if (!foundUser) return;

    await updateDoc(doc(db, 'users', currentUser.uid), {
      contacts: arrayUnion(email),
    });

    setModalVisible(false);
    setNewEmail('');
    loadContacts().catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 p-4 py-6 relative">
      <Heading size="lg" className="mb-6">
        Koirakerho
      </Heading>

      <ScrollView contentContainerStyle={{ gap: 24 }}>
        {contacts.map(user => (
          <TouchableOpacity
            key={user.uid}
            onPress={() =>
              router.push({
                pathname: '/friendChatScreen',
                params: { otherUid: user.uid },
              })
            }
          >
            <VStack className="p-4 border border-gray-200 rounded-lg">
              <HStack space="md">
                <Avatar className="bg-indigo-600">
                  <AvatarFallbackText className="text-white">
                    {user.name}
                  </AvatarFallbackText>
                </Avatar>
                <VStack>
                  <Heading size="sm">{user.name}</Heading>
                  <Text size="sm">{user.email}</Text>
                </VStack>
              </HStack>
            </VStack>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* + Nappi */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          zIndex: 10,
        }}
      >
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Avatar className="bg-green-600">
            <AvatarFallbackText className="text-white">+</AvatarFallbackText>
          </Avatar>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-4 rounded-lg w-80">
            <Text className="mb-2 text-lg font-bold">Lisää kontakti</Text>
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Sähköposti"
              className="border border-gray-300 p-2 rounded mb-4"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View className="flex-row justify-end space-x-2">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text className="text-red-500 font-bold">Peruuta</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addContactByEmail}>
                <Text className="text-green-500 font-bold">Lisää</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
