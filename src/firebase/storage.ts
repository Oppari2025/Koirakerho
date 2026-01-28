import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { storage } from './FirebaseConfig';

export async function pickImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

export async function uploadGroupImage(uri: string, folder = 'groups'): Promise<string> {
  const blob = await (await fetch(uri)).blob();
  const path = `${folder}/${Date.now()}.jpg`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, blob);
  return getDownloadURL(ref);
}

export async function uploadDogImage(uri: string, folder = 'dogs'): Promise<string> {
  const blob = await (await fetch(uri)).blob();
  const path = `${folder}/${Date.now()}.jpg`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, blob);
  return getDownloadURL(ref);
}
export async function uploadProfileImage(uri: string, folder = 'users', userId: string): Promise<string> {
  const blob = await (await fetch(uri)).blob();
  const path = `${folder}/${userId}/${Date.now()}.jpg`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, blob);
  return getDownloadURL(ref);
}
