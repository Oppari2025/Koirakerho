import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';
import { auth, storage } from './FirebaseConfig';

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

export async function uploadImage(uri: string, folder = 'groups'): Promise<string> {
  const uid = auth.currentUser?.uid ?? 'anon';
  const blob = await (await fetch(uri)).blob();
  const path = `${folder}/${uid}/${Date.now()}.jpg`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, blob);
  return getDownloadURL(ref);
}
