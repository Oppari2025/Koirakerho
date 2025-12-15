// src/services/auth/authService.ts
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth"
import { auth } from "../firebase/FirebaseConfig"

export const registerAuthUser = async (
  email: string,
  password: string
): Promise<User> => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )
  return credential.user
}

export const loginAuthUser = async (
  email: string,
  password: string
): Promise<User> => {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  )
  return credential.user
}

export const logoutAuthUser = async (): Promise<void> => {
  await signOut(auth)
}
