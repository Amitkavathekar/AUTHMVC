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


// Email login
export const loginUser = async (email: string, password: string) => {
  const response = await signInWithEmailAndPassword(auth, email, password)
  return response
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
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier
  }
}

export const sendOTP = async (phone: string) => {
  try {
    //  REMOVE OLD recaptcha DOM manually
    const recaptchaContainer = document.getElementById("recaptcha")
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = ""
    }

    //  CREATE NEW verifier
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha",
      {
        size: "invisible",
      }
    )

    const confirmation = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    )

    return confirmation
  } catch (error) {
    console.error("OTP ERROR:", error)
    throw error
  }
}