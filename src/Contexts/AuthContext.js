import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loadingUser, setLoadingUser] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setLoadingUser(false)
    })
    return unsubscribe
  }, [])

  function login(email, password) {
    try {
      setError("")
      auth.signInWithEmailAndPassword(email, password)
    } catch (error) {
      setError(error.message)
    }
  }

  function logout() {
    auth.signOut()
    // .then(history.push("/login"))
  }

  function resetPassword(email) {
    console.log(email)
    auth.sendPasswordResetEmail(email)
  }
  const value = {
    login,
    logout,
    resetPassword,
    currentUser,
    error,
  }
  return !loadingUser ? (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  ) : (
    ""
  )
}
