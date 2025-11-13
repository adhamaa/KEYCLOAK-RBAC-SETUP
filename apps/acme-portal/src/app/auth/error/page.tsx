"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = () => {
    switch (error) {
      case "SessionExpired":
        return "Your session has expired. Please sign in again."
      case "InvalidTenant":
        return "You are not authorized to access this tenant."
      case "WrongOrganization":
        return "Your account belongs to a different organization. You cannot access this portal."
      case "NoOrganization":
        return "Your account is not associated with any organization. Please contact your administrator to add you to the correct organization as a managed member."
      case "Configuration":
        return "There is a problem with the authentication configuration."
      default:
        return "An authentication error occurred."
    }
  }

  const handleBackToLogin = async () => {
    // For NoOrganization and WrongOrganization errors, logout completely first
    if (error === "NoOrganization" || error === "WrongOrganization") {
      try {
        // Call logout API to end session
        await fetch("/api/auth/logout")
      } catch (err) {
        console.error("Logout error:", err)
      }
    }
    // Redirect to login
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Error
        </h1>
        <p className="text-gray-600 mb-6">
          {getErrorMessage()}
        </p>
        <button
          onClick={handleBackToLogin}
          className="btn-primary inline-block"
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
