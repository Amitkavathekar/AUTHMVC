import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "sonner"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import tree from "@/assets/images/tree.png"

import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { Eye, EyeOff } from "lucide-react"

import { handleRegister } from "../controllers/authController"
import axios from "axios"

function Register() {
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [fullName, setFullName] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [phoneTouched, setPhoneTouched] = useState(false)
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false)

  // Post data to Firebase and then to mockapi on register
  const Registerfunctionality = async () => {
    try {
      if (!email || !password || !fullName || !phone || !confirmPassword) {
        toast.warning("All fields are required", {
          position: "top-right",
        })
        return
      }

      if (password !== confirmPassword) {
        toast.warning("Password and Confirm Password do not match.", {
          position: "top-right",
        })
        return
      }

      // Register with Firebase
      const user = await handleRegister(email, password, fullName, phone)

      // Print Firebase unique idToken to console
      if (user && user.getIdToken) {
        const idToken = await user.getIdToken()
        console.log("Firebase idToken:", idToken)
      } else {
        console.log("Firebase uid:", user?.uid || "No user.uid available")
      }

      // Save user to Mock API
      const response = await axios.post(
        "https://69fae18488a7af0ecca7e2e4.mockapi.io/api/v1/user",
        {
          firebaseUid: user.uid,
          email,
          password,
          fullName,
          phone,
        }
      )

      console.log(response.data)

      toast.success("Registered Successfully", {
        position: "top-right",
      })
      //NOTE - signout use for when we register with firebase they automatic login and redirect to dashbord
      await signOut(auth)

      navigate("/login")
    } catch (err) {
      toast.warning(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "API request failed"
          : err instanceof Error
            ? err.message || "Something went wrong"
            : "Something went wrong",
        { position: "top-right" }
      )
    }
  }

  return (
    <div className="flex h-screen w-full bg-[#F5F5F5]">
      <div className="flex h-screen w-[60%] items-center justify-center">
        {/* Only card bg and style as in Login.tsx */}
        <Card className="w-full max-w-sm bg-[#F5F5F5] shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Create an account</CardTitle>
              <Link
                to="/login"
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                go to Login
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label>Full Name</Label>
                <Input
                  type="text"
                  placeholder="Amit kavathekar"
                  value={fullName}
                  onChange={(e) => {
                    const value = e.target.value
                    if (/^[a-zA-Z\s]{0,50}$/.test(value)) {
                      setFullName(value)
                    }
                  }}
                  className="border border-gray-300 bg-[#F5F5F5]"
                />
                {fullName !== "" && fullName.length < 3 && (
                  <span className="text-sm text-red-500">
                    Full name must be at least 5 characters.
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Mobile Number</Label>
                <div className="phone-input-wrapper relative w-full">
                  <PhoneInput
                    country={"in"}
                    value={phone}
                    placeholder="Enter phone number"
                    enableSearch
                    countryCodeEditable={false}
                    enableClickOutside={true}
                    containerClass="!w-full"
                    inputClass="!w-full !h-8 !rounded-md !text-sm !pl-16 focus:!outline-none focus:!ring-2 focus:!ring-gray-300 border border-gray-300 !bg-[#F5F5F5]"
                    buttonClass="!bg-transparent"
                    dropdownClass="!text-black"
                    searchClass="!w-full !p-2"
                    inputProps={{
                      onBlur: () => setPhoneTouched(true),
                    }}
                    onChange={(value: string) => {
                      setPhone(value)
                      setTimeout(() => {
                        ;(
                          document.querySelector(
                            ".form-control"
                          ) as HTMLInputElement | null
                        )?.focus()
                      }, 0)
                    }}
                  />
                </div>
                {phoneTouched &&
                  (!phone || phone.replace(/\D/g, "").length < 10) && (
                    <span className="text-sm text-red-500">
                      Phone number must be 10 digits.
                    </span>
                  )}
              </div>

              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 bg-[#F5F5F5]"
                />
                {email !== "" &&
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email) && (
                    <span className="text-sm text-red-500">
                      Please enter a valid email address.
                    </span>
                  )}
              </div>

              <div className="grid gap-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 bg-[#F5F5F5]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {password !== "" &&
                  !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/.test(
                    password
                  ) && (
                    <span className="text-sm text-red-500">
                      Must contain uppercase, number & special character.
                    </span>
                  )}
              </div>
              <div className="grid gap-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    className="border border-gray-300 bg-[#F5F5F5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {confirmPasswordTouched && confirmPassword !== password && (
                  <span className="text-sm text-red-500">
                    Password and Confirm Password must match.
                  </span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              className="w-full bg-[#3A5B22]"
              onClick={Registerfunctionality}
            >
              Register
            </Button>
            {/*
          <Button variant="outline" className="w-full">
            Sign up with Google
          </Button> */}
          </CardFooter>
        </Card>
      </div>
      <img src={tree} className="h-screen w-[45%] bg-cover" alt="tree" />
    </div>
  )
}

export default Register
