import { Button, ButtonIcon } from '@/components/ui/button';
import { ArrowRightIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'other';
    time: string;
};

export default function friendChatScreen() {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const flatListRef = useRef<FlatList<any> | null>(null);

    const createMessage = (text: string, sender: 'user' | 'other') => ({
        id: `${Date.now()}-${Math.random()}`,
        text,
        sender,
        time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        }),
    });

    const sendMyMessage = () => {
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, createMessage(inputValue, 'user')]);
        setInputValue('');
    };

    const sendFriendMessage = () => {
        if (!inputValue.trim()) return;

        setMessages(prev => [...prev, createMessage(inputValue, 'other')]);
        setInputValue('');
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';

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
                        {item.time}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView className="flex-1">
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

                {/* User */}
                <Button
                    size="lg"
                    className="rounded-full px-3"
                    onPress={sendMyMessage}
                >
                    <ButtonIcon as={ArrowRightIcon} />
                </Button>

                {/* Friend */}
                <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-3"
                    onPress={sendFriendMessage}
                >
                    <ButtonIcon as={ArrowRightIcon} />
                </Button>
            </View>
        </SafeAreaView>
    );
}
