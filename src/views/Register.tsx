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

import { handleRegister } from "../controllers/authController"

function Register() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")

  const Registerfunctionality = async () => {
    try {
      if (!email || !password || !fullName || !phone) {
        alert("All fields required")
        return
      }

      await handleRegister(email, password, fullName, phone)

      alert("Registered Successfully ")
      navigate("/login")
    } catch (err: any) {
      console.error(err)
      alert(err.message)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Enter your details to register</CardDescription>

          <Link
            to="/login"
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Already have an account? Login
          </Link>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input
                type="text"
                placeholder="John Doe"
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Mobile Number</Label>
              <Input
                type="text"
                placeholder="+919876543210"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={Registerfunctionality}>
            Register
          </Button>

          <Button variant="outline" className="w-full">
            Sign up with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register
