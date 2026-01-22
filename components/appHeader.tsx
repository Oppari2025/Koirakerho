import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type AppHeaderProps = {
  title: string;
  showBack?: boolean;
  onBackPress?: () => void;
};

export default function AppHeader({
  title,
  showBack = true,
  onBackPress,
}: AppHeaderProps) {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.replace('/profileScreen');
    }
  };

  return (
    <View className="flex-row gap-4 items-center px-8 py-6 bg-white border-b border-gray-200">
      {showBack && (
        <TouchableOpacity onPress={handleBack} className="mr-6 px-4 ">
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}

      <Text className=" text-lg font-semibold">
        {title}
      </Text>
    </View>
  );
}
