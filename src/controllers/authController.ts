import {
  loginUser,
  loginWithGoogle,
  resetPassword,
  logoutUser,
} from "../services/authService"

import { updateProfile } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"

import { auth } from "../config/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"

// 🔥 NEW ADD (Firestore)
import { db } from "../config/firebase"

// ✅ REGISTER (UPDATED)
export const handleRegister = async (
  email: string,
  password: string,
  fullName: string,
  phone: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  const user = userCredential.user

  await updateProfile(user, {
    displayName: fullName,
  })

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    fullName,
    email,
    phone,
    createdAt: new Date(),
  })

  return user
}

// LOGIN
export const handleLogin = async (email: string, password: string) => {
  try {
    await loginUser(email, password)
    alert("Login successful")
  } catch (err: any) {
    alert(err.message)
  }
}

// GOOGLE LOGIN
export const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle()
    alert("Google login success")
  } catch (err: any) {
    alert(err.message)
  }
}

// RESET
export const handleReset = async (email: string) => {
  try {
    await resetPassword(email)
    alert("Reset email sent")
  } catch (err: any) {
    alert(err.message)
  }
}

// LOGOUT
export const handleLogout = async () => {
  await logoutUser()
}
