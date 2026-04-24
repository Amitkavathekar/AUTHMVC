import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

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

import {
  handleLogin,
  handleGoogleLogin,
} from "../controllers/authController"

import { sendOTP } from "../services/authService"

function Login() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<"email" | "mobile">("email")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [confirmation, setConfirmation] = useState<any>(null)

  // ✅ Email Login
  const LoginFunctinality = async () => {
    try {
      await handleLogin(email, password)
      alert("✅ Email Login Successful!")
      navigate("/dashboard")
    } catch (err: any) {
      alert("❌ " + err.message)
    }
  }

  // ✅ Google Login
  const googleLoginHandler = async () => {
    try {
      await handleGoogleLogin()
      alert("✅ Google Login Successful!")
      navigate("/dashboard")
    } catch (err: any) {
      alert("❌ " + err.message)
    }
  }

  // ✅ Send OTP
  const sendOTPHandler = async () => {
    try {
      const confirm = await sendOTP(phone)
      setConfirmation(confirm)
      alert("📩 OTP Sent Successfully!")
    } catch (err: any) {
      alert("❌ " + err.message)
    }
  }

  // ✅ Verify OTP Login
  const verifyOTP = async () => {
    try {
      if (!confirmation) return alert("⚠️ Please send OTP first")

      await confirmation.confirm(otp)
      alert("✅ OTP Login Successful!")
      navigate("/dashboard")
    } catch (err: any) {
      alert("❌ " + err.message)
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

          <div className="relative flex w-full bg-gray-200 rounded-lg p-1 mt-3">
            <div
              className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-white shadow transition-all duration-300 ${
                mode === "email" ? "left-1" : "left-1/2"
              }`}
            />

            <button
              onClick={() => setMode("email")}
              className={`relative w-1/2 py-2 z-10 ${
                mode === "email" ? "font-semibold text-black" : "text-gray-500"
              }`}
            >
              Email
            </button>

            <button
              onClick={() => setMode("mobile")}
              className={`relative w-1/2 py-2 z-10 ${
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
                  <Input
                    type="text"
                    placeholder="+919876543210"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <Button onClick={sendOTPHandler}>
                  Send OTP
                </Button>

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
            <Button
              variant="secondary"
              className="w-full"
              onClick={verifyOTP}
            >
              Verify OTP
            </Button>
          )}

          <div id="recaptcha"></div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login