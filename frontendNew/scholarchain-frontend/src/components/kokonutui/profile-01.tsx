"use client"

import { LogOut } from "lucide-react"
import Image from "next/image"
import { AuthService } from "@/services/auth.service"
import { useEffect, useState } from "react"

// Import the getUserDetails service
import { getUserDetails } from "@/services/user.service" // Assuming this is where your service is located

interface UserDetails {
  name: string | null
  username: string
  email: string
  role: string
}

interface Profile01Props {
    avatar?: string; // Make avatar optional, as the component generates a random one
}


// Sample avatars
const sampleAvatars = [
  "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-02-albo9B0tWOSLXCVZh9rX9KFxXIVWMr.png",
  "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-7dJ5Yz0QTlQlvIQZRLuQl8n2GvBTt6.png",
  "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-03-QwU5QnrCIGlAMZkWQ9A5UHmIzHKGf2.png",
  "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-04-0yCR9yTe7Xw9TaLPHzWzfQvHGOQHmP.png",
  "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-05-KIjD4l8UVpqWuO8EXrBrfaWNlYEEFi.png",
]

const defaultProfile = {
  name: "Eugene An",
  role: "Prompt Engineer",
}

const Profile01: React.FC<Profile01Props> = ({ avatar }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [randomAvatar, setRandomAvatar] = useState<string>("")

  useEffect(() => {
    // Select a random avatar
    const randomIndex = Math.floor(Math.random() * sampleAvatars.length)
    setRandomAvatar(sampleAvatars[randomIndex])

    const fetchUserDetails = async () => {
      try {
        const data = await getUserDetails()
        setUserDetails(data)
      } catch (err) {
        console.error("Failed to fetch user details:", err)
        setError("Failed to load user profile")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserDetails()
  }, [])

  // Use the fetched user data or fallback to defaults
  const displayName = userDetails?.name || userDetails?.username || defaultProfile.name
  const displayRole = userDetails?.role || defaultProfile.role

  // Keep the logout handler unchanged as requested
  const handleLogout = () => {
    AuthService.removeToken()
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-sm p-6 text-center">
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-sm p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        <div className="relative px-6 pt-12 pb-6">
          <div className="mb-8 flex items-center gap-4">
            <div className="relative shrink-0">
              <Image
                src={randomAvatar || "/placeholder.svg"}
                alt={displayName}
                width={72}
                height={72}
                className="rounded-full object-cover ring-4 ring-white dark:ring-zinc-900"
              />
              <div className="absolute right-0 bottom-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{displayName}</h2>
              <p className="text-zinc-600 dark:text-zinc-400">{displayRole}</p>
              {userDetails?.email && <p className="text-xs text-zinc-500 dark:text-zinc-400">{userDetails.email}</p>}
            </div>
          </div>
          <div className="my-6 h-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-2">
            <a
              href="/auth"
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-lg p-2 transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Logout</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile01;