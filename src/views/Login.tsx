import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { Eye, EyeOff } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"

import { sendOtp, verifyOtp } from "@/controllers/authController"
import tree from "@/assets/images/tree.png"

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

import { handleGoogleLogin } from "../controllers/authController"
import { auth } from "../config/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { toast } from "sonner"

import { DotLoader } from "react-spinners" // Correct loader as per requirement

import axios from "axios"

type UserType = {
  id: string
  email: string
  password: string
  fullName?: string
  phone?: string
}

// reCAPTCHA
declare global {
  interface Window {
    grecaptcha: any
  }
}

function Login() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<"email" | "mobile">("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [phone, setPhone] = useState<string>("")
  const [otp, setOtp] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  // Error state for validation
  const [emailError, setEmailError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [phoneError, setPhoneError] = useState<string>("")

  // Spinner loading state

  const [dashboardLoader, setDashboardLoader] = useState<boolean>(false) // Loader before entering dashboard

  // Email & Password patterns
  const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/
  const phonePattern = /^\+91[1-9][0-9]{9}$/

  useEffect(() => {
    // Show dashboard loader when navigating to dashboard
    if (isLoggedIn) {
      setDashboardLoader(true)
      setTimeout(() => {
        setDashboardLoader(false)
        navigate("/dashboard", { replace: true })
      }, 1200)
      return
    }
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setDashboardLoader(true)
        setTimeout(() => {
          setDashboardLoader(false)
          navigate("/dashboard", { replace: true })
        }, 1200)
      }
    })
    return () => unsubscribe()
  }, [navigate, isLoggedIn])

  // Form field validation functions
  const validateEmail = (e?: string) => {
    const toValidate = typeof e === "string" ? e : email
    if (!toValidate) return "Email is required."
    if (!emailPattern.test(toValidate))
      return "Please enter a valid email address."
    return ""
  }
  const validatePassword = (p?: string) => {
    const toValidate = typeof p === "string" ? p : password
    if (!toValidate) return "Password is required."
    if (!passwordPattern.test(toValidate))
      return "Please enter a valid Password "
    return ""
  }
  const validatePhone = (ph?: string) => {
    const toValidate = typeof ph === "string" ? ph : phone
    if (!toValidate) return "Phone is required."
    if (!phonePattern.test(toValidate))
      return "Enter valid Indian mobile number (10 digits)."
    return ""
  }

  // Rewritten loginFunctionality with email, password, phone validation
  const loginFunctionality = async () => {
    if (mode === "email") {
      const emailErr = validateEmail()
      const passwordErr = validatePassword()
      setEmailError(emailErr)
      setPasswordError(passwordErr)

      if (emailErr || passwordErr) {
        toast.warning(emailErr || passwordErr, { position: "top-right" })
        return
      }
    } else if (mode === "mobile") {
      const phoneErr = validatePhone()
      setPhoneError(phoneErr)
      if (phoneErr) {
        toast.warning(phoneErr, { position: "top-right" })
        return
      }
      if (!otp || otp.length < 6) {
        toast.warning("Please enter complete OTP.", { position: "top-right" })
        return
      }
      // Mobile/OTP login handler would go here
      toast.success("Mobile Login Successful!", { position: "top-right" })
      setIsLoggedIn(true)
      // Dashboard loader and navigation is handled in useEffect
      return
    }

    // Proceed with usual email/password login
    let firebaseFailMsg = ""
    let firebaseUser = null
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password)
      firebaseUser = userCred.user
      if (firebaseUser) {
        toast.success("Firebase Login Successful!", { position: "top-right" })
        setIsLoggedIn(true)
        // Dashboard loader and navigation is handled in useEffect
        return
      } else {
        firebaseFailMsg =
          "Firebase authenticated but user is null. Trying API..."
      }
    } catch (firebaseError) {
      firebaseFailMsg =
        firebaseError instanceof Error
          ? firebaseError.message
          : "Firebase login failed. Trying API..."
    }

    // --- Use axios instead of fetch for API call ---
    try {
      const response = await axios.get(
        "https://69fae18488a7af0ecca7e2e4.mockapi.io/api/v1/user"
      )
      if (!response || !response.data) {
        toast.warning("Could not connect to authentication server.", {
          position: "top-right",
        })
        return
      }
      const users: UserType[] = response.data
      const matchedUser = users.find(
        (u: UserType) => u.email === email && u.password === password
      )
      if (matchedUser) {
        toast.success("API Login Successful!", { position: "top-right" })
        setIsLoggedIn(true)
        navigate("/dashboard", { replace: true })
      } else {
        toast.warning(
          firebaseFailMsg
            ? `Firebase: ${firebaseFailMsg} API: Email and password do not match.`
            : "Email and password do not match.",
          { position: "top-right" }
        )
      }
    } catch (err: any) {
      toast.warning(
        (err as Error).message || "Login failed from both Firebase and API.",
        {
          position: "top-right",
        }
      )
    }
  }

  // Google Login (with updated toast position)
  const googleLoginHandler = async () => {
    try {
      await handleGoogleLogin()
      toast.success("Google Login Successful!", { position: "top-right" })
      setIsLoggedIn(true)
      // Dashboard loader and navigation is handled in useEffect
    } catch (err: any) {
      toast.warning((err as Error).message, { position: "top-right" })
    }
  }

  const handlePhoneChange = async (e: any) => {
    const value = e.target.value

    setPhone(value)

    // Indian number check
    if (value.length === 13) {
      const result = await sendOtp(value)

      if (result.success) {
        toast.success(`OTP sent to ${value}`, { position: "top-right" })
      } else {
        toast.error(result.message, { position: "top-right" })
      }
    }
  }

  const handleVerifyOtp = async () => {
    const result = await verifyOtp(otp)

    if (result.success) {
      toast.success("Login Successful", { position: "top-right" })
      setIsLoggedIn(true)
      // Dashboard loader and navigation handled in useEffect
    } else {
      toast.warning("Wrong OTP", { position: "top-right" })
    }
  }

  // MAIN return
  if (dashboardLoader) {
    // Show loader before navigating to dashboard
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F5F5F5]">
        <DotLoader size={60} color="#3A5B22" />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-[#F5F5F5]">
      <div
        className="flex h-screen w-[60%] items-center justify-center border-none"
        style={{ backgroundColor: "#F5F5F5" }}
      >
        <Card className="w-full max-w-sm !border-0 !bg-transparent shadow-none !outline-none">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back!</CardTitle>
            <CardDescription className="text-black">
              {mode === "email"
                ? "Enter your Credentials to access your account"
                : "Login using your mobile and OTP"}
            </CardDescription>

            <div className="relative mt-3 flex w-full rounded-lg bg-[#EBE9E3] p-1">
              <div
                className={`absolute top-1 bottom-1 w-1/2 rounded-md bg-white shadow transition-all duration-300 ${
                  mode === "email" ? "left-1" : "left-1/2"
                }`}
              ></div>
              <button
                onClick={() => setMode("email")}
                className={`relative z-10 w-1/2 py-2 ${
                  mode === "email"
                    ? "font-semibold text-black"
                    : "text-gray-500"
                }`}
                type="button"
              >
                Email
              </button>
              <button
                onClick={() => setMode("mobile")}
                className={`relative z-10 w-1/2 py-2 ${
                  mode === "mobile"
                    ? "font-semibold text-black"
                    : "text-gray-500"
                }`}
                type="button"
              >
                Mobile
              </button>
            </div>
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
                      value={email}
                      className="border border-gray-300"
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setEmailError(validateEmail(e.target.value))
                      }}
                      onBlur={(e) =>
                        setEmailError(validateEmail(e.target.value))
                      }
                    />
                    {emailError && (
                      <span className="text-sm text-red-500">{emailError}</span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <Label>Password</Label>
                      <Link
                        to="/forgot"
                        className="text-sm text-[#0F3DDE] hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="border border-gray-300"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setPasswordError(validatePassword(e.target.value))
                        }}
                        onBlur={(e) =>
                          setPasswordError(validatePassword(e.target.value))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <span className="text-sm text-red-500">
                        {passwordError}
                      </span>
                    )}
                  </div>
                </>
              )}

              {mode === "mobile" && (
                <div className="flex w-full flex-col items-center">
                  <div className="grid w-full gap-2">
                    <Label className="mb-2">Enter Mobile Number</Label>
                    <div className="relative flex w-full justify-center">
                      <PhoneInput
                        country={"in"}
                        inputProps={{
                          autoFocus: true,
                        }}
                        value={phone}
                        onChange={async (value: string) => {
                          const ph = value.startsWith("+") ? value : "+" + value

                          setPhone(ph)

                          setTimeout(() => {
                            const input = document.querySelector(
                              ".react-tel-input input"
                            ) as HTMLInputElement

                            input?.focus()
                          }, 0)

                          setPhoneError(validatePhone(ph))

                          if (ph.length === 13 && !window.confirmationResult) {
                            const result = await sendOtp(ph)

                            if (result.success) {
                              toast.success(`OTP sent to ${ph}`, {
                                position: "top-right",
                              })
                            } else {
                              toast.warning(result.message, {
                                position: "top-right",
                              })
                            }
                          }
                        }}
                        onBlur={() => setPhoneError(validatePhone(phone))}
                        placeholder="Enter phone number"
                        enableSearch
                        countryCodeEditable={false}
                        enableClickOutside={true}
                        containerClass="!w-[210px]"
                        inputClass="!w-[250px] !h-8 !rounded-md !text-sm !pl-12 !border !border-gray-300 !bg-transparent"
                        buttonClass="!bg-transparent !bg-transparent !border-gray-300"
                        dropdownClass="!text-black !w-[250px]"
                        searchClass="!w-full !p-2"
                      />
                    </div>
                    {phoneError && (
                      <span className="m-auto text-sm text-red-500">
                        {phoneError}
                      </span>
                    )}
                  </div>
                  {/* Move reCAPTCHA popup margin from left to right */}
                  <div className="mt-4 flex w-full justify-center">
                    <div className="scale-90" id="recaptcha-container"></div>
                  </div>

                  <div className="grid w-full max-w-xs gap-2">
                    <Label className="mt-2 mb-2">Enter OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        value={otp}
                        onChange={setOtp}
                      >
                        <InputOTPGroup className="border-gray-1000 border">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup className="border-gray-1000 border">
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full bg-[#3A5B22]"
              onClick={mode === "email" ? loginFunctionality : handleVerifyOtp}
            >
              {mode === "email" ? "Login" : "Verify with OTP"}
            </Button>
            <Button
              variant="outline"
              className="w-full border border-gray-200"
              onClick={googleLoginHandler}
            >
              <FcGoogle />
              Login with Google
            </Button>
            <div className="mt-1">
              <span className="text-black no-underline">
                Don't have an account?{" "}
              </span>
              <Link
                to="/register"
                className="mt-2 text-sm text-[#0F3DDE] hover:underline"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <img src={tree} className="w-[45%] bg-cover" alt="tree" />
    </div>
  )
}

export default Login
