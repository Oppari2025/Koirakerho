import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type AppHeaderAvatarProps = {
  title: string;
  avatarUrl?: string | null;
  fallbackText?: string;
  showBack?: boolean;
  fallbackRoute?: string;
  onBackPress?: () => void;
};

export default function AppHeaderAvatar({
  title,
  avatarUrl,
  fallbackText,
  showBack = true,
  fallbackRoute = '/profileScreen',
  onBackPress,
}: AppHeaderAvatarProps) {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
      return;
    }

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallbackRoute);
    }
  };

return (
  <View style={{ backgroundColor: 'white', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {showBack && (
        <TouchableOpacity onPress={handleBack} style={{ marginRight: 16 }}>
          <MaterialIcons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>
      )}

      {/* Avatar + text block */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginRight: 12 }}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <Text className="text-white font-bold text-xl">
              {fallbackText?.[0]?.toUpperCase() ?? '?'}
            </Text>
          )}
        </View>

        <Text className="text-xl font-semibold">{title}</Text>
      </View>
    </View>
  </View>
);
}