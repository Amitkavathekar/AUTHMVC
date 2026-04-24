import { Routes, Route } from "react-router-dom"
import Login from "../views//Login"
import Register from "../views//Register"
import ForgotPassword from "../views/ForgotPassword"
import Dashboard from "../views//Dashboard"
import Home from "../views/Home"

function AppRoutes() {
  return (
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>

  )
}

export default AppRoutes
