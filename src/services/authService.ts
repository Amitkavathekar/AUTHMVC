import { auth, googleProvider } from "../config/firebase"

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

// // Email login
// export const loginUser = (email: string, password: string) => {
//   return signInWithEmailAndPassword(auth, email, password)
// }

// Email login
export const loginUser = async (email: string, password: string) => {
  const response = await signInWithEmailAndPassword(auth, email, password)
  console.log(response)
}

// Then after this store the token in the localStorage and use it to achieve private and public route functionality

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
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier
  }
}

export const sendOTP = async (phone: string) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
  auth,
  "recaptcha",
  {
    size: "invisible",
  }
)

    await window.recaptchaVerifier.render() // ⚠️ IMPORTANT
  }

  const confirmation = await signInWithPhoneNumber(
    auth,
    phone,
    window.recaptchaVerifier
  )

  return confirmation
}
