"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"

export default function LogoutCallbackPage() {
  useEffect(() => {
    // Clear NextAuth session and redirect to login
    signOut({ callbackUrl: "/login", redirect: true })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">👋</div>
        <p className="text-gray-600">Signing you out...</p>
      </div>
    </div>
  )
}
