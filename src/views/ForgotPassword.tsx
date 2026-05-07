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
import tree from "@/assets/images/tree.png"

import { handleReset } from "../controllers/authController"

function ForgotPassword() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")

  const ResetFuntinality = async () => {
    await handleReset(email)
    navigate("/login")
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex w-full bg-[#F5F5F5]">
        <div className="flex h-screen  items-center w-[60%]  justify-center bg-[#F5F5F5]">
          <Card className="w-full max-w-sm shadow-lg">
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                Enter your email to reset password
              </CardDescription>

              <Link
                to="/login"
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Back to Login
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
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-[#3A5B22]" onClick={ResetFuntinality}>
                Send Reset Email
              </Button>

              <Button
                variant="outline"
                className="w-full "
                onClick={() => navigate("/login")}
              >
                Go to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
        {/* Right Side: Image */}
        <div className="h-screen w-[45%]">
          <img src={tree} className="h-full w-full" alt="tree" />
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
