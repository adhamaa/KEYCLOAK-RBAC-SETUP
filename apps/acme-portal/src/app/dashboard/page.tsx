import { getCurrentUser } from "@/lib/auth-helpers"
import { DashboardNav } from "@/components/DashboardNav"
import { UserInfo } from "@/components/UserInfo"
import { RoleCard } from "@/components/RoleCard"
import { TENANT_CONFIG } from "@/lib/config"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    return null // Middleware will handle redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to {TENANT_CONFIG.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Organization: {TENANT_CONFIG.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <UserInfo user={user} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {TENANT_CONFIG.features.claims && (
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                    <div className="text-2xl mb-2">📋</div>
                    <div className="font-semibold">View Claims</div>
                    <div className="text-sm text-gray-600">Manage your claims</div>
                  </button>
                )}
                {TENANT_CONFIG.features.reports && (
                  <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                    <div className="text-2xl mb-2">📊</div>
                    <div className="font-semibold">View Reports</div>
                    <div className="text-sm text-gray-600">Access analytics</div>
                  </button>
                )}
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <div className="text-2xl mb-2">⚙️</div>
                  <div className="font-semibold">Settings</div>
                  <div className="text-sm text-gray-600">Configure your account</div>
                </button>
                <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                  <div className="text-2xl mb-2">📖</div>
                  <div className="font-semibold">Documentation</div>
                  <div className="text-sm text-gray-600">Learn more</div>
                </button>
              </div>
            </div>

            <RoleCard roles={user.roles} />
          </div>
        </div>
      </main>
    </div>
  )
}
