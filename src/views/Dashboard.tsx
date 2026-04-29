import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../config/firebase"
import { handleLogout } from "../controllers/authController"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/resusable/AppSidebar"

import ProfilePage from "@/views/ProfilePage.jsx"
import SettingsPage from "@/views/SettingsPage.jsx"
function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState("dashboard")

  const stats = {
    projects: 12,
    tasks: 34,
    messages: 5,
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/login")
      } else {
        setUser(user)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [navigate])

  const Logoutfunctionality = async () => {
    await handleLogout()
    navigate("/login")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Loading...
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={user}
        onLogout={Logoutfunctionality}
        setActivePage={setActivePage}
      />

      {/* Main Content */}
      <main className="min-h-screen flex-1 bg-gray-50 p-6">
        <SidebarTrigger />

        {/* DASHBOARD */}
        {activePage === "dashboard" && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow">
              <h1 className="text-2xl font-bold">
                Welcome, {user?.displayName || "User"}
              </h1>
              <p className="mt-1 text-gray-500">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Distinctio, neque?
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-blue-100 p-5">
                <h2 className="text-lg font-semibold">Projects</h2>
                <p className="text-3xl font-bold">{stats.projects}</p>
              </div>

              <div className="rounded-xl bg-green-100 p-5">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <p className="text-3xl font-bold">{stats.tasks}</p>
              </div>

              <div className="rounded-xl bg-purple-100 p-5">
                <h2 className="text-lg font-semibold">Messages</h2>
                <p className="text-3xl font-bold">{stats.messages}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
              <ul className="space-y-3 text-gray-600">
                <li> Completed frontend task</li>
                <li> New message received</li>
                <li> Project deployed successfully</li>
              </ul>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activePage === "profile" && <ProfilePage user={user} />}

        {/* SETTINGS */}
        {activePage === "settings" && <SettingsPage />}
      </main>
    </SidebarProvider>
  )
}

export default Dashboard
