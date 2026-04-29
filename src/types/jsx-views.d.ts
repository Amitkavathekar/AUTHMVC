declare module "@/views/ProfilePage.jsx" {
  import type { User } from "firebase/auth"
  import type { ComponentType } from "react"

  interface ProfilePageProps {
    user: User | null
  }

  const ProfilePage: ComponentType<ProfilePageProps>
  export default ProfilePage
}

declare module "@/views/SettingsPage.jsx" {
  import type { ComponentType } from "react"

  const SettingsPage: ComponentType
  export default SettingsPage
}
