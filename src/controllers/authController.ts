import {
  loginUser,
  registerUser,
  loginWithGoogle,
  resetPassword,
  logoutUser,
} from "../services/authService"

export const handleRegister = async (email: string, password: string) => {
  try {
    await registerUser(email, password)
    alert("Registered successfully")
  } catch (err: any) {
    alert(err.message)
  }
}

export const handleLogin = async (email: string, password: string) => {
  try {
    await loginUser(email, password)
    alert("Login successful")
  } catch (err: any) {
    alert(err.message)
  }
}

export const handleGoogleLogin = async () => {
  try {
    await loginWithGoogle()
    alert("Google login success")
  } catch (err: any) {
    alert(err.message)
  }
}

export const handleReset = async (email: string) => {
  try {
    await resetPassword(email)
    alert("Reset email sent")
  } catch (err: any) {
    alert(err.message)
  }
}

export const handleLogout = async () => {
  await logoutUser()
}