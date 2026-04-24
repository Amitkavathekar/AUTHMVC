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
declare global {  
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

export const sendOTP = async (phone: string) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha",
      {
        size: "invisible",
      },
      auth
    );

    await window.recaptchaVerifier.render(); // ⚠️ IMPORTANT
  }

  const confirmation = await signInWithPhoneNumber(
    auth,
    phone,
    window.recaptchaVerifier
  );

  return confirmation;
};