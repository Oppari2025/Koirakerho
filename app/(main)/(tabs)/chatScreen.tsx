import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getUserByUid } from '@/src/services/getUserService';
import { router } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Modal, RefreshControl, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../../src/firebase/FirebaseConfig';
import { getUserByEmail } from '../../../src/services/getUserByEmail';

export default function chatScreen() {
  const [contacts, setContacts] = useState<
    Array<{
      uid: string;
      firstName: string;
      lastName: string;
      email: string;
      imageUrl?: string;
      unreadCount: number;
    }>
  >([]);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = getAuth().currentUser;
  const [modalVisible, setModalVisible] = useState(false);
  const [newEmail, setNewEmail] = useState('');

  const getChatId = (uid1: string, uid2: string) =>
    uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;

  const loadContacts = async () => {
    if (!currentUser) return;

    const snap = await getDoc(doc(db, 'users', currentUser.uid));
    if (!snap.exists()) return;

    const emails = snap.data().contacts || [];
    if (emails.length === 0) {
      setContacts([]);
      return;
    }

    const users = await Promise.all(
      emails.map(async (email: string) => {
        const user = await getUserByEmail(email);
        if (!user) return null;
        const fullProfile = await getUserByUid(user.uid);
        return fullProfile;
      })
    );


    const gotNewMessage = await Promise.all(
      users.filter(Boolean).map(async (user: any) => {
        const chatId = getChatId(currentUser.uid, user.uid);
        const chatRef = doc(db, 'chats', chatId);
        const chatSnap = await getDoc(chatRef);

        let unreadCount = 0;
        let lastMessageAt: any = null;

        if (chatSnap.exists()) {
          const chatData = chatSnap.data();
          lastMessageAt = chatData?.lastMessageAt || null;

          const lastRead = chatData?.lastRead?.[currentUser.uid];

          const msgsRef = collection(db, 'chats', chatId, 'messages');
          const allMsgsSnap = await getDocs(msgsRef);

          const unreadMsgs = allMsgsSnap.docs.filter(msg => {
            const data = msg.data();
            return (
              data.senderUid !== currentUser.uid &&
              (!lastRead || data.createdAt.toMillis() > lastRead.toMillis())
            );
          });

          unreadCount = unreadMsgs.length;
        }

        return {
          ...user,
          unreadCount,
          lastMessageAt,
        };
      })
    );

    // Järjestetää kontaktit viimeisimmän viestin mukaan
    gotNewMessage.sort((a, b) => {
      const aTime = a.lastMessageAt ? a.lastMessageAt.toMillis() : 0;
      const bTime = b.lastMessageAt ? b.lastMessageAt.toMillis() : 0;
      return bTime - aTime;
    });

    setContacts(gotNewMessage);
  };

  // Päivittää sivun
  const onRefresh = async () => {
    setRefreshing(true);
    await loadContacts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadContacts().catch(() => { });
  }, []);

  // Lisää kontaktin sähköpostilla ja päivittää listan
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
    loadContacts().catch(() => { });
  };

  return (
    <SafeAreaView className="flex-1 p-4 py-6 relative">
      <Heading size="lg" className="mb-6">
        Koirakerho
      </Heading>

      <ScrollView contentContainerStyle={{ gap: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        } >
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
              <HStack className="items-center justify-between">
                <HStack space="md">
                  <Avatar className="bg-indigo-600">
                    <AvatarImage source={{ uri: user?.imageUrl }} />
                  </Avatar>
                  <VStack>
                    <Heading size="sm">{user.firstName + " " + user.lastName}</Heading>
                    <Text size="sm">{user.email}</Text>
                  </VStack>
                </HStack>
                {user.unreadCount > 0 && (
                  <View className="bg-green-500 rounded-full px-3.5 py-2 items-center justify-center">
                    <Text className="text-white text-xs font-bold">{user.unreadCount}</Text>
                  </View>
                )}
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
