import {
  loginUser,
  loginWithGoogle,
  resetPassword,
  logoutUser,
} from "../services/authService"

// Only import what is not re-exported from firebase/config
import { updateProfile, createUserWithEmailAndPassword } from "firebase/auth"
import { setDoc, doc } from "firebase/firestore"

import * as firebaseConfig from "../config/firebase"
import { toast } from "sonner"

// Use destructuring to avoid duplicate import/identifier issues
const { auth, db, RecaptchaVerifier, signInWithPhoneNumber } = firebaseConfig

//Inputs come from UI form
export const handleRegister = async (
  email: string,
  password: string,
  fullName: string,
  phone: string
) => {
  //Create User in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  //Firebase only stores extra data
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

// Helper: show toast for async operation result
const showToastOnOperation = async (
  operation: () => Promise<unknown>,
  successMsg: string,
  warningOverride?: string
) => {
  try {
    await operation()
    toast.success(successMsg, { position: "top-right" })
  } catch (err: unknown) {
    const message =
      warningOverride || (err instanceof Error ? err.message : "Error occurred")
    toast.warning(message, { position: "top-right" })
  }
}

// GOOGLE LOGIN
export const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle()
    toast.success("Google login success", { position: "top-right" })
  } catch (err: unknown) {
    toast.warning(err instanceof Error ? err.message : "Google login failed", {
      position: "top-right",
    })
  }
}

// RESET
export const handleReset = async (email: string) => {
  try {
    await resetPassword(email)
    toast.success("Reset link sent to your email", { position: "top-right" })
  } catch (err: unknown) {
    toast.warning(err instanceof Error ? err.message : "Reset failed", {
      position: "top-right",
    })
  }
}

// LOGOUT
export const handleLogout = async () => {
  await logoutUser()
}

//mobile otp login

// Setup Recaptcha
export const setupRecaptcha = () => {
  if (window.recaptchaVerifier) {
    return
  }

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "normal",
    }
  )
}

// Send OTP
export const sendOtp = async (phoneNumber: string) => {
  try {
    setupRecaptcha()

    const appVerifier = window.recaptchaVerifier

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      appVerifier
    )

    window.confirmationResult = confirmationResult

    // Captcha gayab karava (remove recaptcha from DOM after OTP sent)
    const recaptchaElem = document.getElementById("recaptcha-container")
    if (recaptchaElem) {
      recaptchaElem.innerHTML = ""
    }
    // Optionally, remove verifier as well to clear memory/reference
    window.recaptchaVerifier = undefined

    return {
      success: true,
    }
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.log(error)

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to send OTP",
    }
  }
}

// Verify OTP
export const verifyOtp = async (otp: string) => {
  try {
    const result = await window.confirmationResult.confirm(otp)

    const token = await result.user.getIdToken()

    return {
      success: true,
      token,
      user: result.user,
    }
  } catch (error) {
    return {
      success: false,
    }
  }
}
