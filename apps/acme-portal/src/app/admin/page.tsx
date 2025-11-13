import { requireRole } from "@/lib/auth-helpers"
import { DashboardNav } from "@/components/DashboardNav"
import { redirect } from "next/navigation"

export default async function AdminPage() {
  try {
    const session = await requireRole("e-portal-acme:admin")
    const user = session.user
    
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardNav />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              ⚙️ Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              System administration and management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Management */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-lg font-semibold mb-2">User Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Manage users, roles, and permissions
              </p>
              <button className="btn-primary w-full">
                Manage Users
              </button>
            </div>

            {/* System Settings */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold mb-2">System Settings</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure application settings
              </p>
              <button className="btn-primary w-full">
                Open Settings
              </button>
            </div>

            {/* Activity Logs */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-lg font-semibold mb-2">Activity Logs</h3>
              <p className="text-sm text-gray-600 mb-4">
                View system and user activity
              </p>
              <button className="btn-primary w-full">
                View Logs
              </button>
            </div>

            {/* Claims Approval */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold mb-2">Claims Approval</h3>
              <p className="text-sm text-gray-600 mb-4">
                Review and approve pending claims
              </p>
              <button className="btn-primary w-full">
                Pending Claims
              </button>
            </div>

            {/* Reports */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">
                View detailed analytics and reports
              </p>
              <button className="btn-primary w-full">
                View Analytics
              </button>
            </div>

            {/* System Health */}
            <div className="card hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💚</div>
              <h3 className="text-lg font-semibold mb-2">System Health</h3>
              <p className="text-sm text-gray-600 mb-4">
                Monitor system performance
              </p>
              <button className="btn-primary w-full">
                Check Status
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card bg-blue-50 border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Total Users</div>
              <div className="text-3xl font-bold text-blue-600">124</div>
            </div>
            <div className="card bg-green-50 border-green-200">
              <div className="text-sm text-gray-600 mb-1">Active Claims</div>
              <div className="text-3xl font-bold text-green-600">45</div>
            </div>
            <div className="card bg-yellow-50 border-yellow-200">
              <div className="text-sm text-gray-600 mb-1">Pending Approvals</div>
              <div className="text-3xl font-bold text-yellow-600">12</div>
            </div>
            <div className="card bg-purple-50 border-purple-200">
              <div className="text-sm text-gray-600 mb-1">System Uptime</div>
              <div className="text-3xl font-bold text-purple-600">99.9%</div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 card">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { user: "Alice Anderson", action: "Created new claim", time: "2 minutes ago" },
                { user: "Bob Brown", action: "Approved claim #1234", time: "15 minutes ago" },
                { user: "Charlie Chen", action: "Updated user profile", time: "1 hour ago" },
                { user: "Diana Davis", action: "Generated report", time: "2 hours ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <div className="font-medium">{activity.user}</div>
                    <div className="text-sm text-gray-600">{activity.action}</div>
                  </div>
                  <div className="text-sm text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  } catch (error) {
    redirect("/unauthorized")
  }
}
