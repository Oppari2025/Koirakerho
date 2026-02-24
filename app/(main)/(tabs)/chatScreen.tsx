import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Colors } from '@/constants/theme';
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

const ChatColors = {
  background: '#E6D3B3', // slightly darker than Colors.light.background
  card: '#C2B280', // slightly darker than Colors.light.card
  border: '#A89F91', // same as Colors.light.border
  accent: Colors.light.accent,
  text: Colors.light.text,
  white: Colors.light.white,
};

export default function chatScreen() {
  const [contacts, setContacts] = useState<
    {
      uid: string;
      firstName: string;
      lastName: string;
      email: string;
      imageUrl?: string;
      unreadCount: number;
    }[]
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
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background, padding: 16, paddingTop: 24, position: 'relative' }}>
      <Heading size="lg" style={{ marginBottom: 24, color: Colors.light.text }}>
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
            <VStack style={{ padding: 16, borderWidth: 1, borderColor: Colors.light.border, borderRadius: 12, backgroundColor: Colors.light.card }}>
              <HStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <HStack style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Avatar className="bg-indigo-600">
                    <AvatarImage source={{ uri: user?.imageUrl }} />
                  </Avatar>
                  <VStack>
                    <Heading size="sm" style={{ color: Colors.light.text }}>{user.firstName + " " + user.lastName}</Heading>
                    <Text size="sm" style={{ color: Colors.light.text }}>{user.email}</Text>
                  </VStack>
                </HStack>
                {user.unreadCount > 0 && (
                  <View style={{ backgroundColor: Colors.light.accent, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: Colors.light.white, fontSize: 12, fontWeight: 'bold' }}>{user.unreadCount}</Text>
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
          <Avatar style={{ backgroundColor: ChatColors.accent }}>
            <AvatarFallbackText style={{ color: ChatColors.white }}>+</AvatarFallbackText>
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: ChatColors.card, padding: 16, borderRadius: 12, width: 320 }}>
            <Text style={{ marginBottom: 8, fontSize: 18, fontWeight: 'bold', color: ChatColors.text }}>Lisää kontakti</Text>
            <TextInput
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Sähköposti"
              style={{ borderWidth: 1, borderColor: ChatColors.border, padding: 8, borderRadius: 8, marginBottom: 16, color: ChatColors.text }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: ChatColors.accent, fontWeight: 'bold' }}>Peruuta</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addContactByEmail}>
                <Text style={{ color: ChatColors.accent, fontWeight: 'bold' }}>Lisää</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
