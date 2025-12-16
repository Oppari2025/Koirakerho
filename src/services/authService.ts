import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth"
import { auth } from "../firebase/FirebaseConfig"

// käyttäjän rekisteröintiin, kirjautumiseen ja uloskirjautumiseen liittyvät funktiot

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

// kirjautuu sisään käyttäjän sähköpostilla ja salasanalla

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

// kirjautuu ulos nykyiseltä käyttäjältä

export const logoutAuthUser = async (): Promise<void> => {
  await signOut(auth)
}
