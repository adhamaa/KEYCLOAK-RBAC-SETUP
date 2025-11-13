import { getCurrentUser, hasRole } from "@/lib/auth-helpers"
import { DashboardNav } from "@/components/DashboardNav"
import { UserInfo } from "@/components/UserInfo"
import { RoleCard } from "@/components/RoleCard"
import { TENANT_CONFIG } from "@/lib/config"
import Link from "next/link"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null // Middleware will handle redirect
  }

  // Check user permissions
  const isAdmin = await hasRole("e-claims-beta:admin")
  const canViewClaims = await hasRole("e-claims-beta:claims:view")
  const canSubmitClaims = await hasRole("e-claims-beta:claims:submit")

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to {TENANT_CONFIG.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Organization: {TENANT_CONFIG.id} {isAdmin && <span className="text-purple-600 font-semibold">• Administrator</span>}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <UserInfo user={user} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Admin Section */}
            {isAdmin && (
              <div className="card bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
                <h2 className="text-xl font-semibold mb-4 text-purple-900">🔐 Admin Controls</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/admin" className="p-4 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-left">
                    <div className="text-2xl mb-2">⚙️</div>
                    <div className="font-semibold text-purple-900">Admin Dashboard</div>
                    <div className="text-sm text-gray-600">Manage system settings</div>
                  </Link>
                  <button className="p-4 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all text-left">
                    <div className="text-2xl mb-2">👥</div>
                    <div className="font-semibold text-purple-900">Manage Users</div>
                    <div className="text-sm text-gray-600">User administration</div>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {canViewClaims && (
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold">View Claims</div>
                    <div className="text-sm text-gray-600">Browse insurance claims</div>
                  </button>
                )}
                {canSubmitClaims && (
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left">
                    <div className="text-2xl mb-2">📝</div>
                    <div className="font-semibold">Submit Claim</div>
                    <div className="text-sm text-gray-600">File a new claim</div>
                  </button>
                )}
                {TENANT_CONFIG.features.reports && (
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold">View Reports</div>
                    <div className="text-sm text-gray-600">Access analytics</div>
                  </button>
                )}
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
                  <div className="text-2xl mb-2">👤</div>
                  <div className="font-semibold">Profile Settings</div>
                  <div className="text-sm text-gray-600">Update your information</div>
                </button>
              </div>
            </div>

            {/* Role Information */}
            <RoleCard roles={user.roles} />

            {/* Getting Started */}
            {!isAdmin && (
              <div className="card bg-gray-50 border-gray-200">
                <h2 className="text-lg font-semibold mb-3">📚 Getting Started</h2>
                <ul className="space-y-2 text-sm text-gray-600">
                  {canViewClaims && <li>✅ You can view insurance claims</li>}
                  {canSubmitClaims && <li>✅ You can submit new claims</li>}
                  {!canSubmitClaims && <li>ℹ️ Contact your administrator for claim submission access</li>}
                  <li>ℹ️ Your actions are logged for security purposes</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
