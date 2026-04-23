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

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const LoginFunctinality = async () => {
    await handleLogin(email, password)
    navigate("/dashboard")
  }

  const handleOTPLogin = async () => {
    try {
      const confirmation = await sendOTP("+91XXXXXXXXXX") // replace number
      const code = prompt("Enter OTP")
      if (!code) return

      await confirmation.confirm(code)
      alert("OTP Login Success")
      navigate("/dashboard")
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login</CardDescription>

          <Link
            to="/register"
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Don't have an account? register
          </Link>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
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
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={LoginFunctinality}>
            Login
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleOTPLogin}
          >
            Login with OTP
          </Button>

          <div id="recaptcha"></div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login