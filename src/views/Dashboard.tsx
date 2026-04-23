import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../config/firebase"
import { handleLogout } from "../controllers/authController"

function Dashboard() {
  const navigate = useNavigate()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login")
      }
    })

    return () => unsubscribe()
  }, [navigate])

  const Logoutfunctionality = async () => {
    await handleLogout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="mt-2">Welcome to Dashboard</p>

      <button
        onClick={Logoutfunctionality}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
      >
        Logout
      </button>
    </div>
  )
}

export default Dashboard