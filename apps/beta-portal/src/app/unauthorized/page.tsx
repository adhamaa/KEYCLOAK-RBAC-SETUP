export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Access Denied
        </h1>
        <p className="text-gray-600 mb-6">
          You don&apos;t have permission to access this resource. Please contact your administrator if you believe this is an error.
        </p>
        <a
          href="/dashboard"
          className="btn-primary inline-block"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  )
}
