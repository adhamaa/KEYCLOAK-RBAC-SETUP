"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"

function LoginFormContent() {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("keycloak", { callbackUrl })
    } catch (error) {
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Signing in..." : "Sign in with Keycloak"}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        You will be redirected to Keycloak to authenticate
      </p>
    </div>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="space-y-4"><button className="w-full btn-primary" disabled>Loading...</button></div>}>
      <LoginFormContent />
    </Suspense>
  )
}
