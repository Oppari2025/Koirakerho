import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth"
import React, { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../firebase/FirebaseConfig"
import { loginAuthUser, logoutAuthUser, registerAuthUser } from "../services/authService"
import { createUserProfile, getUserProfile } from "../services/userProfileService"
import { FirestoreUser } from "../types/user"

// tässä tiedostossa hallitaan käyttäjän todennusta ja profiilitietoja

/* type */

interface AuthContextType {
  firebaseUser: FirebaseUser | null
  userProfile: FirestoreUser | null
  loading: boolean

  register: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

/* context */

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/* provider */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<FirestoreUser | null>(null)
  const [loading, setLoading] = useState(true)

  /* Firebase listener */
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

  /* actions */

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

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log('AuthContext.login: calling loginAuthUser', email)
      const user = await loginAuthUser(email, password)
      console.log('AuthContext.login: loginAuthUser succeeded', user?.uid)

      // set firebase user and load profile immediately to avoid routing race
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

  /* provider value */

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

/* hook */

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
