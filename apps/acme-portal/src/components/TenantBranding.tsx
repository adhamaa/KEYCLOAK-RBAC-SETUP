import { TENANT_CONFIG } from "@/lib/config"
import Image from "next/image"

export function TenantBranding() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
        <span className="text-4xl font-bold text-white">
          {TENANT_CONFIG.name.charAt(0)}
        </span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900">
        {TENANT_CONFIG.name}
      </h1>
      <p className="text-gray-600 mt-2">
        Organization ID: {TENANT_CONFIG.id}
      </p>
    </div>
  )
}
