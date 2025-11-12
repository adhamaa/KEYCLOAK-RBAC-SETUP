import type { Metadata } from "next"
import { SessionProvider } from "@/components/SessionProvider"
import "./globals.css"
import { TENANT_CONFIG } from "@/lib/config"

export const metadata: Metadata = {
  title: TENANT_CONFIG.name,
  description: `${TENANT_CONFIG.name} - Secure Portal`,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
