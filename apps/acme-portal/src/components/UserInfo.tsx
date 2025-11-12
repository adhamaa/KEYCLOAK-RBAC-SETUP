import type { Session } from "next-auth"

interface UserInfoProps {
  user: Session["user"]
}

export function UserInfo({ user }: UserInfoProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-600">Name</label>
          <p className="text-gray-900">{user.name || "N/A"}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">Organization</label>
          <p className="text-gray-900">{user.organization || user.tenantId}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-600">User ID</label>
          <p className="text-gray-900 font-mono text-sm">{user.id}</p>
        </div>
      </div>
    </div>
  )
}
