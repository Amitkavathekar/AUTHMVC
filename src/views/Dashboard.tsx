import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { handleLogout } from "../controllers/authController"
import axios from "axios"
import { DotLoader } from "react-spinners"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/resusable/AppSidebar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import ProfilePage from "@/views/ProfilePage.jsx"
import SettingsPage from "@/views/SettingsPage.jsx"

type UserData = {
  id: string
  email: string
  fullName?: string
  phone?: string
  createdAt?: string
  updatedAt?: string
  firebaseUid?: string
  password?: string
}

function Dashboard() {
  const navigate = useNavigate()

  const [user] = useState<UserData | null>({
    id: "2",
    email: "amitkavathekar@gmail.com",
    fullName: "Amit Annappa Kavathekar",
    phone: "918080379229",
    createdAt: "2026-05-06T08:32:39.129Z",
    updatedAt: "America/Argentina/Salta",
    firebaseUid: "6imVjAK00EhaxB1zNvZLwzX25ls1",
    password: "789456123",
  })

  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState("dashboard")
  const [apiData, setApiData] = useState<UserData[]>([])
  const [apiLoading, setApiLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editUser, setEditUser] = useState<UserData | null>(null)
  const [editForm, setEditForm] = useState<Partial<UserData>>({})
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const Logoutfunctionality = async () => {
    await handleLogout()
    navigate("/login")
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Shortened error handling per request
  const fetchApiData = async () => {
    setApiLoading(true)
    setApiError(null)
    try {
      const response = await axios.get<UserData[]>(
        "https://69fae18488a7af0ecca7e2e4.mockapi.io/api/v1/user"
      )
      setApiData(response.data)
    } catch (err: any) {
      setApiError(err?.message || "Failed to fetch users.")
    } finally {
      setApiLoading(false)
    }
  }

  useEffect(() => {
    fetchApiData()
  }, [])

  const handleEditUser = (userId: string) => {
    const userToEdit = apiData.find((u) => u.id === userId)
    if (userToEdit) {
      setEditForm({
        id: userToEdit.id,
        email: userToEdit.email,
        fullName: userToEdit.fullName,
        phone: userToEdit.phone,
        createdAt: userToEdit.createdAt,
        updatedAt: userToEdit.updatedAt,
        firebaseUid: userToEdit.firebaseUid,
        password: userToEdit.password,
      })
      setEditUser(userToEdit)
      setEditError(null)
      setEditDialogOpen(true)
    }
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editUser) return
    setEditSaving(true)
    setEditError(null)
    try {
      const resp = await axios.put<UserData>(
        `https://69fae18488a7af0ecca7e2e4.mockapi.io/api/v1/user/${editUser.id}`,
        editForm
      )
      setApiData((prev) =>
        prev.map((u) => (u.id === editUser.id ? resp.data : u))
      )
      setEditDialogOpen(false)
      setEditUser(null)
      setEditForm({})
    } catch (err: any) {
      setEditError(err?.message || "Failed to update user.")
    } finally {
      setEditSaving(false)
    }
  }

  const handleEditDialogClose = () => {
    setEditDialogOpen(false)
    setEditUser(null)
    setEditError(null)
    setEditForm({})
  }

  const handleDeleteUser = async (userId: string) => {
    setDeleteLoading(userId)
    try {
      await axios.delete(
        `https://69fae18488a7af0ecca7e2e4.mockapi.io/api/v1/user/${userId}`
      )
      setApiData((prev) => prev.filter((user) => user.id !== userId))
    } catch (err: any) {
      setApiError(err?.message || "Failed to delete user.")
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <SidebarProvider>
      {!loading && (
        <>
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
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Users from API</h2>
                  {apiLoading ? (
                    <div className="flex min-h-[60vh] items-center justify-center">
                      <DotLoader size={60} color="#3A5B22" />
                    </div>
                  ) : apiError ? (
                    <div className="text-red-500">{apiError}</div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {apiData.map((u) => (
                        <Card key={u.id}>
                          <CardHeader>
                            <CardTitle>{u.fullName ?? "No Name"}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div>
                              <strong>Email:</strong> {u.email}
                            </div>
                            {u.phone && (
                              <div>
                                <strong>Phone:</strong> {u.phone}
                              </div>
                            )}
                            <div>
                              <strong>User ID:</strong> {u.id}
                            </div>
                            {u.firebaseUid && (
                              <div>
                                <strong>Firebase UID:</strong> {u.firebaseUid}
                              </div>
                            )}
                            {u.createdAt && (
                              <div>
                                <strong>Created At:</strong> {u.createdAt}
                              </div>
                            )}
                            {u.updatedAt && (
                              <div>
                                <strong>Updated At:</strong> {u.updatedAt}
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditUser(u.id)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deleteLoading === u.id}
                              onClick={() => handleDeleteUser(u.id)}
                            >
                              {deleteLoading === u.id
                                ? "Deleting..."
                                : "Delete"}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Edit User Modal (simple dialog implementation) */}
                {editDialogOpen && editUser && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
                      <h2 className="mb-4 text-lg font-bold">Edit User</h2>
                      <form
                        onSubmit={handleEditFormSubmit}
                        className="space-y-3"
                      >
                        <div>
                          <label className="mb-1 block font-semibold">
                            Full Name
                          </label>
                          <Input
                            name="fullName"
                            type="text"
                            value={editForm.fullName ?? ""}
                            onChange={handleEditFormChange}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-semibold">
                            Email
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={editForm.email ?? ""}
                            onChange={handleEditFormChange}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block font-semibold">
                            Phone
                          </label>
                          <Input
                            name="phone"
                            type="text"
                            value={editForm.phone ?? ""}
                            onChange={handleEditFormChange}
                          />
                        </div>
                        {/* You can add other editable fields similarly */}
                        {editError && (
                          <div className="text-sm text-red-500">
                            {editError}
                          </div>
                        )}
                        <div className="mt-4 flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleEditDialogClose}
                            disabled={editSaving}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={editSaving}>
                            {editSaving ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE */}
            {activePage === "profile" && <ProfilePage user={user} />}

            {/* SETTINGS */}
            {activePage === "settings" && <SettingsPage />}
          </main>
        </>
      )}
    </SidebarProvider>
  )
}

export default Dashboard
