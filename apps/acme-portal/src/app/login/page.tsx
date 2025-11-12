import { LoginForm } from "@/components/LoginForm"
import { TenantBranding } from "@/components/TenantBranding"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <TenantBranding />
        <div className="mt-8 bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-6">Sign in to access your portal</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
