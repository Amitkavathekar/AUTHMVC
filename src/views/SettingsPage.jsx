import { useEffect, useState } from "react"
import { auth } from "@/config/firebase"
import { deleteUser } from "firebase/auth"

export default function SettingsPage() {
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme) setTheme(savedTheme)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    )

    if (!confirmDelete) return

    try {
      const user = auth.currentUser
      if (user) {
        await deleteUser(user)
        alert("Account deleted successfully")
      }
    } catch (error) {
      console.error(error)
      alert("Error deleting account. You may need to re-login.")
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h2 className="text-2xl font-bold">⚙️ Settings</h2>

      {/* Theme Toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <span> Dark Mode</span>
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded bg-gray-200 px-4 py-1 dark:bg-gray-700"
        >
          {theme === "light" ? "Enable" : "Disable"}
        </button>
      </div>

      {/* Delete Account */}
      <div className="rounded-lg border p-4">
        <h3 className="font-semibold text-red-600">
          do you want delete Account
        </h3>
        <button
          onClick={handleDeleteAccount}
          className="mt-2 rounded bg-red-500 px-4 py-2 text-white"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}
