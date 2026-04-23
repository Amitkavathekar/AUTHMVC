import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// 🔥 config
const firebaseConfig = {
  apiKey: "AIzaSyB_5AwlmvvC_1Q4GnDpgIcVu6kAko51jEQ",
  authDomain: "authmvc-8c80b.firebaseapp.com",
  projectId: "authmvc-8c80b",
  storageBucket: "authmvc-8c80b.firebasestorage.app",
  messagingSenderId: "199845498046",
  appId: "1:199845498046:web:dc04ae9392d002feeb62ef",
}

// 🔥 initialize
const app = initializeApp(firebaseConfig)

// ✅ VERY IMPORTANT (EXPORT THESE)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()