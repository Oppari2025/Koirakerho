import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth"
import React, { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../firebase/FirebaseConfig"
import { loginAuthUser, logoutAuthUser, registerAuthUser } from "../services/authService"
import { createUserProfile, getUserProfile } from "../services/userProfileService"
import { FirestoreUser } from "../types/user"

// tässä tiedostossa hallitaan käyttäjän todennusta ja profiilitietoja
// jakaa myös käyttäjän profiilitiedot sovelluksen muille osille

interface AuthContextType {
  firebaseUser: FirebaseUser | null
  userProfile: FirestoreUser | null
  loading: boolean

  register: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<FirestoreUser | null>(null)
  const [loading, setLoading] = useState(true)

  // kuunnellaan Firebase Authin muutoksia (elikkä kirjautuminen / uloskirjautuminen)
  // päivitetaan firebaseUser ja ladataan käyttäjäprofiili Firestoresta tarvittaessa

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setFirebaseUser(user)

      if (user) {
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  // rekisteröidään uusi käyttäjä (Firebase Auth) ja luo käyttäjäprofiili (Firestore)
  // asetetaan lataus päälle rekisteröinnin ajaksi

  const register = async (
    email: string,
    password: string,
    name: string
  ) => {
    setLoading(true)

    try {
      const user = await registerAuthUser(email, password)
      console.log('createUserProfile: creating profile for uid', user.uid)
      await createUserProfile(user.uid, { email, name })
    } catch (err) {
      console.error('createUserProfile failed', err)
      throw err
    } finally {
      setLoading(false)
}
  }

  // kirjataan käyttäjä sisään Firebase Authilla ja haetaan profiilitiedot Firestoresta
  // palautetaan errorit eteenpäin jos kirjautuminen epäonnistuu

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log('AuthContext.login: calling loginAuthUser', email)
      const user = await loginAuthUser(email, password)
      console.log('AuthContext.login: loginAuthUser succeeded', user?.uid)

      setFirebaseUser(user as FirebaseUser)
      const profile = await getUserProfile(user.uid)
      setUserProfile(profile)
    } catch (err) {
      console.error('AuthContext.login failed', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // kirjataan käyttäjä ulos ja tyhjennetää paikallinen käyttäjätila ja profiili

  const logout = async () => {
    setLoading(true)
    try {
      await logoutAuthUser()
      setFirebaseUser(null)
      setUserProfile(null)
    } finally {
      setLoading(false)
    }
  }
  // jaetaan AuthContextin arvot lapsikomponenteille
  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userProfile,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// palautetaan AuthContext-arvot. Heittää erroria jos hookkia käytetään AuthProviderin ulkopuolella

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
