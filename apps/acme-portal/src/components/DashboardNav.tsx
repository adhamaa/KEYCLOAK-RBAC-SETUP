"use client"

import { TENANT_CONFIG } from "@/lib/config"

export function DashboardNav() {
  const handleSignOut = () => {
    // Redirect to our custom logout endpoint which handles both NextAuth and Keycloak logout
    window.location.href = "/api/auth/logout"
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-blue-600">
                {TENANT_CONFIG.name}
              </span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <a href="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100">
                  Dashboard
                </a>
                {TENANT_CONFIG.features.claims && (
                  <a href="/claims" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                    Claims
                  </a>
                )}
                {TENANT_CONFIG.features.reports && (
                  <a href="/reports" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100">
                    Reports
                  </a>
                )}
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="btn-secondary text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
