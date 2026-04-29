import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import "react-phone-number-input/style.css"
import PhoneInput from "react-phone-number-input"

import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"

import { handleLogin, handleGoogleLogin } from "../controllers/authController"
import { sendOTP } from "../services/authService"

import { auth } from "../config/firebase"

// 1 day (24 hr) in milliseconds
const LOGIN_EXPIRY_MS = 24 * 60 * 60 * 1000;

function Login() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<"email" | "mobile">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState<string | undefined>()
  const [otp, setOtp] = useState("")
  const [confirmation, setConfirmation] = useState<firebase.auth.ConfirmationResult | null>(null)

  // Check login and expiry on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Check for expiry
        const loginTimeStr = localStorage.getItem("loginTime");
        const loginTime = loginTimeStr ? parseInt(loginTimeStr, 10) : null;
        const currentTime = Date.now();

        if (loginTime && currentTime - loginTime < LOGIN_EXPIRY_MS) {
          // Not expired
          navigate("/dashboard", { replace: true });
        } else if (loginTime) {
          // Expired -- sign out and clear time
          await auth.signOut();
          localStorage.removeItem("loginTime");
        } // else, let user login
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [navigate]);

  // Email Login
  const LoginFunctinality = async () => {
    try {
      await handleLogin(email, password)
      localStorage.setItem("loginTime", Date.now().toString())
      alert("Email Login Successful!")
      navigate("/dashboard")
    } catch (err: any) {
      alert((err as Error).message)
    }
  }

  // Google Login
  const googleLoginHandler = async () => {
    try {
      await handleGoogleLogin()
      localStorage.setItem("loginTime", Date.now().toString())
      alert(" Google Login Successful!")
      navigate("/dashboard")
    } catch (err: any) {
      alert((err as Error).message)
    }
  }

  // Send OTP
  const sendOTPHandler = async () => {
    if (!phone || !phone.startsWith("+")) {
      alert(" Enter valid phone with country code")
      return
    }

    try {
      const confirm = await sendOTP(phone)
      setConfirmation(confirm)
      alert(" OTP Sent Successfully!")
    } catch (err: any) {
      console.error(err)
      alert((err as Error).message)
    }
  }

  // Verify OTP Login
  const verifyOTP = async () => {
    try {
      if (!confirmation) return alert("⚠️ Please send OTP first")
      await confirmation.confirm(otp)
      localStorage.setItem("loginTime", Date.now().toString())
      alert("OTP Login Successful!")
      navigate("/dashboard")
    } catch (err: any) {
      alert((err as Error).message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            {mode === "email"
              ? "Login using email and password"
              : "Login using mobile OTP"}
          </CardDescription>

          <div className="relative mt-3 flex w-full rounded-lg bg-gray-200 p-1">
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-white shadow transition-all duration-300 ${
                mode === "email" ? "left-1" : "left-1/2"
              }`}
            />

            <button
              onClick={() => setMode("email")}
              className={`relative z-10 w-1/2 py-2 ${
                mode === "email" ? "font-semibold text-black" : "text-gray-500"
              }`}
            >
              Email
            </button>

            <button
              onClick={() => setMode("mobile")}
              className={`relative z-10 w-1/2 py-2 ${
                mode === "mobile" ? "font-semibold text-black" : "text-gray-500"
              }`}
            >
              Mobile
            </button>
          </div>

          <Link
            to="/register"
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Don't have an account? register
          </Link>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            {mode === "email" && (
              <>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <Label>Password</Label>

                    <Link
                      to="/forgot"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      ForgotPassword?
                    </Link>
                  </div>

                  <Input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            {mode === "mobile" && (
              <>
                <div className="grid gap-2">
                  <Label>Mobile Number</Label>
                  <PhoneInput
                    defaultCountry="IN"
                    international
                    withCountryCallingCode
                    value={phone}
                    onChange={setPhone}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <Button onClick={sendOTPHandler}>Send OTP</Button>

                <div className="grid gap-2">
                  <Label>Enter OTP</Label>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {mode === "email" && (
            <>
              <Button className="w-full" onClick={LoginFunctinality}>
                Login
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={googleLoginHandler}
              >
                Login with Google
              </Button>
            </>
          )}

          {mode === "mobile" && (
            <Button variant="secondary" className="w-full" onClick={verifyOTP}>
              Verify OTP
            </Button>
          )}
        </CardFooter>
      </Card>
      <div id="recaptcha"></div>
    </div>
  )
}

export default Login
