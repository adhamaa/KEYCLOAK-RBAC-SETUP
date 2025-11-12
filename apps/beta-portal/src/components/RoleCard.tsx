interface RoleCardProps {
  roles: string[]
}

export function RoleCard({ roles }: RoleCardProps) {
  const sortedRoles = [...roles].sort()
  
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Your Roles & Permissions</h2>
      {roles.length === 0 ? (
        <p className="text-gray-600">No roles assigned</p>
      ) : (
        <div className="space-y-2">
          {sortedRoles.map((role) => (
            <div
              key={role}
              className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100"
            >
              <span className="font-mono text-sm text-purple-900">{role}</span>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
