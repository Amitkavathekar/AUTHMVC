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

  const Registerfunctionality = async () => {
    await handleRegister(email, password)
    navigate("/login")
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