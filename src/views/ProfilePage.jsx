import { useState, useEffect } from "react"
import { storage, db } from "@/config/firebase"
import { updateProfile, updatePassword } from "firebase/auth"
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore"

export default function ProfilePage({ user }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  // const [password, setPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [photoURL, setPhotoURL] = useState("")

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.displayName || "")
      setPhone(user.phoneNumber || "")
      setEmail(user.email || "")
      setPhotoURL(user.photoURL || "")
    }
  }, [user])

  // useEffect(() => {
  //   return () => {
  //     if (preview) URL.revokeObjectURL(preview)
  //   }
  // }, [preview])

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    if (!selected.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    if (selected.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB")
      return
    }

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const uploadImage = async () => {
    if (!file || !user) return

    setLoading(true)
    try {
      const imageRef = ref(storage, `profile/${user.uid}`)
      await uploadBytes(imageRef, file)
      const url = await getDownloadURL(imageRef)

      await updateProfile(user, { photoURL: url })

      setPhotoURL(url)
      setPreview(url)
      setFile(null)

      alert("Image Updated Successfully")
    } catch (err) {
      alert("Upload failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const removeImage = async () => {
    if (!user) return

    setLoading(true)
    try {
      const imageRef = ref(storage, `profile/${user.uid}`)
      await deleteObject(imageRef).catch(() => {})

      await updateProfile(user, { photoURL: "" })

      setPhotoURL("")
      setPreview(null)
      setFile(null)

      alert("Image Removed")
    } catch (err) {
      alert("Remove failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateName = async () => {
    if (!user) return

    if (!name.trim()) {
      alert("Name cannot be empty")
      return
    }

    try {
      await updateProfile(user, { displayName: name })
      alert("Name Updated")
    } catch (err) {
      alert(err.message)
    }
  }

  const changePassword = async () => {
    if (!user || !password || !confirmPassword) return

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      await updatePassword(user, password)
      setPassword("")
      setConfirmPassword("")
      setError("")
      alert("Password Updated")
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        alert("Please login again to change password")
      } else {
        alert(err.message)
      }
    }
  }

  const updatePhone = async () => {
    alert("Phone update requires OTP verification (Firebase Phone Auth)")
  }

  const handleFirestoreUpdate = async (e) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      let createdAt = serverTimestamp()

      if (userSnap.exists()) {
        createdAt = userSnap.data().createdAt || serverTimestamp()
      }

      await setDoc(
        userRef,
        {
          displayName: name,
          email: email,
          phoneNumber: phone,
          photoURL: photoURL,
          provider: user.providerData?.[0]?.providerId || "password",
          updatedAt: serverTimestamp(),
          createdAt: createdAt,
        },
        { merge: true }
      )

      alert("Firestore Profile Updated Successfully")
    } catch (err) {
      alert("Firestore update failed: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="max-w-md p-6" onSubmit={handleFirestoreUpdate}>
      <h2 className="mb-4 text-xl font-bold">Profile </h2>

      <div className="flex items-start gap-6">
        {(preview || photoURL) && (
          <img
            src={preview || photoURL}
            alt="profile"
            className="h-24 w-24 rounded-full object-cover"
          />
        )}

        <div className="flex-1">
          <label className="mb-1 block font-medium">Profile Image</label>

          <input
            className="w-full rounded border p-2"
            type="file"
            onChange={handleFileChange}
          />

          <div className="mt-3 flex gap-3">
            <button
              className="rounded border p-2"
              type="button"
              onClick={uploadImage}
              disabled={loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </button>

            <button
              className="rounded border p-2"
              type="button"
              onClick={removeImage}
              disabled={loading}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* 👤 Name */}
      <div className="mt-6">
        <label className="mb-1 block font-medium">Full Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-medium">Phone Number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-medium">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError("")
          }}
          className="w-full border p-2"
        />
      </div>

      <div className="mt-4">
        <label className="mb-1 block font-medium">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value)
            setError("")
          }}
          className="w-full border p-2"
        />
      </div>

      <div className="mt-8">
        <button
          type="submit"
          onClick={changePassword}
          disabled={loading}
          disabled={password !== confirmPassword || !password}
          className="w-full rounded bg-blue-600 px-6 py-2 font-bold text-white"
        >
          {loading ? "Saving..." : "Submit (Firestore Update)"}
        </button>
      </div>
    </form>
  )
}
