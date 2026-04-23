import {
  auth,
  googleProvider,
} from "../config/firebase"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"

// Email register
export const registerUser = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

// Email login
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password)
}

// Google login
export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
}

// Reset password
export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email)
}

// Logout
export const logoutUser = () => {
  return signOut(auth)
}

// OTP Login (Phone)
export const sendOTP = (phone: string) => {
  const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {
    size: "invisible",
  })

  return signInWithPhoneNumber(auth, phone, recaptcha)
}