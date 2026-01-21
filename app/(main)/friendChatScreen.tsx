import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { ArrowRightIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { db } from '@/src/firebase/FirebaseConfig';
import { useLocalSearchParams } from 'expo-router';
import { getAuth } from 'firebase/auth';
import {
    addDoc,
    collection, doc, getDoc,
    onSnapshot,
    orderBy,
    query, serverTimestamp, setDoc,
    updateDoc
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
    id: string;
    text: string;
    senderUid: string;
    createdAt: any;
};

export default function friendChatScreen() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const { otherUid } = useLocalSearchParams();
    const [otherUser, setOtherUser] = useState<any>(null);
    const flatListRef = useRef<FlatList<any> | null>(null);

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.senderUid === currentUser.uid;

        return (
            <View
                className="mb-2 px-4 py-2 rounded-full"
                style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    backgroundColor: isUser ? '#3B82F6' : '#118e34ff',
                }}
            >
                <View className='flex-row px-2'>
                    <Text style={{ color: 'white', fontSize: 14, marginRight: 10 }}>{item.text}</Text>
                    <Text style={{ color: 'black', fontSize: 10, marginTop: 4 }}>
                        {item.createdAt?.toDate().toLocaleTimeString()}

                    </Text>
                </View>
            </View>
        );
    };

    const sendMessage = async () => {
    if (!inputValue.trim() || !currentUser || !chatId) return;

    // Lähetä viesti
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: inputValue,
        senderUid: currentUser.uid,
        createdAt: serverTimestamp(),
    });

    // Päivittää chatin viimeisin viesti aika
    await updateDoc(doc(db, 'chats', chatId), {
        lastMessageAt: serverTimestamp(),
    });
    setInputValue('');
    };

    const currentUser: any = getAuth().currentUser;

    // Määritellään chatId
    const chatId =
        currentUser && otherUid
            ? currentUser.uid < otherUid
                ? `${currentUser.uid}_${otherUid}`
                : `${otherUid}_${currentUser.uid}`
            : null;

    // Ladataan toinen käyttäjä
    useEffect(() => {
        if (!otherUid) return;
        const loadOtherUser = async () => {
            const snap = await getDoc(doc(db, 'users', otherUid as string));
            if (snap.exists()) {
                setOtherUser(snap.data());
            }
        };
        loadOtherUser();
    }, [otherUid]);

    // Varmistetaan että chat on olemassa
    useEffect(() => {
        if (!chatId || !currentUser) return;
        const ensureChatExists = async () => {
            try {
                const chatRef = doc(db, 'chats', chatId);
                const snap = await getDoc(chatRef);

                if (snap.exists()) {
                    return;
                }
                await setDoc(chatRef, {
                    members: [currentUser.uid, otherUid],
                    createdAt: serverTimestamp(),
                });
            } catch (err) {
                console.error('Error ensuring chat:', err);
            }
        };
        ensureChatExists();
    }, [chatId]);

    // Ladataan viestit 
    useEffect(() => {
        if (!chatId) return;

        const q = query(
            collection(db, 'chats', chatId, 'messages'),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, snapshot => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as Message[];

            setMessages(msgs);
        });

        return unsubscribe;
    }, [chatId]);

    useEffect(() => {
    if (!chatId || !currentUser) return;

    const markAsRead = async () => {
        await updateDoc(doc(db, 'chats', chatId), {
        [`lastRead.${currentUser.uid}`]: serverTimestamp(),
        });
    };

    markAsRead();
    }, [chatId, messages.length]);


    return (
        <SafeAreaView className="flex-1">
            <View className="flex-row items-center gap-4 p-4">
                <Avatar className="bg-indigo-600">
                    <AvatarFallbackText className="text-white">
                        {otherUser?.name || '?'}
                    </AvatarFallbackText>
                    <AvatarImage
                        source={{
                            uri: otherUser?.profilePictureUrl || '../assets/images/dog1.jpg',
                        }}
                    />
                </Avatar>
                <VStack>
                    <Heading size="sm">{otherUser?.firstName + " " + otherUser?.lastName}</Heading>
                </VStack>
                <Text className="text-lg font-bold">
                    {(otherUser?.firstName && otherUser?.lastName) ? otherUser.firstName + " " + otherUser.lastName : 'Ladataan...'}
                </Text>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />
            <View className="flex-row items-center p-4 gap-2">
                <Input variant="rounded" size="md" className="flex-1">
                    <InputField
                        placeholder="Type a message..."
                        value={inputValue}
                        onChangeText={setInputValue}
                    />
                </Input>
                <Button
                    size="lg"
                    className="rounded-full px-3"
                    onPress={sendMessage}
                >
                    <ButtonIcon as={ArrowRightIcon} />
                </Button>
            </View>
        </SafeAreaView >
    );
}
