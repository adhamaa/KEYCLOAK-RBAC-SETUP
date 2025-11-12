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
      case "Configuration":
        return "There is a problem with the authentication configuration."
      default:
        return "An authentication error occurred."
    }
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
        <a
          href="/login"
          className="btn-primary inline-block"
        >
          Back to Login
        </a>
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
