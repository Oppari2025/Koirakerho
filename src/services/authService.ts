import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth"
import { auth } from "../firebase/FirebaseConfig"

// palvelut käyttäjän rekisteröintiin, kirjautumiseen ja uloskirjautumiseen

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
